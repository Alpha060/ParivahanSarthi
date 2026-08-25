import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticateToken, requireRole } from '../middleware/auth';

export const noticesRouter = Router();

// 1. Get all active notices (Public)
noticesRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const notices = await prisma.notice.findMany({
      where: { isActive: true },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({ success: true, count: notices.length, notices });
  } catch (error) {
    console.error('Error retrieving notices:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notices.' });
  }
});

// 2. Publish New Official Notice (Protected - Officers & Admins)
noticesRouter.post(
  '/',
  authenticateToken,
  requireRole(['OFFICIAL', 'ADMIN', 'SUPER_ADMIN', 'MLO_OFFICER', 'RTO_DIRECTOR']),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, content, type, badgeColor, badgeBg, priority } = req.body;

      if (!title || !content) {
        res.status(400).json({ success: false, error: 'Title and content are required for official publication.' });
        return;
      }

      const noticeId = `NOTIF-MoRTH-${Math.floor(1000 + Math.random() * 9000)}`;
      const dateFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      const newNotice = await prisma.notice.create({
        data: {
          noticeId,
          title: String(title).trim(),
          content: String(content).trim(),
          type: type || 'New',
          badgeColor: badgeColor || '#0056D2',
          badgeBg: badgeBg || '#EFF6FF',
          date: dateFormatted,
          priority: Number(priority) || 1,
          isActive: true
        }
      });

      res.status(201).json({
        success: true,
        message: 'Official Notice published successfully to National Portal.',
        notice: newNotice
      });
    } catch (error) {
      console.error('Error publishing notice:', error);
      res.status(500).json({ success: false, error: 'Failed to publish official notice.' });
    }
  }
);

// 3. Update / Edit Official Notice (Protected - Officers & Admins)
noticesRouter.put(
  '/:id',
  authenticateToken,
  requireRole(['OFFICIAL', 'ADMIN', 'SUPER_ADMIN', 'MLO_OFFICER', 'RTO_DIRECTOR']),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, content, type, isActive, priority } = req.body;

      const notice = await prisma.notice.findFirst({
        where: {
          OR: [
            { id },
            { noticeId: id }
          ]
        }
      });

      if (!notice) {
        res.status(404).json({ success: false, error: 'Notice record not found.' });
        return;
      }

      const updatedNotice = await prisma.notice.update({
        where: { id: notice.id },
        data: {
          title: title !== undefined ? String(title).trim() : notice.title,
          content: content !== undefined ? String(content).trim() : notice.content,
          type: type !== undefined ? type : notice.type,
          isActive: isActive !== undefined ? Boolean(isActive) : notice.isActive,
          priority: priority !== undefined ? Number(priority) : notice.priority
        }
      });

      res.json({
        success: true,
        message: 'Official Notice updated successfully.',
        notice: updatedNotice
      });
    } catch (error) {
      console.error('Error updating notice:', error);
      res.status(500).json({ success: false, error: 'Failed to update official notice.' });
    }
  }
);

// 4. Delete Official Notice (Protected - Officers & Admins)
noticesRouter.delete(
  '/:id',
  authenticateToken,
  requireRole(['OFFICIAL', 'ADMIN', 'SUPER_ADMIN', 'MLO_OFFICER', 'RTO_DIRECTOR']),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const notice = await prisma.notice.findFirst({
        where: {
          OR: [
            { id },
            { noticeId: id }
          ]
        }
      });

      if (!notice) {
        res.status(404).json({ success: false, error: 'Notice not found.' });
        return;
      }

      await prisma.notice.delete({
        where: { id: notice.id }
      });

      res.json({
        success: true,
        message: 'Official Notice deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting notice:', error);
      res.status(500).json({ success: false, error: 'Failed to delete official notice.' });
    }
  }
);
