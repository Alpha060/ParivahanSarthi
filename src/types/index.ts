export interface StateOption {
  code: string;
  name: string;
  rtoPrefix: string;
  portalActive: boolean;
}

export interface ApplicationItem {
  id: string;
  type: string;
  subType: string;
  status: 'in-progress' | 'approved' | 'upcoming';
  statusLabel: string;
  statusColor: string;
  submittedDate?: string;
  approvedDate?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  currentStep?: string;
  stepNumber?: number;
  totalSteps?: number;
  rtoName: string;
  applicantName: string;
  vehicleClass: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  bgCircleColor: string;
  iconColor: string;
  category: string;
  description: string;
  eligibility: string[];
  documents: string[];
  fee: number;
}

export interface NoticeItem {
  id: string;
  type: 'New' | 'Update' | 'Info';
  badgeColor: string;
  badgeBg: string;
  title: string;
  date: string;
  content: string;
}

export interface RtoOffice {
  code: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}
