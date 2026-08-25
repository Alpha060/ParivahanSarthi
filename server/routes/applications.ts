import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateToken, optionalAuthenticateToken, requireRole } from '../middleware/auth';

export const applicationsRouter = Router();

// 1. Get applications (Session-aware: Citizens see only their own applications; Officials/Admins see all)
applicationsRouter.get('/', optionalAuthenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { status, rtoCode, search } = req.query;

    const isOfficial = user && ['OFFICIAL', 'ADMIN', 'SUPER_ADMIN', 'MLO_OFFICER', 'ADTT_INSPECTOR', 'DISPATCH_NODAL', 'RTO_DIRECTOR'].includes(user.role);

    // Build filter
    const whereClause: any = {};

    if (!isOfficial && user?.mobile) {
      whereClause.mobile = user.mobile;
    }

    if (status && status !== 'ALL') {
      whereClause.status = String(status).toUpperCase();
    }

    if (rtoCode) {
      whereClause.rtoCode = String(rtoCode).toUpperCase();
    }

    if (search) {
      const q = String(search).trim();
      whereClause.OR = [
        { applicationId: { contains: q, mode: 'insensitive' } },
        { applicantName: { contains: q, mode: 'insensitive' } },
        { mobile: { contains: q } }
      ];
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' }
        },
        appointments: true,
        payments: true
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve applications.' });
  }
});

// 2. Get detailed application status & timeline by applicationId (e.g. DL1234567890123)
applicationsRouter.get('/:applicationId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.params;

    const application = await prisma.application.findFirst({
      where: {
        OR: [
          { applicationId },
          { id: applicationId }
        ]
      },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' }
        },
        appointments: true,
        payments: true
      }
    });

    if (!application) {
      res.status(404).json({
        success: false,
        error: `No record found for Application Number: ${applicationId}. Please verify and try again.`
      });
      return;
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error('Error retrieving application timeline:', error);
    res.status(500).json({ success: false, error: 'Failed to query national register database.' });
  }
});

// 3. Create a new application (LL / DL / Renewal / Duplicate / IDP)
applicationsRouter.post('/', optionalAuthenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const {
      type,
      subType,
      vehicleClass,
      applicantName,
      mobile,
      state,
      rtoCode,
      rtoName
    } = req.body;

    if (!type || !applicantName || !mobile || !rtoCode) {
      res.status(400).json({ success: false, error: 'Missing mandatory application parameters (type, applicantName, mobile, rtoCode).' });
      return;
    }

    // Generate compliant Sarathi Application ID
    const randomDigits = Math.floor(100000000000 + Math.random() * 900000000000);
    const prefix = type.toLowerCase().includes('learner') ? 'LL' : 'DL';
    const applicationId = `${prefix}${randomDigits}`;

    // 9 Milestone Progression Steps
    const defaultSteps = [
      { stepNumber: 1, stepName: 'Application Submitted Online', isCompleted: true, isCurrent: false, completedAt: new Date().toLocaleString() },
      { stepNumber: 2, stepName: 'e-KYC Verification via UIDAI', isCompleted: true, isCurrent: false, completedAt: new Date().toLocaleString() },
      { stepNumber: 3, stepName: 'Document Upload & Scrutiny', isCompleted: false, isCurrent: true, remarks: 'In verification queue' },
      { stepNumber: 4, stepName: 'Fee Payment Reconciliation', isCompleted: false },
      { stepNumber: 5, stepName: 'RTO Slot Booking Confirmed', isCompleted: false },
      { stepNumber: 6, stepName: 'RTO Verification & Biometric Capture', isCompleted: false },
      { stepNumber: 7, stepName: 'Driving Skill Test Clearance (Form 7B)', isCompleted: false },
      { stepNumber: 8, stepName: 'Smart Card DL Printing & Quality Check', isCompleted: false },
      { stepNumber: 9, stepName: 'Speed Post Dispatch to Residential Address', isCompleted: false }
    ];

    // Atomic insert with nested relation writes
    const newApp = await prisma.application.create({
      data: {
        applicationId,
        userId: user?.id || null,
        type: type.trim(),
        subType: (subType || type).trim(),
        vehicleClass: vehicleClass || 'LMV (Light Motor Vehicle)',
        applicantName: applicantName.trim(),
        mobile: mobile.trim(),
        state: state || 'Jharkhand',
        rtoCode: rtoCode.trim().toUpperCase(),
        rtoName: rtoName || `District Transport Office (${rtoCode})`,
        currentStep: 1,
        currentStepName: 'Application Submitted Online',
        status: 'IN_PROGRESS',
        statusLabel: 'In Progress',
        statusColor: '#137333',
        steps: {
          create: defaultSteps
        }
      },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully to Sarathi Central Register.',
      applicationId: newApp.applicationId,
      application: newApp
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ success: false, error: 'Failed to create application in central database.' });
  }
});

// 4. Officer Action (Approve, Reject, Advance Step, Record Test Result) - Protected by RBAC
applicationsRouter.put(
  '/:applicationId/action',
  authenticateToken,
  requireRole(['OFFICIAL', 'ADMIN', 'MLO_OFFICER', 'ADTT_INSPECTOR', 'DISPATCH_NODAL', 'RTO_DIRECTOR', 'SUPER_ADMIN']),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const { action, remarks } = req.body;
      const officer = (req as any).user;

      const application = await prisma.application.findFirst({
        where: {
          OR: [
            { applicationId },
            { id: applicationId }
          ]
        },
        include: { steps: { orderBy: { stepNumber: 'asc' } } }
      });

      if (!application) {
        res.status(404).json({ success: false, error: 'Application not found in statutory register.' });
        return;
      }

      if (action === 'APPROVE') {
        const speedPostNo = `EP${Math.floor(100000000 + Math.random() * 900000000)}IN`;
        const updated = await prisma.application.update({
          where: { id: application.id },
          data: {
            status: 'APPROVED',
            statusLabel: 'Approved',
            statusColor: '#137333',
            currentStep: 9,
            currentStepName: 'DL Smart Card Dispatched',
            speedPostNo,
            approvedAt: new Date()
          }
        });

        // Mark all steps completed
        await prisma.applicationStep.updateMany({
          where: { applicationId: application.id },
          data: { isCompleted: true, isCurrent: false }
        });

        res.json({
          success: true,
          message: `Application ${application.applicationId} approved by Officer ${officer.name}. Permanent DL and Speed Post number generated.`,
          application: updated
        });
        return;
      }

      if (action === 'REJECT') {
        const updated = await prisma.application.update({
          where: { id: application.id },
          data: {
            status: 'REJECTED',
            statusLabel: 'Rejected / Discrepancy Found',
            statusColor: '#D93025'
          }
        });

        res.json({
          success: true,
          message: `Application ${application.applicationId} marked as rejected. Discrepancy notice issued.`,
          application: updated
        });
        return;
      }

      if (action === 'TEST_PASS' || action === 'ADVANCE_STEP') {
        const nextStep = Math.min(9, application.currentStep + 1);
        const stepNames = [
          '',
          'Application Submitted Online',
          'e-KYC Verification via UIDAI',
          'Document Upload & Scrutiny',
          'Fee Payment Reconciliation',
          'RTO Slot Booking Confirmed',
          'RTO Verification & Biometric Capture',
          'Driving Skill Test Clearance (Form 7B)',
          'Smart Card DL Printing & Quality Check',
          'Speed Post Dispatch to Residential Address'
        ];

        const isCompletedNow = nextStep === 9;

        const updated = await prisma.application.update({
          where: { id: application.id },
          data: {
            currentStep: nextStep,
            currentStepName: stepNames[nextStep] || 'Processing',
            status: isCompletedNow ? 'APPROVED' : 'IN_PROGRESS',
            statusLabel: isCompletedNow ? 'Approved' : 'In Progress',
            statusColor: isCompletedNow ? '#137333' : '#E37400',
            approvedAt: isCompletedNow ? new Date() : undefined,
            speedPostNo: isCompletedNow ? `EP${Math.floor(100000000 + Math.random() * 900000000)}IN` : undefined
          }
        });

        // Update steps in atomic query
        await prisma.applicationStep.updateMany({
          where: { applicationId: application.id, stepNumber: { lte: nextStep } },
          data: { isCompleted: true, isCurrent: false }
        });

        if (!isCompletedNow && nextStep < 9) {
          await prisma.applicationStep.updateMany({
            where: { applicationId: application.id, stepNumber: nextStep + 1 },
            data: { isCurrent: true, remarks: remarks || undefined }
          });
        }

        res.json({
          success: true,
          message: `Application ${application.applicationId} advanced to Step ${nextStep}: ${stepNames[nextStep]}.`,
          application: updated
        });
        return;
      }

      res.status(400).json({ success: false, error: 'Invalid statutory officer action code.' });
    } catch (error) {
      console.error('Error executing officer action:', error);
      res.status(500).json({ success: false, error: 'Failed to execute officer action.' });
    }
  }
);

// 5. Download Digital DL Certificate data
applicationsRouter.get('/:applicationId/certificate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const application = await prisma.application.findFirst({
      where: {
        OR: [
          { applicationId },
          { id: applicationId }
        ]
      }
    });

    if (!application) {
      res.status(404).json({ success: false, error: 'Application record not found.' });
      return;
    }

    const dlNumber = `JH-01-2024-${application.applicationId.slice(-7)}`;
    const issueDate = application.approvedAt ? application.approvedAt.toISOString() : new Date().toISOString();
    const validUntilDate = new Date(Date.now() + 20 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    res.json({
      success: true,
      certificate: {
        licenceNumber: dlNumber,
        dlNumber,
        applicantName: application.applicantName,
        holderName: application.applicantName,
        vehicleClass: application.vehicleClass,
        vehicleClasses: [application.vehicleClass.split(' ')[0] || 'LMV'],
        issueDate,
        validFrom: new Date(issueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        validUntil: validUntilDate,
        validTo: validUntilDate,
        authority: `${application.rtoName}, Government of India`,
        rtoAuthority: `${application.rtoName}, Government of India`,
        rtoName: application.rtoName,
        qrVerificationUrl: `https://sarathi.parivahan.gov.in/verify/${application.applicationId}`,
        qrData: `PARIVAHAN-AUTH-${application.applicationId}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate certificate.' });
  }
});
