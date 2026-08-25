import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateToken, optionalAuthenticateToken, requireRole } from '../middleware/auth';

export const grievancesRouter = Router();

// 1. Submit Grievance
grievancesRouter.post('/', optionalAuthenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationId, applicantName, mobile, category, description } = req.body;

    if (!category || !description) {
      res.status(400).json({ success: false, error: 'Category and description are required.' });
      return;
    }

    const ticketId = `GRV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const grievance = await prisma.grievance.create({
      data: {
        ticketId,
        applicationId: applicationId ? String(applicationId).trim() : null,
        applicantName: applicantName ? String(applicantName).trim() : 'Citizen Applicant',
        mobile: mobile ? String(mobile).trim() : '9876543210',
        category: String(category).trim(),
        description: String(description).trim(),
        status: 'OPEN',
        resolutionNotes: 'Assigned to Public Grievance Nodal Officer. Target resolution: 48-72 hours.'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Grievance docket registered successfully under CPGRAMS & State Transport Directorate.',
      ticketId: grievance.ticketId,
      ticketNumber: grievance.ticketId,
      grievance
    });
  } catch (error) {
    console.error('Error filing grievance:', error);
    res.status(500).json({ success: false, error: 'Failed to record grievance ticket.' });
  }
});

// 2. Track Grievance by Ticket ID
grievancesRouter.get('/:ticketId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const grievance = await prisma.grievance.findUnique({
      where: { ticketId }
    });

    if (!grievance) {
      res.status(404).json({ success: false, error: 'Grievance ticket not found in CPGRAMS registry.' });
      return;
    }

    res.json({ success: true, grievance });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to track grievance.' });
  }
});

// 3. List all Grievances (Officers & Admins)
grievancesRouter.get('/', authenticateToken, requireRole(['OFFICIAL', 'ADMIN', 'SUPER_ADMIN']), async (_req: Request, res: Response): Promise<void> => {
  try {
    const grievances = await prisma.grievance.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: grievances.length, grievances });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch grievances.' });
  }
});

// 4. Resolve / Update Grievance (Officers & Admins)
grievancesRouter.put(
  '/:ticketId',
  authenticateToken,
  requireRole(['OFFICIAL', 'ADMIN', 'SUPER_ADMIN']),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { ticketId } = req.params;
      const { status, resolutionNotes } = req.body;

      const grievance = await prisma.grievance.findUnique({
        where: { ticketId }
      });

      if (!grievance) {
        res.status(404).json({ success: false, error: 'Grievance ticket not found.' });
        return;
      }

      const updated = await prisma.grievance.update({
        where: { ticketId },
        data: {
          status: status || grievance.status,
          resolutionNotes: resolutionNotes !== undefined ? String(resolutionNotes).trim() : grievance.resolutionNotes
        }
      });

      res.json({
        success: true,
        message: `Grievance ${ticketId} updated successfully.`,
        grievance: updated
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update grievance.' });
    }
  }
);
