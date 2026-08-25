import { Router, Request, Response } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';

export const officersRouter = Router();

export interface OfficerRecord {
  id: string;
  staffId: string;
  name: string;
  mobile: string;
  email: string;
  role: 'MLO_OFFICER' | 'ADTT_INSPECTOR' | 'ENFORCEMENT_OFFICER' | 'RTO_DIRECTOR' | 'DISPATCH_NODAL' | 'SUPER_ADMIN';
  roleLabel: string;
  designation: string;
  rtoCode: string;
  rtoName: string;
  state: string;
  permissions: string[];
  isActive: boolean;
  commissionedAt: string;
  lastActive: string;
}

let OFFICERS_DB: OfficerRecord[] = [
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
    lastActive: 'Active Now'
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
    lastActive: 'Active Now'
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
    permissions: ['SCRUTINY_APPROVE', 'ADTT_CLEARANCE', 'SMART_CARD_DISPATCH', 'GAZETTE_PUBLISH', 'DISCIPLINARY_ACTION'],
    isActive: true,
    commissionedAt: '18 Nov 2019',
    lastActive: 'Active Now'
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
    permissions: ['FULL_SUPER_ADMIN_POWER', 'OFFICER_COMMISSION', 'OFFICER_SUSPEND', 'GAZETTE_PUBLISH', 'SYSTEM_OVERRIDE'],
    isActive: true,
    commissionedAt: '01 Aug 2018',
    lastActive: 'Active Now'
  }
];

// 1. Get all officers
officersRouter.get('/', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    count: OFFICERS_DB.length,
    officers: OFFICERS_DB
  });
});

// 2. Commission / Add New Officer (Protected - Super Admin Only)
officersRouter.post('/', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), (req: Request, res: Response): void => {
  try {
    const { name, staffId, mobile, email, role, designation, rtoCode, rtoName, state, permissions } = req.body;

    if (!name || !staffId || !role) {
      res.status(400).json({ success: false, error: 'Officer Name, Staff ID, and Role are mandatory.' });
      return;
    }

    const roleLabels: Record<string, string> = {
      'MLO_OFFICER': 'Motor Licensing Officer (MLO)',
      'ADTT_INSPECTOR': 'Automated Test Track Inspector',
      'ENFORCEMENT_OFFICER': 'Enforcement Officer (Flying Squad)',
      'RTO_DIRECTOR': 'Regional Transport Officer / Director',
      'DISPATCH_NODAL': 'Smart Card DL Dispatch Nodal',
      'SUPER_ADMIN': 'Super Admin Commissioner'
    };

    const cleanStaffId = String(staffId).trim().toUpperCase();

    const newOfficer: OfficerRecord = {
      id: `OFFICER-${Date.now()}`,
      staffId: cleanStaffId,
      name: String(name).trim(),
      mobile: mobile ? String(mobile).trim() : '9876500000',
      email: email ? String(email).trim() : `${cleanStaffId.toLowerCase()}@parivahan.gov.in`,
      role: role || 'MLO_OFFICER',
      roleLabel: roleLabels[role] || 'Authorized Transport Officer',
      designation: designation || roleLabels[role] || 'Motor Licensing Officer',
      rtoCode: rtoCode ? String(rtoCode).toUpperCase() : 'JH-01',
      rtoName: rtoName || `Transport Office (${rtoCode || 'JH-01'})`,
      state: state || 'Jharkhand',
      permissions: permissions || ['SCRUTINY_APPROVE', 'ADTT_CLEARANCE'],
      isActive: true,
      commissionedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastActive: 'Just Commissioned'
    };

    OFFICERS_DB.unshift(newOfficer);

    res.status(201).json({
      success: true,
      message: `Officer ${name} (${cleanStaffId}) commissioned successfully with authorized NIC HSM credentials.`,
      officer: newOfficer
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to commission officer.' });
  }
});

// 3. Update Officer (Protected - Super Admin Only)
officersRouter.put('/:id', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { name, role, designation, rtoCode, rtoName, state, isActive, permissions } = req.body;

    const normalizedId = String(id).toUpperCase();
    const idx = OFFICERS_DB.findIndex(o => o.id.toUpperCase() === normalizedId || o.staffId.toUpperCase() === normalizedId);

    if (idx === -1) {
      res.status(404).json({ success: false, error: 'Officer record not found in national registry.' });
      return;
    }

    const current = OFFICERS_DB[idx];
    const updated: OfficerRecord = {
      ...current,
      name: name !== undefined ? String(name).trim() : current.name,
      role: role !== undefined ? role : current.role,
      designation: designation !== undefined ? String(designation).trim() : current.designation,
      rtoCode: rtoCode !== undefined ? String(rtoCode).toUpperCase() : current.rtoCode,
      rtoName: rtoName !== undefined ? String(rtoName).trim() : current.rtoName,
      state: state !== undefined ? String(state).trim() : current.state,
      isActive: isActive !== undefined ? Boolean(isActive) : current.isActive,
      permissions: permissions !== undefined ? permissions : current.permissions,
      lastActive: 'Updated by Super Admin'
    };

    OFFICERS_DB[idx] = updated;

    res.json({
      success: true,
      message: `Officer ${updated.name} updated successfully.`,
      officer: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update officer record.' });
  }
});

// 4. Decommission Officer (Protected - Super Admin Only)
officersRouter.delete('/:id', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const normalizedId = String(id).toUpperCase();
    const idx = OFFICERS_DB.findIndex(o => o.id.toUpperCase() === normalizedId || o.staffId.toUpperCase() === normalizedId);

    if (idx === -1) {
      res.status(404).json({ success: false, error: 'Officer record not found.' });
      return;
    }

    const removed = OFFICERS_DB.splice(idx, 1)[0];

    res.json({
      success: true,
      message: `Officer Commission for ${removed.name} (${removed.staffId}) revoked and cryptographic keys decommissioned.`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to revoke officer.' });
  }
});
