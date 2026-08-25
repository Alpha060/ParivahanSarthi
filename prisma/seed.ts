import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Parivahan Sarathi database seed...');

  // Clean existing tables
  await prisma.applicationStep.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.application.deleteMany();
  await prisma.grievance.deleteMany();
  await prisma.rtoOffice.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Demo User
  const demoUser = await prisma.user.create({
    data: {
      name: 'Krishna Mahto',
      mobile: '9876543210',
      email: 'krishna.mahto@citizen.in',
      role: 'CITIZEN',
      state: 'Jharkhand'
    }
  });

  // 2. Seed Applications
  // Application 1: In Progress (Step 6 of 9)
  const app1 = await prisma.application.create({
    data: {
      applicationId: 'DL1234567890123',
      userId: demoUser.id,
      type: 'Driving Licence (LMV)',
      subType: 'New Permanent DL',
      vehicleClass: 'LMV (Light Motor Vehicle)',
      applicantName: 'Krishna Mahto',
      mobile: '9876543210',
      state: 'Jharkhand',
      rtoCode: 'JH-01',
      rtoName: 'Ranchi RTO (JH-01)',
      currentStep: 6,
      currentStepName: 'RTO Verification',
      status: 'IN_PROGRESS',
      statusLabel: 'In Progress',
      statusColor: '#137333',
      submittedAt: new Date('2024-05-14T10:15:00Z')
    }
  });

  const stepsApp1 = [
    { stepNumber: 1, stepName: 'Application Submitted Online', isCompleted: true, completedAt: '14 May 2024, 10:15 AM' },
    { stepNumber: 2, stepName: 'e-KYC Verification via UIDAI', isCompleted: true, completedAt: '14 May 2024, 10:18 AM' },
    { stepNumber: 3, stepName: 'Document Upload & Scrutiny', isCompleted: true, completedAt: '14 May 2024, 11:30 AM' },
    { stepNumber: 4, stepName: 'Fee Payment Reconciliation (₹1000)', isCompleted: true, completedAt: '14 May 2024, 11:35 AM' },
    { stepNumber: 5, stepName: 'RTO Slot Booking Confirmed', isCompleted: true, completedAt: '15 May 2024, 09:00 AM' },
    { stepNumber: 6, stepName: 'RTO Verification & Biometric Capture', isCompleted: true, isCurrent: true, completedAt: '16 May 2024, 02:40 PM' },
    { stepNumber: 7, stepName: 'Driving Skill Test Clearance (Form 7B)', isCompleted: false, remarks: 'Scheduled for 20 May 2024' },
    { stepNumber: 8, stepName: 'Smart Card DL Printing & Quality Check', isCompleted: false, remarks: 'Pending test pass' },
    { stepNumber: 9, stepName: 'Speed Post Dispatch to Residential Address', isCompleted: false, remarks: 'Pending card print' }
  ];

  for (const s of stepsApp1) {
    await prisma.applicationStep.create({
      data: {
        applicationId: app1.id,
        ...s
      }
    });
  }

  // Application 2: Approved (Ready for Download)
  const app2 = await prisma.application.create({
    data: {
      applicationId: 'DL9876543210987',
      userId: demoUser.id,
      type: 'Renewal of Driving Licence',
      subType: 'Renewal of Driving Licence',
      vehicleClass: 'MCWG + LMV',
      applicantName: 'Ananya Sharma',
      mobile: '9811223344',
      state: 'Jharkhand',
      rtoCode: 'JH-10',
      rtoName: 'Dhanbad RTO (JH-10)',
      currentStep: 9,
      currentStepName: 'Ready for Download',
      status: 'APPROVED',
      statusLabel: 'Approved',
      statusColor: '#137333',
      submittedAt: new Date('2024-05-02T11:00:00Z'),
      approvedAt: new Date('2024-05-10T14:30:00Z'),
      speedPostNo: 'EP928371928IN'
    }
  });

  // Application 3: Upcoming (Test Appointment)
  const app3 = await prisma.application.create({
    data: {
      applicationId: 'LL4567891234567',
      userId: demoUser.id,
      type: 'Learner Licence (LMV)',
      subType: 'Learner Licence (LMV)',
      vehicleClass: 'LMV (Private Car)',
      applicantName: 'Rohit Verma',
      mobile: '9877665544',
      state: 'Jharkhand',
      rtoCode: 'JH-05',
      rtoName: 'Jamshedpur RTO (JH-05)',
      currentStep: 5,
      currentStepName: 'Test Appointment',
      status: 'UPCOMING',
      statusLabel: 'Upcoming',
      statusColor: '#1A73E8',
      submittedAt: new Date('2024-05-18T09:30:00Z')
    }
  });

  // 3. Seed Appointments
  await prisma.appointment.create({
    data: {
      appointmentId: 'APT-2024-81920',
      applicationId: app3.id,
      applicantName: 'Rohit Verma',
      mobile: '9877665544',
      rtoCode: 'JH-05',
      rtoName: 'Jamshedpur RTO (JH-05)',
      serviceType: 'Learner Licence Online Test',
      appointmentDate: '20 May 2024',
      timeSlot: '10:30 AM',
      tokenNumber: 'TKN-028',
      status: 'CONFIRMED'
    }
  });

  // 4. Seed Payment Transactions (with Instant Reconciliation demo)
  await prisma.paymentTransaction.create({
    data: {
      transactionId: 'TXN-SAR-20240514-991',
      applicationId: app1.id,
      applicantName: 'Krishna Mahto',
      amount: 1000,
      baseFee: 200,
      testFee: 300,
      smartCardFee: 200,
      postalFee: 50,
      paymentMode: 'UPI',
      status: 'SUCCESS',
      bankRefNo: 'SBI-UPI-88492019482',
      reconciledAt: new Date()
    }
  });

  // 5. Seed RTO Offices
  const rtos = [
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

  for (const r of rtos) {
    await prisma.rtoOffice.create({ data: r });
  }

  // 6. Seed Notices
  const notices = [
    {
      noticeId: 'not-1',
      type: 'New',
      badgeColor: '#EA580C',
      badgeBg: '#FFEDD5',
      title: 'Aadhaar eKYC is mandatory for all Driving Licence related services.',
      date: '16 May 2024',
      content: 'Citizens are notified that Aadhaar-based OTP authentication is now active for contactless renewal, address update, and duplicate DL issuance without physical RTO visit.'
    },
    {
      noticeId: 'not-2',
      type: 'Update',
      badgeColor: '#0284C7',
      badgeBg: '#E0F2FE',
      title: 'System maintenance on 19 May 2024 (12:00 AM to 04:00 AM).',
      date: '15 May 2024',
      content: 'Scheduled database optimization will take place on 19th May between midnight and 4:00 AM IST. Online slot booking and fee payment gateway will be temporarily paused.'
    },
    {
      noticeId: 'not-3',
      type: 'Info',
      badgeColor: '#9333EA',
      badgeBg: '#F3E8FF',
      title: 'Now get your Driving Licence delivered at your doorstep.',
      date: '10 May 2024',
      content: 'India Post Speed Post tracking is now linked directly with Sarathi portal. Track your physical PVC Smart Card dispatch in real-time with your registered mobile number.'
    }
  ];

  for (const n of notices) {
    await prisma.notice.create({ data: n });
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
