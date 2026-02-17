export const mockUsers = [
  {
    id: 1,
    name: 'System Admin',
    email: 'admin@system.com',
    password: 'admin123',
    role: 'systemadmin',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 3,
    name: 'Jane Smith',
    email: 'callcenter@company.com',
    password: 'call123',
    role: 'callcenter',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

export const mockFeedback = [
  {
    id: 1,
    customerName: 'Alice Johnson',
    customerEmail: 'alice@email.com',
    customerPhone: '+1 234-567-8901',
    rating: 5,
    category: 'Product Support',
    message: 'Excellent service! The representative was very helpful.',
    status: 'resolved',
    date: '2026-02-15T10:30:00',
    agent: 'Jane Smith',
    resolution: 'Issue resolved within 10 minutes',
    satisfaction: 5
  },
  {
    id: 2,
    customerName: 'Bob Williams',
    customerEmail: 'bob@email.com',
    customerPhone: '+1 234-567-8902',
    rating: 4,
    category: 'Technical Issue',
    message: 'Good support but waiting time was a bit long.',
    status: 'in-progress',
    date: '2026-02-16T14:15:00',
    agent: 'Jane Smith',
    resolution: 'Escalated to technical team',
    satisfaction: 4
  },
  {
    id: 3,
    customerName: 'Carol Martinez',
    customerEmail: 'carol@email.com',
    customerPhone: '+1 234-567-8903',
    rating: 3,
    category: 'Billing Inquiry',
    message: 'Need clarification on recent charges.',
    status: 'pending',
    date: '2026-02-17T09:00:00',
    agent: 'Unassigned',
    resolution: 'Awaiting billing team response',
    satisfaction: null
  }
];

export const mockDailyReports = [
  {
    date: '2026-02-15',
    totalCalls: 45,
    resolved: 38,
    pending: 5,
    inProgress: 2,
    averageRating: 4.5,
    satisfactionRate: 92,
    topCategories: [
      { name: 'Technical Support', count: 20 },
      { name: 'Billing', count: 15 },
      { name: 'General Inquiry', count: 10 }
    ]
  },
  {
    date: '2026-02-16',
    totalCalls: 52,
    resolved: 42,
    pending: 7,
    inProgress: 3,
    averageRating: 4.3,
    satisfactionRate: 88,
    topCategories: [
      { name: 'Technical Support', count: 25 },
      { name: 'Billing', count: 18 },
      { name: 'General Inquiry', count: 9 }
    ]
  }
];

export const mockWeeklyReports = [
  {
    week: 'Week 7, 2026',
    startDate: '2026-02-10',
    endDate: '2026-02-16',
    totalCalls: 320,
    resolved: 280,
    averageRating: 4.4,
    satisfactionRate: 90,
    trend: '+5%'
  },
  {
    week: 'Week 6, 2026',
    startDate: '2026-02-03',
    endDate: '2026-02-09',
    totalCalls: 305,
    resolved: 265,
    averageRating: 4.3,
    satisfactionRate: 88,
    trend: '+2%'
  }
];

export const mockMonthlyReports = [
  {
    month: 'February 2026',
    totalCalls: 1250,
    resolved: 1100,
    averageRating: 4.4,
    satisfactionRate: 89,
    trend: '+8%',
    topPerformers: ['Jane Smith', 'John Doe']
  },
  {
    month: 'January 2026',
    totalCalls: 1150,
    resolved: 1000,
    averageRating: 4.2,
    satisfactionRate: 85,
    trend: '+3%',
    topPerformers: ['Jane Smith']
  }
];

export const mockYearlyReports = [
  {
    year: '2026',
    totalCalls: 12500,
    resolved: 11200,
    averageRating: 4.3,
    satisfactionRate: 87,
    growth: '+12%',
    quarterlyBreakdown: [
      { quarter: 'Q1', calls: 3100, rating: 4.2 },
      { quarter: 'Q2', calls: 3200, rating: 4.3 },
      { quarter: 'Q3', calls: 3150, rating: 4.4 },
      { quarter: 'Q4', calls: 3050, rating: 4.3 }
    ]
  }
];