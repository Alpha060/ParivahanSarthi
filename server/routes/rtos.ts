import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const rtosRouter = Router();

// 1. Search and list RTOs
rtosRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, state, city } = req.query;

    const whereClause: any = { isActive: true };
    const andFilters: any[] = [];

    if (state && state !== 'All') {
      andFilters.push({ state: { contains: String(state), mode: 'insensitive' } });
    }

    if (city) {
      andFilters.push({ city: { contains: String(city), mode: 'insensitive' } });
    }

    if (query) {
      const q = String(query).trim();
      andFilters.push({
        OR: [
          { code: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } },
          { city: { contains: q, mode: 'insensitive' } },
          { state: { contains: q, mode: 'insensitive' } },
          { address: { contains: q, mode: 'insensitive' } }
        ]
      });
    }

    if (andFilters.length > 0) {
      whereClause.AND = andFilters;
    }

    const rtos = await prisma.rtoOffice.findMany({
      where: whereClause,
      orderBy: { code: 'asc' }
    });

    res.json({ success: true, count: rtos.length, rtos });
  } catch (error) {
    console.error('Error fetching RTOs:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve RTO directory.' });
  }
});

// 2. Get single RTO by code (e.g. JH-01)
rtosRouter.get('/:code', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const cleanCode = String(code).toUpperCase().trim();

    const rto = await prisma.rtoOffice.findFirst({
      where: {
        OR: [
          { code: cleanCode },
          { id: code }
        ]
      }
    });

    if (!rto) {
      res.status(404).json({ success: false, error: `RTO with code '${code}' not found.` });
      return;
    }

    res.json({ success: true, rto });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to query RTO record.' });
  }
});
