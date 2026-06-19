export type Role = 'Admin' | 'Director' | 'Finance Officer' | 'Researcher' | 'Guest';
export type StatusBadge = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Paid' | 'Pending' | 'Active' | 'Suspended' | 'Open' | 'Closed' | 'Locked' | 'Revised';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Account_Type;
  status: 'Active' | 'Suspended';
  department: string;
  joined: string;
  avatar: string;
}

export interface GrantCall {
  id: string;
  title: string;
  deadline: string;
  totalBudget: number;
  applications: number;
  status: 'Open' | 'Closed' | 'Draft';
  category: string;
  description: string;
  eligibility: string;
}

export interface Proposal {
  id: string;
  title: string;
  researcher: string;
  researcherId: number;
  grantCallId: string;
  grantCallTitle: string;
  submitted: string;
  status: StatusBadge;
  requestedAmount: number;
  department: string;
  abstract: string;
}

export interface Award {
  id: string;
  proposalId: string;
  title: string;
  researcher: string;
  awardedAmount: number;
  awardDate: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Suspended';
  disbursed: number;
  remaining: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  dueDate: string;
  submittedDate?: string;
  status: StatusBadge;
  researcher: string;
  description: string;
}

export interface Transaction {
  id: string;
  projectId: string;
  projectTitle: string;
  type: 'Disbursement' | 'Expense' | 'Refund';
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Rejected';
  description: string;
  requestedBy: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'deadline' | 'approval' | 'payment' | 'system' | 'rejection';
}

export interface AuditLog {
  id: number;
  action: string;
  user: string;
  role: Role;
  module: string;
  timestamp: string;
  ip: string;
  details: string;
}

export const currentUsers: Record<Role, User> = {
  Admin: {
    id: 1,
    name: 'Dr. Sarah Ahmad',
    email: 'sarah.ahmad@iser.edu',
    role: 'admin',
    status: 'Active',
    department: 'Administration',
    joined: '2023-01-15',
    avatar: 'SA',
  },
  'Director': {
    id: 3, name: 'Prof. Kwame Mensah', email: 'kwame.mensah@iser.edu', role: 'director',
    status: 'Active', department: 'Administration', joined: '2022-06-01',
    avatar: 'KM'
  },
  'Researcher': {
    id: 2, name: 'Prof. James Okonkwo', email: 'james.okonkwo@iser.edu', role: 'researcher',
    status: 'Active', department: 'Biomedical Engineering', joined: '2023-03-20',
    avatar: 'JO'
  },
  'Finance Officer': {
    id: 5,
    name: 'Ms. Fatima Al-Rashid',
    email: 'fatima.rashid@iser.edu',
    role: 'finance_officer',
    status: 'Active',
    department: 'Finance & Accounts',
    joined: '2023-01-08',
    avatar: 'FA',
  },
  'Guest': {
    id: 7, name: 'Guest User', email: 'guest@iser.edu', role: 'guest',
    status: 'Active', department: '', joined: '2025-01-01',
    avatar: 'GU'
  },
};

export const users: User[] = [
  { id: 1, name: 'Dr. Sarah Ahmad', email: 'sarah.ahmad@iser.edu', role: 'admin', status: 'Active', department: 'Administration', joined: '2023-01-15', avatar: 'SA' },
  { id: 2, name: 'Prof. James Okonkwo', email: 'james.okonkwo@iser.edu', role: 'researcher', status: 'Active', department: 'Biomedical Engineering', joined: '2023-03-20', avatar: 'JO' },
  { id: 3, name: 'Dr. Layla Hassan', email: 'layla.hassan@iser.edu', role: 'researcher', status: 'Active', department: 'Environmental Science', joined: '2023-06-10', avatar: 'LH' },
  { id: 4, name: 'Chen Wei', email: 'chen.wei@iser.edu', role: 'researcher', status: 'Active', department: 'Biomedical Engineering', joined: '2024-04-05', avatar: 'CW' },
  { id: 5, name: 'Ms. Fatima Al-Rashid', email: 'fatima.rashid@iser.edu', role: 'finance_officer', status: 'Active', department: 'Finance & Accounts', joined: '2023-01-08', avatar: 'FA' },
  { id: 6, name: 'Dr. Marcus Rivera', email: 'marcus.rivera@iser.edu', role: 'researcher', status: 'Suspended', department: 'Physics', joined: '2022-11-12', avatar: 'MR' },
  { id: 7, name: 'Amira Nour', email: 'amira.nour@iser.edu', role: 'researcher', status: 'Active', department: 'Environmental Science', joined: '2024-02-18', avatar: 'AN' },
  { id: 8, name: 'Dr. Raj Patel', email: 'raj.patel@iser.edu', role: 'researcher', status: 'Active', department: 'Computer Science', joined: '2023-09-01', avatar: 'RP' },
];

export const grantCalls: GrantCall[] = [
  {
    id: 'GC-2025-001',
    title: 'Sustainable Energy Innovation Grant',
    deadline: '2025-07-30',
    totalBudget: 500000,
    applications: 12,
    status: 'Open',
    category: 'Energy & Environment',
    description:
      'Funding for innovative research in renewable energy, grid optimization, and sustainable technologies.',
    eligibility:
      'Faculty and senior researchers with PhD. Min 3 years research experience.',
  },
  {
    id: 'GC-2025-002',
    title: 'AI in Healthcare Research Fund',
    deadline: '2025-08-15',
    totalBudget: 300000,
    applications: 8,
    status: 'Open',
    category: 'Health & Technology',
    description:
      'Supporting research that leverages artificial intelligence to improve healthcare diagnostics and outcomes.',
    eligibility:
      'Researchers in biomedical, computer science, or clinical fields.',
  },
  {
    id: 'GC-2025-003',
    title: 'Biomedical Innovation Program',
    deadline: '2025-06-01',
    totalBudget: 750000,
    applications: 15,
    status: 'Closed',
    category: 'Biomedical',
    description:
      'Closed call for proposals in biomedical device innovation, drug delivery, and therapeutic research.',
    eligibility: 'Biomedical and pharmaceutical researchers.',
  },
  {
    id: 'GC-2025-004',
    title: 'Digital Transformation in Education',
    deadline: '2025-09-30',
    totalBudget: 200000,
    applications: 3,
    status: 'Draft',
    category: 'Education Technology',
    description:
      'Research grant focused on digital tools, adaptive learning platforms, and educational technology.',
    eligibility:
      'Open to all faculty in education, computer science, and cognitive science.',
  },
  {
    id: 'GC-2025-005',
    title: 'Climate Resilience Research Initiative',
    deadline: '2025-10-15',
    totalBudget: 1200000,
    applications: 0,
    status: 'Open',
    category: 'Climate Science',
    description:
      'Large-scale interdisciplinary research program addressing climate change adaptation and resilience.',
    eligibility:
      'Interdisciplinary teams with at least two departments represented.',
  },
  {
    id: 'GC-2025-006',
    title: 'Advanced Materials & Nanotechnology Fund',
    deadline: '2025-08-01',
    totalBudget: 420000,
    applications: 6,
    status: 'Open',
    category: 'Materials Science',
    description:
      'Research in advanced materials, nanomaterials, and novel fabrication techniques.',
    eligibility: 'Materials science and chemistry researchers.',
  },
];

export const proposals: Proposal[] = [
  {
    id: 'PR-2025-001',
    title: 'Smart Grid Optimization Using Machine Learning',
    researcher: 'Prof. James Okonkwo',
    researcherId: 2,
    grantCallId: 'GC-2025-001',
    grantCallTitle: 'Sustainable Energy Innovation Grant',
    submitted: '2025-05-10',
    status: 'Under Review',
    requestedAmount: 120000,
    department: 'Biomedical Engineering',
    abstract:
      'This research proposes a machine learning framework to optimize smart grid energy distribution, reducing waste by an estimated 23% and improving grid reliability through predictive load balancing.',
  },
  {
    id: 'PR-2025-002',
    title: 'Predictive Diagnostics for Rare Autoimmune Diseases',
    researcher: 'Dr. Layla Hassan',
    researcherId: 3,
    grantCallId: 'GC-2025-002',
    grantCallTitle: 'AI in Healthcare Research Fund',
    submitted: '2025-05-18',
    status: 'Approved',
    requestedAmount: 85000,
    department: 'Environmental Science',
    abstract:
      'Applying deep learning to multi-omic patient data to enable early detection of rare autoimmune conditions, targeting a 40% improvement in diagnostic accuracy.',
  },
  {
    id: 'PR-2025-003',
    title: 'Targeted Nanoparticle Drug Delivery for Oncology',
    researcher: 'Prof. James Okonkwo',
    researcherId: 2,
    grantCallId: 'GC-2025-003',
    grantCallTitle: 'Biomedical Innovation Program',
    submitted: '2025-04-20',
    status: 'Approved',
    requestedAmount: 200000,
    department: 'Biomedical Engineering',
    abstract:
      'Engineering lipid nanoparticles for targeted chemotherapy delivery to tumor sites, minimizing systemic toxicity and improving treatment efficacy in solid tumors.',
  },
  {
    id: 'PR-2025-004',
    title: 'Carbon Capture from Industrial Emissions Using MOFs',
    researcher: 'Dr. Marcus Rivera',
    researcherId: 6,
    grantCallId: 'GC-2025-001',
    grantCallTitle: 'Sustainable Energy Innovation Grant',
    submitted: '2025-05-22',
    status: 'Rejected',
    requestedAmount: 95000,
    department: 'Physics',
    abstract:
      'Metal-organic framework-based membranes for post-combustion carbon capture at industrial facilities, targeting 90% CO2 capture efficiency.',
  },
  {
    id: 'PR-2025-005',
    title: 'Adaptive Learning Platform for STEM Education',
    researcher: 'Dr. Layla Hassan',
    researcherId: 3,
    grantCallId: 'GC-2025-004',
    grantCallTitle: 'Digital Transformation in Education',
    submitted: '2025-05-28',
    status: 'Draft',
    requestedAmount: 65000,
    department: 'Environmental Science',
    abstract:
      'AI-driven adaptive curriculum platform that personalizes STEM learning pathways based on student performance data and learning style analysis.',
  },
  {
    id: 'PR-2025-006',
    title: 'Quantum Key Distribution for Secure Financial Networks',
    researcher: 'Dr. Raj Patel',
    researcherId: 8,
    grantCallId: 'GC-2025-002',
    grantCallTitle: 'AI in Healthcare Research Fund',
    submitted: '2025-05-25',
    status: 'Submitted',
    requestedAmount: 180000,
    department: 'Computer Science',
    abstract:
      'Implementation of quantum key distribution protocols over existing fiber infrastructure to achieve provably secure financial data transmission.',
  },
  {
    id: 'PR-2025-007',
    title: 'Graphene-Enhanced Composite Materials for Aerospace',
    researcher: 'Dr. Raj Patel',
    researcherId: 8,
    grantCallId: 'GC-2025-006',
    grantCallTitle: 'Advanced Materials & Nanotechnology Fund',
    submitted: '2025-05-20',
    status: 'Under Review',
    requestedAmount: 140000,
    department: 'Computer Science',
    abstract:
      'Development of graphene-reinforced polymer composites with superior strength-to-weight ratios for aerospace structural applications.',
  },
];

export const awards: Award[] = [
  {
    id: 'AW-2025-001',
    proposalId: 'PR-2025-002',
    title: 'Predictive Diagnostics for Rare Autoimmune Diseases',
    researcher: 'Dr. Layla Hassan',
    awardedAmount: 85000,
    awardDate: '2025-05-25',
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    status: 'Active',
    disbursed: 28500,
    remaining: 56500,
  },
  {
    id: 'AW-2025-002',
    proposalId: 'PR-2025-003',
    title: 'Targeted Nanoparticle Drug Delivery for Oncology',
    researcher: 'Prof. James Okonkwo',
    awardedAmount: 200000,
    awardDate: '2025-04-28',
    startDate: '2025-05-15',
    endDate: '2027-05-14',
    status: 'Active',
    disbursed: 62000,
    remaining: 138000,
  },
  {
    id: 'AW-2024-005',
    proposalId: 'PR-2024-011',
    title: 'Coastal Erosion Monitoring System',
    researcher: 'Dr. Layla Hassan',
    awardedAmount: 110000,
    awardDate: '2024-07-10',
    startDate: '2024-08-01',
    endDate: '2025-07-31',
    status: 'Active',
    disbursed: 88000,
    remaining: 22000,
  },
  {
    id: 'AW-2024-003',
    proposalId: 'PR-2024-008',
    title: 'Bioreactor Optimization for Fermentation',
    researcher: 'Prof. James Okonkwo',
    awardedAmount: 75000,
    awardDate: '2024-05-18',
    startDate: '2024-06-01',
    endDate: '2025-03-31',
    status: 'Completed',
    disbursed: 75000,
    remaining: 0,
  },
];

export const milestones: Milestone[] = [
  {
    id: 'MS-001',
    projectId: 'AW-2025-002',
    projectTitle: 'Nanoparticle Drug Delivery',
    title: 'Literature Review & Protocol Finalization',
    dueDate: '2025-06-30',
    submittedDate: '2025-06-28',
    status: 'Approved',
    researcher: 'Prof. James Okonkwo',
    description:
      'Complete systematic review of existing nanoparticle delivery systems and finalize experimental protocols.',
  },
  {
    id: 'MS-002',
    projectId: 'AW-2025-002',
    projectTitle: 'Nanoparticle Drug Delivery',
    title: 'Nanoparticle Synthesis & Characterization',
    dueDate: '2025-08-31',
    status: 'Under Review',
    researcher: 'Prof. James Okonkwo',
    description:
      'Synthesize lipid nanoparticle formulations and characterize size, zeta potential, and encapsulation efficiency.',
  },
  {
    id: 'MS-003',
    projectId: 'AW-2025-001',
    projectTitle: 'Predictive Diagnostics',
    title: 'Dataset Collection & Preprocessing',
    dueDate: '2025-07-15',
    status: 'Submitted',
    researcher: 'Dr. Layla Hassan',
    description:
      'Collect anonymized patient datasets from three partner hospitals and preprocess for model training.',
  },
  {
    id: 'MS-004',
    projectId: 'AW-2024-005',
    projectTitle: 'Coastal Erosion Monitoring',
    title: 'Sensor Network Deployment',
    dueDate: '2025-06-10',
    submittedDate: '2025-06-08',
    status: 'Approved',
    researcher: 'Dr. Layla Hassan',
    description: 'Deploy IoT sensor array across 5 coastal monitoring sites.',
  },
  {
    id: 'MS-005',
    projectId: 'AW-2025-001',
    projectTitle: 'Predictive Diagnostics',
    title: 'Baseline ML Model Development',
    dueDate: '2025-09-30',
    status: 'Draft',
    researcher: 'Dr. Layla Hassan',
    description:
      'Develop and validate baseline classification models using collected patient data.',
  },
  {
    id: 'MS-006',
    projectId: 'AW-2025-002',
    projectTitle: 'Nanoparticle Drug Delivery',
    title: 'In Vitro Cell Culture Studies',
    dueDate: '2025-10-31',
    status: 'Draft',
    researcher: 'Prof. James Okonkwo',
    description:
      'Conduct cell viability, uptake, and cytotoxicity assays on cancer cell lines.',
  },
];

export const transactions: Transaction[] = [
  {
    id: 'TXN-2025-001',
    projectId: 'AW-2025-002',
    projectTitle: 'Nanoparticle Drug Delivery',
    type: 'Disbursement',
    amount: 40000,
    date: '2025-05-20',
    status: 'Paid',
    description: 'First tranche disbursement — equipment and materials',
    requestedBy: 'Prof. James Okonkwo',
  },
  {
    id: 'TXN-2025-002',
    projectId: 'AW-2025-002',
    projectTitle: 'Nanoparticle Drug Delivery',
    type: 'Disbursement',
    amount: 22000,
    date: '2025-05-28',
    status: 'Paid',
    description: 'Personnel costs — research assistant salary Q2',
    requestedBy: 'Prof. James Okonkwo',
  },
  {
    id: 'TXN-2025-003',
    projectId: 'AW-2025-001',
    projectTitle: 'Predictive Diagnostics',
    type: 'Disbursement',
    amount: 28500,
    date: '2025-06-01',
    status: 'Paid',
    description:
      'Initial disbursement — computing resources and data licensing',
    requestedBy: 'Dr. Layla Hassan',
  },
  {
    id: 'TXN-2025-004',
    projectId: 'AW-2024-005',
    projectTitle: 'Coastal Erosion Monitoring',
    type: 'Disbursement',
    amount: 15000,
    date: '2025-05-15',
    status: 'Pending',
    description: 'Final milestone disbursement — project closure funds',
    requestedBy: 'Dr. Layla Hassan',
  },
  {
    id: 'TXN-2025-005',
    projectId: 'AW-2025-002',
    projectTitle: 'Nanoparticle Drug Delivery',
    type: 'Expense',
    amount: 8400,
    date: '2025-06-05',
    status: 'Pending',
    description: 'Lab consumables and reagents — June 2025',
    requestedBy: 'Chen Wei',
  },
  {
    id: 'TXN-2025-006',
    projectId: 'AW-2024-003',
    projectTitle: 'Bioreactor Optimization',
    type: 'Disbursement',
    amount: 25000,
    date: '2025-04-10',
    status: 'Paid',
    description: 'Final project disbursement — project complete',
    requestedBy: 'Prof. James Okonkwo',
  },
];

export const notifications: Notification[] = [
  {
    id: 1,
    title: 'Proposal Approved',
    message:
      'Your proposal "Predictive Diagnostics for Rare Autoimmune Diseases" has been approved.',
    time: '2 hours ago',
    read: false,
    type: 'approval',
  },
  {
    id: 2,
    title: 'Deadline Approaching',
    message:
      'Milestone "Nanoparticle Synthesis & Characterization" is due in 5 days (Aug 31, 2025).',
    time: '5 hours ago',
    read: false,
    type: 'deadline',
  },
  {
    id: 3,
    title: 'Payment Processed',
    message:
      'Disbursement of RM 28,500 for Predictive Diagnostics project has been processed.',
    time: '1 day ago',
    read: false,
    type: 'payment',
  },
  {
    id: 4,
    title: 'New Grant Call Published',
    message:
      'Climate Resilience Research Initiative (GC-2025-005) is now open for applications.',
    time: '2 days ago',
    read: true,
    type: 'system',
  },
  {
    id: 5,
    title: 'Milestone Report Under Review',
    message:
      'Your milestone report "Dataset Collection & Preprocessing" is being reviewed.',
    time: '3 days ago',
    read: true,
    type: 'system',
  },
  {
    id: 6,
    title: 'Proposal Rejected',
    message:
      'Proposal PR-2025-004 "Carbon Capture from Industrial Emissions" was not approved.',
    time: '4 days ago',
    read: true,
    type: 'rejection',
  },
  {
    id: 7,
    title: 'System Maintenance',
    message:
      'Scheduled maintenance on June 15, 2025 from 02:00–04:00 AM MYT. System may be unavailable.',
    time: '5 days ago',
    read: true,
    type: 'system',
  },
];

export const auditLogs: AuditLog[] = [
  {
    id: 1,
    action: 'Proposal Approved',
    user: 'Dr. Sarah Ahmad',
    role: 'Admin',
    module: 'Proposals',
    timestamp: '2025-05-29 09:14:32',
    ip: '172.16.0.12',
    details: 'Approved PR-2025-002 — Predictive Diagnostics',
  },
  {
    id: 2,
    action: 'User Created',
    user: 'Dr. Sarah Ahmad',
    role: 'Admin',
    module: 'User Management',
    timestamp: '2025-05-28 14:22:10',
    ip: '172.16.0.12',
    details: 'Created account for Amira Nour (Assistant Researcher)',
  },
  {
    id: 3,
    action: 'Disbursement Approved',
    user: 'Ms. Fatima Al-Rashid',
    role: 'Finance Officer',
    module: 'Financial',
    timestamp: '2025-05-28 11:05:48',
    ip: '172.16.0.25',
    details: 'Approved TXN-2025-003 — RM 28,500',
  },
  {
    id: 4,
    action: 'Milestone Submitted',
    user: 'Dr. Layla Hassan',
    role: 'Researcher (Co-PI)',
    module: 'Milestones',
    timestamp: '2025-05-27 16:45:00',
    ip: '172.16.0.33',
    details: 'Submitted MS-003 — Dataset Collection',
  },
  {
    id: 5,
    action: 'Grant Call Published',
    user: 'Dr. Sarah Ahmad',
    role: 'Admin',
    module: 'Grant Calls',
    timestamp: '2025-05-27 09:30:15',
    ip: '172.16.0.12',
    details: 'Published GC-2025-005 — Climate Resilience',
  },
  {
    id: 6,
    action: 'Proposal Submitted',
    user: 'Dr. Raj Patel',
    role: 'Researcher (PI)',
    module: 'Proposals',
    timestamp: '2025-05-25 13:20:44',
    ip: '172.16.0.41',
    details: 'Submitted PR-2025-006 — Quantum Key Distribution',
  },
  {
    id: 7,
    action: 'Account Suspended',
    user: 'Dr. Sarah Ahmad',
    role: 'Admin',
    module: 'User Management',
    timestamp: '2025-05-24 10:15:22',
    ip: '172.16.0.12',
    details: 'Suspended account for Dr. Marcus Rivera',
  },
  {
    id: 8,
    action: 'Report Exported',
    user: 'Ms. Fatima Al-Rashid',
    role: 'Finance Officer',
    module: 'Reports',
    timestamp: '2025-05-23 15:00:11',
    ip: '172.16.0.25',
    details: 'Exported financial report for AW-2025-002',
  },
  {
    id: 10,
    action: 'Settings Updated',
    user: 'Dr. Sarah Ahmad',
    role: 'Admin',
    module: 'Settings',
    timestamp: '2025-05-22 11:45:30',
    ip: '172.16.0.12',
    details: 'Updated email notification preferences',
  },
];

export const analyticsData = {
  monthlyApplications: [
    { month: 'Jan', applications: 4, approved: 2, rejected: 1 },
    { month: 'Feb', applications: 7, approved: 3, rejected: 2 },
    { month: 'Mar', applications: 5, approved: 4, rejected: 0 },
    { month: 'Apr', applications: 9, approved: 5, rejected: 2 },
    { month: 'May', applications: 12, approved: 6, rejected: 3 },
    { month: 'Jun', applications: 8, approved: 4, rejected: 1 },
  ],
  fundingByCategory: [
    { name: 'Biomedical', value: 285000, color: '#2F4A75' },
    { name: 'Environment', value: 110000, color: '#B79A64' },
    { name: 'Health Tech', value: 85000, color: '#4A7FA5' },
    { name: 'Materials', value: 75000, color: '#403C3A' },
    { name: 'Education', value: 65000, color: '#7A9CC0' },
  ],
  monthlyDisbursements: [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 72000 },
    { month: 'Mar', amount: 38000 },
    { month: 'Apr', amount: 95000 },
    { month: 'May', amount: 115500 },
    { month: 'Jun', amount: 28500 },
  ],
};
