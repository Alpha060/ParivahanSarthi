import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/auth';

export const appointmentsRouter = Router();

// 1. Get available appointment dates and slot counts for an RTO based on actual DB records
appointmentsRouter.get('/availability', async (req: Request, res: Response): Promise<void> => {
  try {
    const { rtoCode } = req.query;
    const targetRto = String(rtoCode || 'JH-01').toUpperCase();

    const today = new Date();
    const availableDates = [];
    const MAX_DAILY_SLOT_CAPACITY = 30;

    for (let i = 1; i <= 6; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getFullYear()}`;

      // Skip Sundays (Non-working statutory days)
      if (dayName === 'Sun') continue;

      // Count booked appointments for this date and RTO
      const bookedCount = await prisma.appointment.count({
        where: {
          rtoCode: targetRto,
          appointmentDate: formattedDate,
          status: 'CONFIRMED'
        }
      });

      const remainingSlots = Math.max(0, MAX_DAILY_SLOT_CAPACITY - bookedCount);

      availableDates.push({
        day: dayName,
        date: formattedDate,
        slots: remainingSlots,
        available: remainingSlots > 0
      });
    }

    const timeSlots = [
      '09:30 AM - 10:30 AM',
      '10:30 AM - 11:30 AM',
      '11:30 AM - 12:30 PM',
      '02:00 PM - 03:00 PM',
      '03:00 PM - 04:00 PM',
      '04:00 PM - 05:00 PM'
    ];

    res.json({
      success: true,
      rtoCode: targetRto,
      dates: availableDates,
      timeSlots
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve slot availability.' });
  }
});

// 2. Book an Appointment Slot (Atomic Transaction with Capacity Enforcement)
appointmentsRouter.post('/book', optionalAuthenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      applicationId,
      applicantName,
      mobile,
      rtoCode,
      rtoName,
      serviceType,
      appointmentDate,
      timeSlot
    } = req.body;

    if (!applicantName || !rtoCode || !appointmentDate || !timeSlot) {
      res.status(400).json({ success: false, error: 'Missing mandatory appointment parameters (applicantName, rtoCode, appointmentDate, timeSlot).' });
      return;
    }

    const targetRto = String(rtoCode).toUpperCase();

    // Atomic Transaction to prevent race conditions and overbooking
    const newAppointment = await prisma.$transaction(async (tx) => {
      // Check existing bookings in this specific time slot
      const existingInSlot = await tx.appointment.count({
        where: {
          rtoCode: targetRto,
          appointmentDate,
          timeSlot,
          status: 'CONFIRMED'
        }
      });

      const MAX_PER_SLOT = 15;
      if (existingInSlot >= MAX_PER_SLOT) {
        throw new Error(`Time slot ${timeSlot} on ${appointmentDate} is fully booked. Please select another slot.`);
      }

      // Safely resolve Application foreign key if provided
      let appDbId: string | null = null;
      if (applicationId) {
        const app = await tx.application.findFirst({
          where: {
            OR: [
              { id: applicationId },
              { applicationId: applicationId }
            ]
          }
        });
        if (app) {
          appDbId = app.id;
          // Update application milestone step to step 5 (Slot confirmed)
          if (app.currentStep < 5) {
            await tx.application.update({
              where: { id: app.id },
              data: {
                currentStep: 5,
                currentStepName: 'RTO Slot Booking Confirmed'
              }
            });
            await tx.applicationStep.updateMany({
              where: { applicationId: app.id, stepNumber: { lte: 5 } },
              data: { isCompleted: true, isCurrent: false }
            });
          }
        }
      }

      const currentYear = new Date().getFullYear();
      const appointmentId = `APT-${currentYear}-${Math.floor(10000 + Math.random() * 90000)}`;
      const tokenNumber = `TKN-${String(existingInSlot + 1).padStart(3, '0')}`;

      return await tx.appointment.create({
        data: {
          appointmentId,
          applicationId: appDbId,
          applicantName: String(applicantName).trim(),
          mobile: mobile ? String(mobile).trim() : '9876543210',
          rtoCode: targetRto,
          rtoName: rtoName || `RTO (${targetRto})`,
          serviceType: serviceType || 'Driving Skill Test (Form 7B)',
          appointmentDate,
          timeSlot,
          tokenNumber,
          status: 'CONFIRMED'
        }
      });
    });

    res.status(201).json({
      success: true,
      message: 'Appointment reserved and official queue token issued.',
      appointment: newAppointment
    });
  } catch (error: any) {
    console.error('Error booking appointment:', error);
    res.status(409).json({ success: false, error: error.message || 'Appointment slot reservation failed.' });
  }
});

// 3. Reschedule Appointment (Protected)
appointmentsRouter.put('/:appointmentId/reschedule', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId } = req.params;
    const { appointmentDate, timeSlot } = req.body;
    const user = (req as any).user;

    const appointment = await prisma.appointment.findUnique({
      where: { appointmentId }
    });

    if (!appointment) {
      res.status(404).json({ success: false, error: 'Appointment not found.' });
      return;
    }

    // IDOR Check: User must own the appointment or be an official
    const isOfficial = ['OFFICIAL', 'ADMIN', 'SUPER_ADMIN', 'MLO_OFFICER'].includes(user.role);
    if (!isOfficial && appointment.mobile !== user.mobile) {
      res.status(403).json({ success: false, error: 'Access Denied: You do not own this appointment.' });
      return;
    }

    const updated = await prisma.appointment.update({
      where: { appointmentId },
      data: {
        appointmentDate,
        timeSlot,
        status: 'RESCHEDULED'
      }
    });

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully.',
      appointment: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reschedule appointment.' });
  }
});

// 4. Cancel Appointment (Protected)
appointmentsRouter.delete('/:appointmentId', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId } = req.params;
    const user = (req as any).user;

    const appointment = await prisma.appointment.findUnique({
      where: { appointmentId }
    });

    if (!appointment) {
      res.status(404).json({ success: false, error: 'Appointment record not found.' });
      return;
    }

    // IDOR Check: User must own the appointment or be an official
    const isOfficial = ['OFFICIAL', 'ADMIN', 'SUPER_ADMIN', 'MLO_OFFICER'].includes(user.role);
    if (!isOfficial && appointment.mobile !== user.mobile) {
      res.status(403).json({ success: false, error: 'Access Denied: You cannot cancel another citizen\'s appointment.' });
      return;
    }

    await prisma.appointment.update({
      where: { appointmentId },
      data: { status: 'CANCELLED' }
    });

    res.json({
      success: true,
      message: 'Appointment cancelled. The slot has been released back to public availability.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to cancel appointment.' });
  }
});
