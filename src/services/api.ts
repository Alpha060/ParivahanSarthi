// Parivahan Sarathi Type-Safe Resilient API Client
import { 
  MOCK_APPLICATIONS, 
  RTO_OFFICES, 
  NOTICES 
} from '../data/mockData';

export const API_BASE_URL = '/api';

// Local Storage Keys
const STORAGE_KEYS = {
  APPLICATIONS: 'sarathi_local_applications',
  APPOINTMENTS: 'sarathi_local_appointments',
  GRIEVANCES: 'sarathi_local_grievances',
  USER: 'sarathi_local_user',
  TOKEN: 'sarathi_jwt_token'
};

function getAuthToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch {
    return null;
  }
}

// Helper to safely execute fetch with fallback if server is offline or .env is unconfigured
async function safeFetch<T = any>(url: string, options?: RequestInit, fallback?: () => T | Promise<T>): Promise<any> {
  const token = getAuthToken();
  const headers = new Headers(options?.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      if (errorData && (errorData.error || errorData.message)) {
        return errorData;
      }
      if ((res.status === 404 || res.status >= 500) && fallback) {
        return await fallback();
      }
      return { success: false, error: `Server response ${res.status}: ${res.statusText || 'Endpoint unavailable'}` };
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      return data;
    }
    if (fallback) return await fallback();
    return await res.text();
  } catch (error: any) {
    if (fallback) {
      return await fallback();
    }
    return { success: false, error: error?.message || 'Network request failed' };
  }
}

function getLocalStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export const api = {
  // Auth
  async sendOtp(identifier: string, type: 'mobile' | 'aadhaar' | 'official' = 'mobile'): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/auth/otp/send`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, type })
      },
      () => ({
        success: true,
        message: `OTP sent successfully to ${identifier}`,
        demoOtp: '123456',
        expiresIn: 300
      })
    );
  },

  async verifyOtp(identifier: string, otp: string, name?: string): Promise<any> {
    const res = await safeFetch(
      `${API_BASE_URL}/auth/otp/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, name })
      },
      () => {
        const user = {
          id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
          name: name || 'Citizen User',
          mobile: identifier,
          role: identifier.startsWith('999') ? 'OFFICIAL' : 'CITIZEN',
          state: 'Jharkhand'
        };
        const token = 'jwt-mock-token-' + Date.now();
        setLocalStored(STORAGE_KEYS.USER, user);
        try {
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        } catch {}
        return {
          success: true,
          message: 'Authentication successful',
          token,
          user
        };
      }
    );

    if (res?.success && res?.token) {
      try {
        localStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
      } catch {}
    }

    return res;
  },

  // Applications
  async getApplications(): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/applications`,
      undefined,
      () => {
        const stored = getLocalStored<any[]>(STORAGE_KEYS.APPLICATIONS, []);
        const merged = [...stored, ...MOCK_APPLICATIONS];
        return { success: true, applications: merged };
      }
    );
  },

  async getApplicationById(applicationId: string): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/applications/${applicationId}`,
      undefined,
      () => {
        const stored = getLocalStored<any[]>(STORAGE_KEYS.APPLICATIONS, []);
        const found = stored.find(a => a.id === applicationId || a.applicationId === applicationId) ||
                      MOCK_APPLICATIONS.find(a => a.id === applicationId);

        if (found) {
          const isApproved = found.status === 'APPROVED' || found.status === 'approved';
          const currentStep = found.stepNumber || (isApproved ? 9 : 6);

          const steps = [
            { stepNumber: 1, stepName: 'Application Submitted Online', isCompleted: true, completedAt: found.submittedDate || '14 May 2024, 10:15 AM' },
            { stepNumber: 2, stepName: 'e-KYC Verification via UIDAI', isCompleted: true, completedAt: '14 May 2024, 10:18 AM' },
            { stepNumber: 3, stepName: 'Document Upload & Scrutiny', isCompleted: true, completedAt: '14 May 2024, 11:30 AM' },
            { stepNumber: 4, stepName: 'Fee Payment Reconciliation', isCompleted: true, completedAt: '14 May 2024, 11:35 AM' },
            { stepNumber: 5, stepName: 'RTO Slot Booking Confirmed', isCompleted: true, completedAt: '15 May 2024, 09:00 AM' },
            { stepNumber: 6, stepName: 'RTO Verification & Biometric Capture', isCompleted: currentStep >= 6, isCurrent: currentStep === 6, completedAt: currentStep >= 6 ? '16 May 2024, 02:40 PM' : undefined },
            { stepNumber: 7, stepName: 'Driving Skill Test Clearance (Form 7B)', isCompleted: currentStep >= 7, isCurrent: currentStep === 7, remarks: currentStep < 7 ? 'Pending skill evaluation' : 'Passed with Grade A' },
            { stepNumber: 8, stepName: 'Smart Card DL Printing & Quality Check', isCompleted: currentStep >= 8, isCurrent: currentStep === 8, remarks: currentStep >= 8 ? 'Printed & Encoded' : 'Pending test clearance' },
            { stepNumber: 9, stepName: 'Speed Post Dispatch to Residential Address', isCompleted: currentStep === 9, isCurrent: currentStep === 9, remarks: isApproved ? 'Delivered via Speed Post' : 'In transit' }
          ];

          return {
            success: true,
            application: {
              ...found,
              applicationId: found.id || found.applicationId,
              steps,
              speedPostNo: isApproved ? 'EP928371928IN' : undefined
            }
          };
        }

        const isLL = applicationId.toUpperCase().startsWith('LL');
        return {
          success: true,
          application: {
            applicationId,
            type: isLL ? 'Learner Licence (MCWG + LMV)' : 'Driving Licence (LMV)',
            subType: isLL ? 'New Learner Licence' : 'New Permanent DL',
            vehicleClass: 'LMV (Light Motor Vehicle)',
            applicantName: 'Citizen Applicant',
            mobile: '9876543210',
            state: 'Jharkhand',
            rtoCode: 'JH-01',
            rtoName: 'Ranchi RTO (JH-01)',
            currentStep: 6,
            currentStepName: 'RTO Verification',
            status: 'IN_PROGRESS',
            statusLabel: 'In Progress',
            statusColor: '#137333',
            submittedAt: new Date().toISOString(),
            steps: [
              { stepNumber: 1, stepName: 'Application Submitted Online', isCompleted: true, completedAt: 'Today, 10:00 AM' },
              { stepNumber: 2, stepName: 'e-KYC Verification via UIDAI', isCompleted: true, completedAt: 'Today, 10:05 AM' },
              { stepNumber: 3, stepName: 'Document Upload & Scrutiny', isCompleted: true, completedAt: 'Today, 10:30 AM' },
              { stepNumber: 4, stepName: 'Fee Payment Reconciliation', isCompleted: true, completedAt: 'Today, 10:35 AM' },
              { stepNumber: 5, stepName: 'RTO Slot Booking Confirmed', isCompleted: true, completedAt: 'Today, 11:00 AM' },
              { stepNumber: 6, stepName: 'RTO Verification & Biometric Capture', isCompleted: true, isCurrent: true, completedAt: 'In Progress' },
              { stepNumber: 7, stepName: 'Driving Skill Test Clearance (Form 7B)', isCompleted: false, remarks: 'Scheduled' },
              { stepNumber: 8, stepName: 'Smart Card DL Printing & Quality Check', isCompleted: false },
              { stepNumber: 9, stepName: 'Speed Post Dispatch to Residential Address', isCompleted: false }
            ]
          }
        };
      }
    );
  },

  async submitApplication(data: {
    type: string;
    subType?: string;
    vehicleClass?: string;
    applicantName: string;
    mobile: string;
    state?: string;
    rtoCode: string;
    rtoName?: string;
    feeAmount?: number;
    paymentStatus?: 'PAID' | 'PENDING';
    status?: string;
  }): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/applications`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const randomDigits = Math.floor(100000000000 + Math.random() * 900000000000);
        const prefix = data.type.toLowerCase().includes('learner') ? 'LL' : 'DL';
        const applicationId = `${prefix}${randomDigits}`;
        const isPaid = data.paymentStatus === 'PAID' || (data.feeAmount === 0);

        const newApp = {
          id: applicationId,
          applicationId,
          type: data.type,
          subType: data.subType || data.type,
          vehicleClass: data.vehicleClass || 'LMV (Light Motor Vehicle)',
          applicantName: data.applicantName,
          mobile: data.mobile,
          state: data.state || 'Jharkhand',
          rtoCode: data.rtoCode,
          rtoName: data.rtoName || `District Transport Office (${data.rtoCode})`,
          currentStep: 1,
          stepNumber: 1,
          totalSteps: 9,
          currentStepName: isPaid ? 'Application Submitted Online' : 'Draft Saved - Payment Pending',
          status: isPaid ? 'in-progress' : 'DRAFT_PAYMENT_PENDING',
          statusLabel: isPaid ? 'In Progress' : 'Draft (Payment Pending)',
          statusColor: isPaid ? '#137333' : '#D97706',
          paymentStatus: isPaid ? 'PAID' : 'PENDING',
          feeAmount: data.feeAmount || 0,
          submittedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };

        const existing = getLocalStored<any[]>(STORAGE_KEYS.APPLICATIONS, []);
        setLocalStored(STORAGE_KEYS.APPLICATIONS, [newApp, ...existing]);

        return {
          success: true,
          message: isPaid 
            ? 'Application registered successfully in Sarathi Central Register' 
            : 'Application saved as draft. Statutory payment pending before submission to RTO.',
          applicationId,
          application: newApp
        };
      }
    );
  },

  async settleApplicationPayment(applicationId: string, paymentMode: string): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/applications/${applicationId}/pay`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMode })
      },
      () => {
        const localApps = getLocalStored<any[]>(STORAGE_KEYS.APPLICATIONS, MOCK_APPLICATIONS);
        const updated = localApps.map(app => {
          if (app.id === applicationId || app.applicationId === applicationId) {
            return {
              ...app,
              paymentStatus: 'PAID',
              status: 'in-progress',
              statusLabel: 'In Progress',
              statusColor: '#137333',
              currentStepName: 'Application Submitted Online (Scrutiny Queue)',
              paidAt: new Date().toISOString()
            };
          }
          return app;
        });
        setLocalStored(STORAGE_KEYS.APPLICATIONS, updated);
        return {
          success: true,
          message: 'Payment settled successfully. Application transmitted to RTO scrutiny queue.'
        };
      }
    );
  },

  async officerTakeAction(applicationId: string, action: 'APPROVE' | 'REJECT' | 'TEST_PASS' | 'ADVANCE_STEP', data?: { remarks?: string; testGrade?: string; officerId?: string }): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/applications/${applicationId}/action`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data })
      },
      () => {
        const localApps = getLocalStored<any[]>(STORAGE_KEYS.APPLICATIONS, MOCK_APPLICATIONS);
        const updated = localApps.map(app => {
          if (app.id === applicationId || app.applicationId === applicationId) {
            if (action === 'APPROVE') {
              return { 
                ...app, 
                status: 'APPROVED', 
                currentStep: 9, 
                currentStepName: 'Driving Licence Issued & Dispatched',
                dlNumber: app.dlNumber || `JH01 2026${Math.floor(1000000 + Math.random() * 9000000)}` 
              };
            }
            if (action === 'REJECT') {
              return { 
                ...app, 
                status: 'REJECTED', 
                rejectionReason: data?.remarks || 'Discrepancy in documents / biometric mismatch' 
              };
            }
            if (action === 'TEST_PASS') {
              return { 
                ...app, 
                status: 'APPROVED', 
                currentStep: 8, 
                currentStepName: 'DL Printing & Dispatch Queue',
                testScore: data?.testGrade || 'Passed' 
              };
            }
            if (action === 'ADVANCE_STEP') {
              const nextStep = Math.min(9, (app.currentStep || 1) + 1);
              return { 
                ...app, 
                currentStep: nextStep,
                status: nextStep >= 8 ? 'APPROVED' : app.status 
              };
            }
          }
          return app;
        });
        setLocalStored(STORAGE_KEYS.APPLICATIONS, updated);
        return {
          success: true,
          message: `Officer action ${action} executed successfully for ${applicationId}`
        };
      }
    );
  },

  async getCertificate(applicationId: string): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/applications/${applicationId}/certificate`,
      undefined,
      () => ({
        success: true,
        certificate: {
          licenceNumber: 'JH-01-2024-' + Math.floor(1000000 + Math.random() * 9000000),
          dlNumber: 'JH-01-2024-' + Math.floor(1000000 + Math.random() * 9000000),
          applicantName: 'Krishna Mahto',
          holderName: 'Krishna Mahto',
          validFrom: '10 May 2024',
          validTo: '09 May 2044',
          validUntil: '09 May 2044',
          vehicleClasses: ['LMV', 'MCWG'],
          vehicleClass: 'LMV, MCWG',
          rtoAuthority: 'Ranchi RTO (JH-01)',
          authority: 'Ranchi RTO (JH-01)',
          qrVerificationUrl: `/status?appId=${applicationId}`
        }
      })
    );
  },

  // Appointments
  async getAppointmentAvailability(rtoCode?: string): Promise<any> {
    const url = rtoCode ? `${API_BASE_URL}/appointments/availability?rtoCode=${rtoCode}` : `${API_BASE_URL}/appointments/availability`;
    return safeFetch(
      url,
      undefined,
      () => ({
        success: true,
        rtoCode: rtoCode || 'JH-01',
        dates: [
          { day: 'Mon', date: '25 Aug 2026', slots: 14, available: true },
          { day: 'Tue', date: '26 Aug 2026', slots: 22, available: true },
          { day: 'Wed', date: '27 Aug 2026', slots: 0, available: false },
          { day: 'Thu', date: '28 Aug 2026', slots: 18, available: true },
          { day: 'Fri', date: '29 Aug 2026', slots: 30, available: true }
        ],
        timeSlots: [
          '09:30 AM - 10:30 AM',
          '10:30 AM - 11:30 AM',
          '11:30 AM - 12:30 PM',
          '02:00 PM - 03:00 PM',
          '03:00 PM - 04:00 PM',
          '04:00 PM - 05:00 PM'
        ]
      })
    );
  },

  async bookAppointment(data: {
    applicationId?: string;
    applicantName: string;
    mobile?: string;
    rtoCode: string;
    rtoName?: string;
    serviceType?: string;
    appointmentDate: string;
    timeSlot: string;
  }): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/appointments/book`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const appointmentId = 'APT-2024-' + Math.floor(10000 + Math.random() * 90000);
        const tokenNumber = 'TKN-' + String(Math.floor(1 + Math.random() * 99)).padStart(3, '0');
        const appointment = {
          id: appointmentId,
          appointmentId,
          tokenNumber,
          ...data,
          status: 'CONFIRMED',
          bookedAt: new Date().toISOString()
        };

        const existing = getLocalStored<any[]>(STORAGE_KEYS.APPOINTMENTS, []);
        setLocalStored(STORAGE_KEYS.APPOINTMENTS, [appointment, ...existing]);

        return {
          success: true,
          message: 'Appointment reserved successfully',
          appointmentId,
          tokenNumber,
          appointment
        };
      }
    );
  },

  async cancelAppointment(appointmentId: string): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/appointments/${appointmentId}`,
      { method: 'DELETE' },
      () => ({
        success: true,
        message: `Appointment ${appointmentId} has been cancelled successfully.`
      })
    );
  },

  // Payments & Statutory Calculation
  async calculateFee(data: {
    serviceType: string;
    vehicleCategory?: string;
    includeSmartCard?: boolean;
    includePostal?: boolean;
    lateMonths?: number;
  }): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/payments/calculate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        let baseFee = 200;
        let testFee = 300;
        const smartCardFee = data.includeSmartCard !== false ? 200 : 0;
        const postalFee = data.includePostal !== false ? 50 : 0;
        const lateFee = (data.lateMonths || 0) * 50;

        if (data.serviceType.toLowerCase().includes('learner')) {
          baseFee = 150;
          testFee = 50;
        } else if (data.serviceType.toLowerCase().includes('renew')) {
          baseFee = 200;
          testFee = 0;
        } else if (data.serviceType.toLowerCase().includes('duplicate')) {
          baseFee = 200;
          testFee = 0;
        }

        const totalAmount = baseFee + testFee + smartCardFee + postalFee + lateFee;

        return {
          success: true,
          breakdown: {
            baseFee,
            testFee,
            smartCardFee,
            postalFee,
            lateFee,
            totalAmount,
            cmvrRule: 'Central Motor Vehicles Rules, 1989 (Rule 32 Table of Fees)'
          }
        };
      }
    );
  },

  async initiatePayment(data: {
    applicationId?: string;
    applicantName?: string;
    amount: number;
    breakdown?: any;
    paymentMode?: string;
  }): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/payments/initiate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const transactionId = 'TXN-SAR-' + Math.floor(100000 + Math.random() * 900000);
        const paymentObj = {
          transactionId,
          bankRefNo: 'SBIN' + Math.floor(100000000 + Math.random() * 900000000),
          receiptNumber: 'RCP-2024-' + Math.floor(10000 + Math.random() * 90000),
          amountPaid: data.amount,
          paidAt: new Date().toISOString()
        };
        return {
          success: true,
          message: 'Payment verified & reconciled instantly via Bharatkosh / GRAS Gateway',
          transactionId,
          bankRefNo: paymentObj.bankRefNo,
          receiptNumber: paymentObj.receiptNumber,
          amountPaid: data.amount,
          paidAt: paymentObj.paidAt,
          payment: paymentObj
        };
      }
    );
  },

  async reconcilePayment(transactionIdOrAppId?: string, explicitAppId?: string): Promise<any> {
    const isTxn = transactionIdOrAppId?.startsWith('TXN-');
    const transactionId = isTxn ? transactionIdOrAppId : undefined;
    const applicationId = explicitAppId || (!isTxn ? transactionIdOrAppId : undefined);

    return safeFetch(
      `${API_BASE_URL}/payments/reconcile`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, applicationId })
      },
      () => ({
        success: true,
        message: 'Payment reconciliation verified. Transaction settled with National Treasury.',
        status: 'SUCCESS',
        reconciledAt: new Date().toISOString()
      })
    );
  },

  // RTO Directory
  async searchRtos(query?: string, state?: string, city?: string): Promise<any> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (state) params.append('state', state);
    if (city) params.append('city', city);

    return safeFetch(
      `${API_BASE_URL}/rtos?${params.toString()}`,
      undefined,
      () => {
        let results = RTO_OFFICES;
        if (query) {
          const q = query.toLowerCase();
          results = results.filter(r => 
            r.name.toLowerCase().includes(q) ||
            r.code.toLowerCase().includes(q) ||
            r.city.toLowerCase().includes(q) ||
            r.state.toLowerCase().includes(q)
          );
        }
        if (state && state !== 'All') {
          results = results.filter(r => r.state.toLowerCase() === state.toLowerCase());
        }
        return {
          success: true,
          count: results.length,
          rtos: results
        };
      }
    );
  },

  // Grievances
  async submitGrievance(data: {
    applicationId?: string;
    applicantName?: string;
    mobile?: string;
    category: string;
    description: string;
  }): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/grievances`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const ticketNumber = 'CPGRAMS-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
        const grievance = {
          id: ticketNumber,
          ticketNumber,
          ...data,
          status: 'REGISTERED',
          createdAt: new Date().toISOString()
        };

        const existing = getLocalStored<any[]>(STORAGE_KEYS.GRIEVANCES, []);
        setLocalStored(STORAGE_KEYS.GRIEVANCES, [grievance, ...existing]);

        return {
          success: true,
          message: 'Grievance docket successfully registered under CPGRAMS & State Transport Department',
          ticketNumber,
          estimatedResolutionDays: 7,
          grievance
        };
      }
    );
  },

  // Notices
  async getNotices(): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/notices`,
      undefined,
      () => ({
        success: true,
        count: NOTICES.length,
        notices: NOTICES
      })
    );
  },

  async createNotice(data: {
    title: string;
    content: string;
    type?: string;
    badgeColor?: string;
    badgeBg?: string;
    priority?: number;
  }): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/notices`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => ({
        success: true,
        message: 'Official Notice published successfully (simulated).',
        notice: {
          id: 'NOTIF-' + Date.now(),
          noticeId: `NOTIF-MoRTH-${Math.floor(1000 + Math.random() * 9000)}`,
          title: data.title,
          content: data.content,
          type: data.type || 'New',
          badgeColor: data.badgeColor || '#0056D2',
          badgeBg: data.badgeBg || '#EFF6FF',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          priority: data.priority || 1,
          isActive: true
        }
      })
    );
  },

  async updateNotice(id: string, data: any): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/notices/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => ({
        success: true,
        message: 'Official Notice updated successfully.'
      })
    );
  },

  async deleteNotice(id: string): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/notices/${id}`,
      {
        method: 'DELETE'
      },
      () => ({
        success: true,
        message: 'Official Notice deleted successfully.'
      })
    );
  },

  // Official & Super Admin Authentication
  async officialLogin(credentials: { username?: string; staffId?: string; password?: string; pin?: string }): Promise<any> {
    const res = await safeFetch(
      `${API_BASE_URL}/auth/official/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      },
      () => {
        const id = (credentials.staffId || credentials.username || '').toUpperCase();
        const isAdmin = id.includes('ADMIN') || id.includes('MORTH') || id === 'SUPERADMIN';

        const user = isAdmin ? {
          id: 'USER-ADMIN-01',
          name: 'Dr. Rajesh Kumar, IAS',
          staffId: 'ADMIN-MoRTH-01',
          role: 'ADMIN',
          designation: 'Principal Secretary & Transport Commissioner (Director General)',
          rtoCode: 'ALL-INDIA',
          rtoName: 'MoRTH National Directorate, New Delhi',
          state: 'Central Directorate',
          mobile: '9810099887',
          email: 'rajesh.kumar.ias@nic.in'
        } : {
          id: 'USER-OFFICER-01',
          name: 'Shri S. K. Verma',
          staffId: credentials.staffId || 'OFFICER-JH01',
          role: 'OFFICIAL',
          designation: 'Senior Motor Licensing Officer (MLO)',
          rtoCode: 'JH-01',
          rtoName: 'Ranchi Regional Transport Office (JH-01)',
          state: 'Jharkhand',
          mobile: '9835012345',
          email: 'skverma.mlo@parivahan.gov.in'
        };

        const token = `token-${Date.now()}`;
        setLocalStored(STORAGE_KEYS.USER, user);
        try {
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        } catch {}
        return {
          success: true,
          message: isAdmin ? 'Super Admin authenticated' : 'Officer authenticated',
          token,
          user
        };
      }
    );

    if (res?.success && res?.token) {
      try {
        localStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
      } catch {}
    }

    return res;
  },

  // Super Admin Officers Directory & Commissioning
  async getOfficers(): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/officers`,
      undefined,
      () => ({
        success: true,
        officers: [
          {
            id: 'OFFICER-001',
            staffId: 'OFFICER-JH01',
            name: 'Shri S. K. Verma',
            mobile: '9835012345',
            email: 'skverma.mlo@parivahan.gov.in',
            role: 'MLO_OFFICER',
            roleLabel: 'Senior Motor Licensing Officer',
            designation: 'Senior MLO & Test Track Inspector',
            rtoCode: 'JH-01',
            rtoName: 'Ranchi Regional Transport Office (JH-01)',
            state: 'Jharkhand',
            permissions: ['SCRUTINY_APPROVE', 'ADTT_CLEARANCE', 'SMART_CARD_DISPATCH'],
            isActive: true,
            commissionedAt: '12 Jan 2021',
            lastActive: 'Just now'
          },
          {
            id: 'OFFICER-002',
            staffId: 'INSPECT-DL01',
            name: 'Smt. Priya Sharma',
            mobile: '9811223344',
            email: 'priya.sharma@parivahan.gov.in',
            role: 'ADTT_INSPECTOR',
            roleLabel: 'ADTT Track Specialist',
            designation: 'Automated Driving Track Inspector',
            rtoCode: 'DL-01',
            rtoName: 'Delhi Civil Lines RTO (DL-01)',
            state: 'Delhi',
            permissions: ['ADTT_CLEARANCE', 'BIOMETRIC_VERIFY'],
            isActive: true,
            commissionedAt: '05 Mar 2022',
            lastActive: '10 mins ago'
          },
          {
            id: 'OFFICER-003',
            staffId: 'DIRECTOR-MH01',
            name: 'Shri Manoj Kulkarni',
            mobile: '9822334455',
            email: 'manoj.kulkarni@parivahan.gov.in',
            role: 'RTO_DIRECTOR',
            roleLabel: 'Regional Transport Director',
            designation: 'Deputy Commissioner & Regional Director',
            rtoCode: 'MH-01',
            rtoName: 'Mumbai Central RTO (MH-01)',
            state: 'Maharashtra',
            permissions: ['SCRUTINY_APPROVE', 'ADTT_CLEARANCE', 'SMART_CARD_DISPATCH', 'GAZETTE_PUBLISH'],
            isActive: true,
            commissionedAt: '18 Nov 2019',
            lastActive: '1 hour ago'
          },
          {
            id: 'OFFICER-004',
            staffId: 'ADMIN-MoRTH-01',
            name: 'Dr. Rajesh Kumar, IAS',
            mobile: '9810099887',
            email: 'rajesh.kumar.ias@nic.in',
            role: 'SUPER_ADMIN',
            roleLabel: 'Director General & Commissioner',
            designation: 'Principal Secretary & Transport Commissioner (Director General)',
            rtoCode: 'ALL-INDIA',
            rtoName: 'MoRTH National Directorate, New Delhi',
            state: 'Central Directorate',
            permissions: ['FULL_SUPER_ADMIN_POWER', 'OFFICER_COMMISSION', 'OFFICER_SUSPEND', 'GAZETTE_PUBLISH'],
            isActive: true,
            commissionedAt: '01 Aug 2018',
            lastActive: 'Active Now'
          }
        ]
      })
    );
  },

  async createOfficer(data: any): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/officers`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => ({
        success: true,
        message: `Officer ${data.name} commissioned successfully.`,
        officer: {
          id: `OFFICER-${Date.now()}`,
          staffId: data.staffId?.toUpperCase(),
          name: data.name,
          mobile: data.mobile || '9876543210',
          email: data.email || `${data.staffId?.toLowerCase()}@parivahan.gov.in`,
          role: data.role || 'MLO_OFFICER',
          roleLabel: data.designation || 'Transport Licensing Officer',
          designation: data.designation || 'Motor Licensing Officer',
          rtoCode: data.rtoCode || 'JH-01',
          rtoName: data.rtoName || 'Ranchi RTO (JH-01)',
          state: data.state || 'Jharkhand',
          permissions: data.permissions || ['SCRUTINY_APPROVE'],
          isActive: true,
          commissionedAt: 'Just Now',
          lastActive: 'Active'
        }
      })
    );
  },

  async updateOfficer(id: string, data: any): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/officers/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => ({
        success: true,
        message: 'Officer record updated successfully.'
      })
    );
  },

  async deleteOfficer(id: string): Promise<any> {
    return safeFetch(
      `${API_BASE_URL}/officers/${id}`,
      {
        method: 'DELETE'
      },
      () => ({
        success: true,
        message: 'Officer commission revoked successfully.'
      })
    );
  }
};
