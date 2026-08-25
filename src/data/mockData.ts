import { StateOption, ApplicationItem, ServiceCard, NoticeItem, RtoOffice } from '../types';

export const INDIAN_STATES: StateOption[] = [
  { code: 'JH', name: 'Jharkhand', rtoPrefix: 'JH', portalActive: true },
  { code: 'DL', name: 'Delhi (NCT)', rtoPrefix: 'DL', portalActive: true },
  { code: 'MH', name: 'Maharashtra', rtoPrefix: 'MH', portalActive: true },
  { code: 'KA', name: 'Karnataka', rtoPrefix: 'KA', portalActive: true },
  { code: 'TN', name: 'Tamil Nadu', rtoPrefix: 'TN', portalActive: true },
  { code: 'UP', name: 'Uttar Pradesh', rtoPrefix: 'UP', portalActive: true },
  { code: 'BR', name: 'Bihar', rtoPrefix: 'BR', portalActive: true },
  { code: 'WB', name: 'West Bengal', rtoPrefix: 'WB', portalActive: true },
  { code: 'GJ', name: 'Gujarat', rtoPrefix: 'GJ', portalActive: true },
  { code: 'RJ', name: 'Rajasthan', rtoPrefix: 'RJ', portalActive: true },
  { code: 'MP', name: 'Madhya Pradesh', rtoPrefix: 'MP', portalActive: true },
  { code: 'AP', name: 'Andhra Pradesh', rtoPrefix: 'AP', portalActive: true },
  { code: 'TS', name: 'Telangana', rtoPrefix: 'TS', portalActive: true },
  { code: 'KL', name: 'Kerala', rtoPrefix: 'KL', portalActive: true },
  { code: 'PB', name: 'Punjab', rtoPrefix: 'PB', portalActive: true },
  { code: 'HR', name: 'Haryana', rtoPrefix: 'HR', portalActive: true },
  { code: 'OD', name: 'Odisha', rtoPrefix: 'OD', portalActive: true },
  { code: 'AS', name: 'Assam', rtoPrefix: 'AS', portalActive: true },
  { code: 'CT', name: 'Chhattisgarh', rtoPrefix: 'CG', portalActive: true },
  { code: 'UT', name: 'Uttarakhand', rtoPrefix: 'UK', portalActive: true },
  { code: 'HP', name: 'Himachal Pradesh', rtoPrefix: 'HP', portalActive: true },
  { code: 'JK', name: 'Jammu & Kashmir', rtoPrefix: 'JK', portalActive: true },
  { code: 'GA', name: 'Goa', rtoPrefix: 'GA', portalActive: true },
  { code: 'PY', name: 'Puducherry', rtoPrefix: 'PY', portalActive: true },
  { code: 'CH', name: 'Chandigarh', rtoPrefix: 'CH', portalActive: true },
  { code: 'TR', name: 'Tripura', rtoPrefix: 'TR', portalActive: true },
  { code: 'ML', name: 'Meghalaya', rtoPrefix: 'ML', portalActive: true },
  { code: 'MN', name: 'Manipur', rtoPrefix: 'MN', portalActive: true },
  { code: 'NL', name: 'Nagaland', rtoPrefix: 'NL', portalActive: true },
  { code: 'MZ', name: 'Mizoram', rtoPrefix: 'MZ', portalActive: true },
  { code: 'AR', name: 'Arunachal Pradesh', rtoPrefix: 'AR', portalActive: true },
  { code: 'SK', name: 'Sikkim', rtoPrefix: 'SK', portalActive: true },
  { code: 'AN', name: 'Andaman & Nicobar Islands', rtoPrefix: 'AN', portalActive: true },
  { code: 'LD', name: 'Lakshadweep', rtoPrefix: 'LD', portalActive: true },
  { code: 'LA', name: 'Ladakh', rtoPrefix: 'LA', portalActive: true },
  { code: 'DN', name: 'Dadra & Nagar Haveli and Daman & Diu', rtoPrefix: 'DD', portalActive: true }
];

export const QUICK_SERVICES: ServiceCard[] = [
  {
    id: 'll-new',
    title: 'Get a Learner Licence',
    subtitle: 'Apply for new LL',
    iconName: 'CreditCard',
    bgCircleColor: '#F3E8FF',
    iconColor: '#7E22CE',
    category: 'Licence Services',
    description: 'Apply online for a new Learner Licence with Aadhaar authentication from home.',
    eligibility: ['Age: 16+ for gearless 2-wheeler, 18+ for LMV', 'Valid Aadhaar / Age Proof', 'Medical fitness declaration (Form 1)'],
    documents: ['Aadhaar Card', 'Age Proof (10th Marks card / Birth certificate)', 'Address proof', 'Passport photo & signature'],
    fee: 350
  },
  {
    id: 'dl-new',
    title: 'Get a Driving Licence',
    subtitle: 'Apply for new DL',
    iconName: 'SteeringWheel',
    bgCircleColor: '#E0F2FE',
    iconColor: '#0284C7',
    category: 'Licence Services',
    description: 'Apply for permanent Driving Licence after 30 days of Learner Licence validity.',
    eligibility: ['Valid Learner Licence (minimum 30 days old)', 'Passed driving skill test at RTO / ADTC'],
    documents: ['Active Learner Licence number', 'Form 5 Driving School Certificate (if applicable)', 'Slot booking slip'],
    fee: 1000
  },
  {
    id: 'dl-renew',
    title: 'Renew Driving Licence',
    subtitle: 'Renew your DL',
    iconName: 'RotateCcw',
    bgCircleColor: '#DCFCE7',
    iconColor: '#16A34A',
    category: 'Renewal Services',
    description: 'Renew your expired or near-expiry Driving Licence completely contact-less.',
    eligibility: ['Expired or expiring within 1 year before/after expiry date', 'Form 1A Medical certificate for age 40+'],
    documents: ['Original Driving Licence', 'Form 1A Medical Certificate (if age > 40)', 'Address proof (if updated)'],
    fee: 450
  },
  {
    id: 'dl-update',
    title: 'Change or Update Details',
    subtitle: 'Address, Name, DOB and more',
    iconName: 'Edit3',
    bgCircleColor: '#FFEDD5',
    iconColor: '#EA580C',
    category: 'Update Services',
    description: 'Update personal particulars such as residential address, name, or date of birth.',
    eligibility: ['Valid existing Driving Licence', 'Supporting legal Gazette / Aadhaar proof'],
    documents: ['Aadhaar Card for e-KYC', 'Gazette Notification / Marriage certificate (for name change)', 'Proof of current address'],
    fee: 500
  },
  {
    id: 'dl-add-class',
    title: 'Add Vehicle Class',
    subtitle: 'Add another class to your DL',
    iconName: 'Car',
    bgCircleColor: '#FFE4E6',
    iconColor: '#E11D48',
    category: 'Licence Services',
    description: 'Endorse additional category of vehicle (e.g., MCWG, LMV, Heavy Transport) to existing DL.',
    eligibility: ['Existing valid Driving Licence', 'Learner Licence for the new requested class'],
    documents: ['Existing DL card', 'LL for new category', 'Form 5 Driving Certificate (for Transport)'],
    fee: 800
  },
  {
    id: 'dl-replace',
    title: 'Replace Driving Licence',
    subtitle: 'Lost, Damaged or Duplicate',
    iconName: 'FileText',
    bgCircleColor: '#F3E8FF',
    iconColor: '#9333EA',
    category: 'Duplicate Services',
    description: 'Request duplicate Smart Card DL in case of theft, loss, mutilation or damage.',
    eligibility: ['Registered DL holder in Sarathi database', 'Police NCR/FIR copy in case of lost card'],
    documents: ['Police NCR report (Lost DL)', 'Damaged DL card (if physical damage)', 'Valid ID proof'],
    fee: 400
  },
  {
    id: 'dl-idp',
    title: 'International Driving Permit',
    subtitle: 'Apply for IDP',
    iconName: 'Globe',
    bgCircleColor: '#CCFBF1',
    iconColor: '#0D9488',
    category: 'International Services',
    description: 'Obtain an official 1-year International Driving Permit for traveling abroad.',
    eligibility: ['Valid Indian Permanent Driving Licence', 'Valid Passport and Visa / Air Ticket'],
    documents: ['Valid Indian Passport', 'Valid Driving Licence', 'Air ticket and country Visa', 'Form 1A Medical Fitness'],
    fee: 1000
  }
];

export const MOCK_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'DL1234567890123',
    type: 'Driving Licence (LMV)',
    subType: 'New Permanent DL',
    status: 'in-progress',
    statusLabel: 'In Progress',
    statusColor: '#137333',
    submittedDate: '14 May 2024',
    currentStep: 'RTO Verification',
    stepNumber: 6,
    totalSteps: 9,
    rtoName: 'Ranchi RTO (JH-01)',
    applicantName: 'Krishna Mahto',
    vehicleClass: 'LMV (Light Motor Vehicle)'
  },
  {
    id: 'DL9876543210987',
    type: 'Renewal of Driving Licence',
    subType: 'DL Renewal with e-KYC',
    status: 'approved',
    statusLabel: 'Approved',
    statusColor: '#137333',
    approvedDate: '10 May 2024',
    currentStep: 'Ready for Download',
    rtoName: 'Dhanbad RTO (JH-10)',
    applicantName: 'Ananya Sharma',
    vehicleClass: 'MCWG + LMV'
  },
  {
    id: 'LL4567891234567',
    type: 'Learner Licence (LMV)',
    subType: 'Online LL Skill Test',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    statusColor: '#1A73E8',
    appointmentDate: '20 May 2024',
    appointmentTime: '10:30 AM',
    currentStep: 'Test Appointment',
    rtoName: 'Jamshedpur RTO (JH-05)',
    applicantName: 'Rohit Verma',
    vehicleClass: 'LMV (Private Car)'
  }
];

export const IMPORTANT_NOTICES: NoticeItem[] = [
  {
    id: 'not-1',
    type: 'New',
    badgeColor: '#EA580C',
    badgeBg: '#FFEDD5',
    title: 'Aadhaar eKYC is mandatory for all Driving Licence related services.',
    date: '16 May 2024',
    content: 'Citizens are notified that Aadhaar-based OTP authentication is now active for contactless renewal, address update, and duplicate DL issuance without physical RTO visit.'
  },
  {
    id: 'not-2',
    type: 'Update',
    badgeColor: '#0284C7',
    badgeBg: '#E0F2FE',
    title: 'System maintenance on 19 May 2024 (12:00 AM to 04:00 AM).',
    date: '15 May 2024',
    content: 'Scheduled database optimization will take place on 19th May between midnight and 4:00 AM IST. Online slot booking and fee payment gateway will be temporarily paused.'
  },
  {
    id: 'not-3',
    type: 'Info',
    badgeColor: '#9333EA',
    badgeBg: '#F3E8FF',
    title: 'Now get your Driving Licence delivered at your doorstep.',
    date: '10 May 2024',
    content: 'India Post Speed Post tracking is now linked directly with Sarathi portal. Track your physical PVC Smart Card dispatch in real-time with your registered mobile number.'
  }
];

export const NOTICES = IMPORTANT_NOTICES;

export const TRUST_POINTS = [
  { id: 'tp-1', title: 'Secure & Verified', subtitle: 'Aadhaar & DigiLocker e-KYC' },
  { id: 'tp-2', title: 'Fast & Easy', subtitle: 'Paperless online processing' },
  { id: 'tp-3', title: 'Transparent', subtitle: 'Zero hidden fees (CMVR Rule 32)' },
  { id: 'tp-4', title: 'Reliable Services', subtitle: 'Direct integration with MoRTH' },
  { id: 'tp-5', title: 'Anywhere Access', subtitle: 'Accessible 24x7 nationwide' }
];

export const RTO_OFFICES: RtoOffice[] = [
  {
    code: 'JH-01',
    name: 'District Transport Office, Ranchi',
    city: 'Ranchi',
    state: 'Jharkhand',
    address: 'Kanke Road, Near SSP Residence, Ranchi, Jharkhand 834008',
    phone: '0651-2446781',
    email: 'dto-ranchi@jharkhandmail.gov.in',
    workingHours: '10:00 AM - 05:00 PM (Mon-Fri)'
  },
  {
    code: 'JH-05',
    name: 'District Transport Office, Jamshedpur',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    address: 'Sakchi Bus Stand Road, East Singhbhum, Jamshedpur 831001',
    phone: '0657-2231456',
    email: 'dto-jsr@jharkhandmail.gov.in',
    workingHours: '10:00 AM - 05:00 PM (Mon-Fri)'
  },
  {
    code: 'JH-10',
    name: 'District Transport Office, Dhanbad',
    city: 'Dhanbad',
    state: 'Jharkhand',
    address: 'Combined Building Complex, Luby Circular Road, Dhanbad 826001',
    phone: '0326-2312098',
    email: 'dto-dhanbad@jharkhandmail.gov.in',
    workingHours: '10:00 AM - 05:00 PM (Mon-Fri)'
  },
  {
    code: 'DL-01',
    name: 'Regional Transport Office, Mall Road',
    city: 'North Delhi',
    state: 'Delhi',
    address: '5/9 Under Hill Road, Civil Lines, Delhi 110054',
    phone: '011-23951234',
    email: 'rto-north@delhi.gov.in',
    workingHours: '08:30 AM - 04:30 PM (Mon-Sat)'
  },
  {
    code: 'MH-01',
    name: 'Regional Transport Office, Mumbai Central',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Old Bodyguard Lane, Tulsiwadi, Tardeo, Mumbai 400034',
    phone: '022-23532333',
    email: 'rto-mumbai01@mahatranscom.in',
    workingHours: '10:00 AM - 05:30 PM (Mon-Fri)'
  },
  {
    code: 'KA-01',
    name: 'Regional Transport Office, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '3rd Block, BDA Complex, Koramangala, Bengaluru 560034',
    phone: '080-25533525',
    email: 'rto-blr-south@karnataka.gov.in',
    workingHours: '10:00 AM - 05:30 PM (Mon-Sat)'
  },
  {
    code: 'BR-01',
    name: 'District Transport Office, Patna',
    city: 'Patna',
    state: 'Bihar',
    address: 'Gandhi Maidan East, Near Biscomaun Bhawan, Patna 800001',
    phone: '0612-2219485',
    email: 'dto-patna@bihar.gov.in',
    workingHours: '10:00 AM - 05:00 PM (Mon-Fri)'
  }
];

export const SEARCH_SUGGESTIONS = [
  { label: 'Apply for Learner Licence (LL)', category: 'Driving Licence', action: 'service', id: 'll-new' },
  { label: 'Apply for Driving Licence (DL)', category: 'Driving Licence', action: 'service', id: 'dl-new' },
  { label: 'Renew Driving Licence Online', category: 'Renewal', action: 'service', id: 'dl-renew' },
  { label: 'Change Address in DL', category: 'Updates', action: 'service', id: 'dl-update' },
  { label: 'Check Application Status', category: 'Tracking', action: 'status', id: 'status' },
  { label: 'Book RTO Driving Test Appointment', category: 'Appointments', action: 'appointment', id: 'appointment' },
  { label: 'Fee Calculator for DL/RC Services', category: 'Fees', action: 'fee', id: 'fee' },
  { label: 'Find Nearest RTO Office & Codes', category: 'RTO Directory', action: 'rto', id: 'rto' },
  { label: 'International Driving Permit (IDP)', category: 'International', action: 'service', id: 'dl-idp' },
  { label: 'Duplicate Driving Licence (Lost/Damage)', category: 'Duplicate', action: 'service', id: 'dl-replace' },
  { label: 'Add LMV/Heavy Vehicle Category', category: 'Endorsement', action: 'service', id: 'dl-add-class' },
  { label: 'mParivahan Mobile App Download', category: 'Mobile App', action: 'app', id: 'app' }
];
