import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import CallCenterSidebar from './CallCenterSidebar';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import React Icons
import { 
  FiBarChart2, 
  FiCalendar, 
  FiTrendingUp, 
  FiTrendingDown,
  FiCheckCircle,
  FiClock,
  FiStar,
  FiDownload,
  FiRefreshCw,
  FiSun,
  FiMoon,
  FiBell,
  FiMenu,
  FiX,
  FiFilter,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiPieChart,
  FiUsers,
  FiAward,
  FiMail,
  FiPhone,
  FiUser,
  FiAlertCircle,
  FiPrinter,
  FiShare2,
  FiPlus,
  FiMinus,
  FiSearch,
  FiFolder,
  FiGrid,
  FiList,
  FiLayout,
  FiActivity
} from 'react-icons/fi';

const MyReports = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - Enhanced with more details
  const dailyReports = [
    { 
      id: 1,
      date: '2026-02-23',
      day: 'Monday',
      totalCalls: 28,
      resolved: 22,
      pending: 4,
      escalated: 2,
      averageRating: 4.8,
      satisfactionRate: 96,
      averageTime: '4.2 min',
      categories: [
        { name: 'Technical Support', count: 12, percentage: 43 },
        { name: 'Billing Inquiry', count: 8, percentage: 29 },
        { name: 'General Inquiry', count: 5, percentage: 18 },
        { name: 'Complaint', count: 3, percentage: 10 }
      ],
      calls: [
        { id: 1, time: '09:15', caller: 'Abebe Kebede', category: 'Technical', duration: '5:23', status: 'Resolved', rating: 5, agent: 'Sarah T.' },
        { id: 2, time: '09:45', caller: 'Sara Hailu', category: 'Billing', duration: '3:45', status: 'Pending', rating: 4, agent: 'John D.' },
        { id: 3, time: '10:30', caller: 'John Smith', category: 'General', duration: '4:12', status: 'Resolved', rating: 5, agent: 'Mike R.' },
        { id: 4, time: '11:15', caller: 'Meron Alemu', category: 'Technical', duration: '6:30', status: 'Resolved', rating: 5, agent: 'Sarah T.' },
        { id: 5, time: '13:20', caller: 'Tekle Berhan', category: 'Complaint', duration: '8:15', status: 'Escalated', rating: 3, agent: 'John D.' },
        { id: 6, time: '14:45', caller: 'Helen W.', category: 'Billing', duration: '4:50', status: 'Resolved', rating: 4, agent: 'Mike R.' },
        { id: 7, time: '15:30', caller: 'Dawit G.', category: 'Technical', duration: '7:10', status: 'Pending', rating: 4, agent: 'Sarah T.' },
        { id: 8, time: '16:15', caller: 'Azeb M.', category: 'General', duration: '3:30', status: 'Resolved', rating: 5, agent: 'John D.' }
      ],
      agentPerformance: [
        { name: 'Sarah T.', calls: 12, avgRating: 4.9, resolved: 11 },
        { name: 'John D.', calls: 8, avgRating: 4.7, resolved: 7 },
        { name: 'Mike R.', calls: 8, avgRating: 4.8, resolved: 8 }
      ],
      peakHours: [
        { hour: '09:00 - 10:00', calls: 5 },
        { hour: '10:00 - 11:00', calls: 7 },
        { hour: '11:00 - 12:00', calls: 4 },
        { hour: '14:00 - 15:00', calls: 6 },
        { hour: '15:00 - 16:00', calls: 4 }
      ]
    },
    { 
      id: 2,
      date: '2026-02-22',
      day: 'Sunday',
      totalCalls: 22,
      resolved: 18,
      pending: 3,
      escalated: 1,
      averageRating: 4.7,
      satisfactionRate: 94,
      averageTime: '4.8 min',
      categories: [
        { name: 'Technical Support', count: 9, percentage: 41 },
        { name: 'Billing Inquiry', count: 7, percentage: 32 },
        { name: 'General Inquiry', count: 4, percentage: 18 },
        { name: 'Complaint', count: 2, percentage: 9 }
      ],
      calls: [
        { id: 1, time: '10:20', caller: 'Michael B.', category: 'Technical', duration: '5:45', status: 'Resolved', rating: 5, agent: 'Sarah T.' },
        { id: 2, time: '11:05', caller: 'Hana T.', category: 'Billing', duration: '4:20', status: 'Resolved', rating: 5, agent: 'John D.' },
        { id: 3, time: '12:30', caller: 'Peter J.', category: 'General', duration: '3:15', status: 'Resolved', rating: 4, agent: 'Mike R.' },
        { id: 4, time: '14:15', caller: 'Selam W.', category: 'Technical', duration: '7:30', status: 'Pending', rating: 4, agent: 'Sarah T.' },
        { id: 5, time: '15:40', caller: 'Yonas K.', category: 'Complaint', duration: '9:20', status: 'Resolved', rating: 4, agent: 'John D.' }
      ],
      agentPerformance: [
        { name: 'Sarah T.', calls: 10, avgRating: 4.8, resolved: 9 },
        { name: 'John D.', calls: 7, avgRating: 4.7, resolved: 6 },
        { name: 'Mike R.', calls: 5, avgRating: 4.9, resolved: 5 }
      ],
      peakHours: [
        { hour: '10:00 - 11:00', calls: 4 },
        { hour: '11:00 - 12:00', calls: 5 },
        { hour: '14:00 - 15:00', calls: 6 },
        { hour: '15:00 - 16:00', calls: 3 }
      ]
    },
    { 
      id: 3,
      date: '2026-02-21',
      day: 'Saturday',
      totalCalls: 18,
      resolved: 15,
      pending: 2,
      escalated: 1,
      averageRating: 4.9,
      satisfactionRate: 98,
      averageTime: '4.0 min',
      categories: [
        { name: 'Technical Support', count: 8, percentage: 44 },
        { name: 'Billing Inquiry', count: 5, percentage: 28 },
        { name: 'General Inquiry', count: 3, percentage: 17 },
        { name: 'Complaint', count: 2, percentage: 11 }
      ],
      calls: [
        { id: 1, time: '09:30', caller: 'Daniel M.', category: 'Technical', duration: '4:30', status: 'Resolved', rating: 5, agent: 'Mike R.' },
        { id: 2, time: '10:45', caller: 'Ruth A.', category: 'Billing', duration: '3:45', status: 'Resolved', rating: 5, agent: 'Sarah T.' },
        { id: 3, time: '11:20', caller: 'Gemechu T.', category: 'General', duration: '4:15', status: 'Resolved', rating: 5, agent: 'John D.' },
        { id: 4, time: '13:15', caller: 'Tigist H.', category: 'Technical', duration: '5:20', status: 'Pending', rating: 4, agent: 'Mike R.' }
      ],
      agentPerformance: [
        { name: 'Sarah T.', calls: 6, avgRating: 5.0, resolved: 6 },
        { name: 'John D.', calls: 5, avgRating: 4.8, resolved: 5 },
        { name: 'Mike R.', calls: 7, avgRating: 4.9, resolved: 6 }
      ],
      peakHours: [
        { hour: '09:00 - 10:00', calls: 4 },
        { hour: '10:00 - 11:00', calls: 5 },
        { hour: '11:00 - 12:00', calls: 3 },
        { hour: '13:00 - 14:00', calls: 4 }
      ]
    }
  ];

  const weeklyReports = [
    { 
      id: 1,
      week: 'Week 8, 2026',
      startDate: '2026-02-17',
      endDate: '2026-02-23',
      totalCalls: 165,
      resolved: 142,
      pending: 18,
      escalated: 5,
      averageRating: 4.7,
      satisfactionRate: 94,
      trend: '+5%',
      bestDay: 'Monday',
      worstDay: 'Saturday',
      dailyBreakdown: [
        { day: 'Monday', calls: 28, rating: 4.8 },
        { day: 'Tuesday', calls: 26, rating: 4.7 },
        { day: 'Wednesday', calls: 25, rating: 4.8 },
        { day: 'Thursday', calls: 24, rating: 4.7 },
        { day: 'Friday', calls: 22, rating: 4.6 },
        { day: 'Saturday', calls: 18, rating: 4.9 },
        { day: 'Sunday', calls: 22, rating: 4.7 }
      ],
      categoryTotals: [
        { name: 'Technical Support', count: 72, percentage: 44 },
        { name: 'Billing Inquiry', count: 48, percentage: 29 },
        { name: 'General Inquiry', count: 30, percentage: 18 },
        { name: 'Complaint', count: 15, percentage: 9 }
      ],
      topAgents: [
        { name: 'Sarah T.', calls: 52, rating: 4.9 },
        { name: 'John D.', calls: 48, rating: 4.8 },
        { name: 'Mike R.', calls: 45, rating: 4.9 }
      ]
    },
    { 
      id: 2,
      week: 'Week 7, 2026',
      startDate: '2026-02-10',
      endDate: '2026-02-16',
      totalCalls: 158,
      resolved: 135,
      pending: 16,
      escalated: 7,
      averageRating: 4.6,
      satisfactionRate: 92,
      trend: '+3%',
      bestDay: 'Wednesday',
      worstDay: 'Sunday',
      dailyBreakdown: [
        { day: 'Monday', calls: 24, rating: 4.6 },
        { day: 'Tuesday', calls: 23, rating: 4.5 },
        { day: 'Wednesday', calls: 27, rating: 4.8 },
        { day: 'Thursday', calls: 22, rating: 4.6 },
        { day: 'Friday', calls: 21, rating: 4.7 },
        { day: 'Saturday', calls: 20, rating: 4.8 },
        { day: 'Sunday', calls: 21, rating: 4.5 }
      ],
      categoryTotals: [
        { name: 'Technical Support', count: 68, percentage: 43 },
        { name: 'Billing Inquiry', count: 45, percentage: 28 },
        { name: 'General Inquiry', count: 28, percentage: 18 },
        { name: 'Complaint', count: 17, percentage: 11 }
      ],
      topAgents: [
        { name: 'Sarah T.', calls: 48, rating: 4.8 },
        { name: 'John D.', calls: 45, rating: 4.7 },
        { name: 'Mike R.', calls: 42, rating: 4.8 }
      ]
    }
  ];

  const monthlyReports = [
    { 
      id: 1,
      month: 'February 2026',
      totalCalls: 645,
      resolved: 570,
      pending: 52,
      escalated: 23,
      averageRating: 4.7,
      satisfactionRate: 94,
      trend: '+8%',
      topCategories: ['Technical Support', 'Billing Inquiry'],
      bestAgent: 'Sarah T.',
      weeklyBreakdown: [
        { week: 'Week 8', calls: 165, rating: 4.7 },
        { week: 'Week 7', calls: 158, rating: 4.6 },
        { week: 'Week 6', calls: 162, rating: 4.8 },
        { week: 'Week 5', calls: 160, rating: 4.7 }
      ],
      agentRankings: [
        { name: 'Sarah T.', calls: 185, rating: 4.9, resolved: 175 },
        { name: 'John D.', calls: 172, rating: 4.8, resolved: 160 },
        { name: 'Mike R.', calls: 168, rating: 4.9, resolved: 162 },
        { name: 'Helen W.', calls: 120, rating: 4.7, resolved: 110 }
      ]
    },
    { 
      id: 2,
      month: 'January 2026',
      totalCalls: 620,
      resolved: 545,
      pending: 48,
      escalated: 27,
      averageRating: 4.6,
      satisfactionRate: 92,
      trend: '+4%',
      topCategories: ['Technical Support', 'General Inquiry'],
      bestAgent: 'John D.',
      weeklyBreakdown: [
        { week: 'Week 4', calls: 158, rating: 4.6 },
        { week: 'Week 3', calls: 155, rating: 4.5 },
        { week: 'Week 2', calls: 152, rating: 4.7 },
        { week: 'Week 1', calls: 155, rating: 4.6 }
      ],
      agentRankings: [
        { name: 'Sarah T.', calls: 168, rating: 4.8, resolved: 155 },
        { name: 'John D.', calls: 165, rating: 4.9, resolved: 158 },
        { name: 'Mike R.', calls: 158, rating: 4.8, resolved: 150 },
        { name: 'Helen W.', calls: 129, rating: 4.6, resolved: 115 }
      ]
    }
  ];

  const yearlyReports = [
    { 
      id: 1,
      year: '2026',
      totalCalls: 3850,
      resolved: 3480,
      averageRating: 4.7,
      satisfactionRate: 94,
      growth: '+12%',
      monthlyBreakdown: [
        { month: 'Jan', calls: 620, rating: 4.6 },
        { month: 'Feb', calls: 645, rating: 4.7 },
        { month: 'Mar', calls: 630, rating: 4.8 },
        { month: 'Apr', calls: 615, rating: 4.7 },
        { month: 'May', calls: 625, rating: 4.7 },
        { month: 'Jun', calls: 640, rating: 4.8 }
      ],
      quarterlyBreakdown: [
        { quarter: 'Q1 2026', calls: 1895, rating: 4.7, satisfaction: 94 },
        { quarter: 'Q2 2026', calls: 1880, rating: 4.8, satisfaction: 95 },
        { quarter: 'Q3 2026', calls: 0, rating: 0, satisfaction: 0 },
        { quarter: 'Q4 2026', calls: 0, rating: 0, satisfaction: 0 }
      ],
      categoryTotals: [
        { name: 'Technical Support', count: 1650, percentage: 43 },
        { name: 'Billing Inquiry', count: 1120, percentage: 29 },
        { name: 'General Inquiry', count: 690, percentage: 18 },
        { name: 'Complaint', count: 390, percentage: 10 }
      ],
      topPerformers: [
        { name: 'Sarah T.', calls: 980, rating: 4.9 },
        { name: 'John D.', calls: 945, rating: 4.8 },
        { name: 'Mike R.', calls: 920, rating: 4.9 },
        { name: 'Helen W.', calls: 745, rating: 4.7 }
      ]
    }
  ];

  const getReports = () => {
    switch(reportType) {
      case 'daily': return dailyReports;
      case 'weekly': return weeklyReports;
      case 'monthly': return monthlyReports;
      case 'yearly': return yearlyReports;
      default: return [];
    }
  };

  const reports = getReports();

  const getSatisfactionColor = (rate) => {
    if (rate >= 95) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    if (rate >= 90) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
  };

  const getTrendIcon = (trend) => {
    if (trend?.startsWith('+')) return <FiTrendingUp className="text-green-600" />;
    if (trend?.startsWith('-')) return <FiTrendingDown className="text-red-600" />;
    return null;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ==============================
  // EXCEL DOWNLOAD FUNCTION
  // ==============================
  const downloadExcel = (report) => {
    try {
      let data = [];
      let sheetName = '';
      
      switch(reportType) {
        case 'daily':
          data = report.calls.map(call => ({
            'Time': call.time,
            'Caller': call.caller,
            'Category': call.category,
            'Duration': call.duration,
            'Status': call.status,
            'Rating': call.rating,
            'Agent': call.agent
          }));
          sheetName = `Daily-Report-${report.date}`;
          break;
          
        case 'weekly':
          data = report.dailyBreakdown.map(day => ({
            'Day': day.day,
            'Calls': day.calls,
            'Rating': day.rating
          }));
          // Add summary
          data.push({});
          data.push({ 'Summary': 'Weekly Totals', 'Calls': report.totalCalls, 'Rating': report.averageRating });
          sheetName = `Weekly-Report-${report.week.replace(/\s/g, '-')}`;
          break;
          
        case 'monthly':
          data = report.weeklyBreakdown.map(week => ({
            'Week': week.week,
            'Calls': week.calls,
            'Rating': week.rating
          }));
          data.push({});
          data.push({ 'Agent Rankings': '---' });
          report.agentRankings.forEach(agent => {
            data.push({
              'Agent': agent.name,
              'Calls': agent.calls,
              'Rating': agent.rating,
              'Resolved': agent.resolved
            });
          });
          sheetName = `Monthly-Report-${report.month.replace(/\s/g, '-')}`;
          break;
          
        case 'yearly':
          data = report.quarterlyBreakdown.map(q => ({
            'Quarter': q.quarter,
            'Calls': q.calls,
            'Rating': q.rating,
            'Satisfaction': `${q.satisfaction}%`
          }));
          sheetName = `Yearly-Report-${report.year}`;
          break;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
      XLSX.writeFile(workbook, `${sheetName}.xlsx`);
    } catch (error) {
      console.error('Excel download error:', error);
      alert('Failed to download Excel file');
    }
  };

  // ==============================
  // PDF DOWNLOAD FUNCTION - FIXED
  // ==============================
  const downloadPDF = (report) => {
    try {
      const doc = new jsPDF();
      let title = '';
      let headers = [];
      let rows = [];

      switch(reportType) {
        case 'daily':
          title = `Call Center Daily Report - ${report.date} (${report.day})`;
          headers = [['Time', 'Caller', 'Category', 'Duration', 'Status', 'Rating', 'Agent']];
          rows = report.calls.map(call => [
            call.time,
            call.caller,
            call.category,
            call.duration,
            call.status,
            call.rating.toString(),
            call.agent
          ]);
          break;
          
        case 'weekly':
          title = `Weekly Report - ${report.week} (${report.startDate} to ${report.endDate})`;
          headers = [['Day', 'Calls', 'Rating']];
          rows = report.dailyBreakdown.map(day => [
            day.day,
            day.calls.toString(),
            day.rating.toString()
          ]);
          break;
          
        case 'monthly':
          title = `Monthly Report - ${report.month}`;
          headers = [['Week', 'Calls', 'Rating']];
          rows = report.weeklyBreakdown.map(week => [
            week.week,
            week.calls.toString(),
            week.rating.toString()
          ]);
          break;
          
        case 'yearly':
          title = `Yearly Report - ${report.year}`;
          headers = [['Quarter', 'Calls', 'Rating', 'Satisfaction']];
          rows = report.quarterlyBreakdown.map(q => [
            q.quarter,
            q.calls.toString(),
            q.rating.toString(),
            `${q.satisfaction}%`
          ]);
          break;
      }

      doc.setFontSize(16);
      doc.text(title, 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
      doc.text(`Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`, 14, 28);

      // Use autoTable correctly
      autoTable(doc, {
        head: headers,
        body: rows,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [128, 0, 128] }
      });

      // Add summary at the bottom
      const finalY = doc.lastAutoTable?.finalY || 35 + (rows.length * 10);
      doc.setFontSize(12);
      doc.text('Summary', 14, finalY + 10);
      doc.setFontSize(10);
      doc.text(`Total Calls: ${report.totalCalls}`, 14, finalY + 17);
      doc.text(`Resolved: ${report.resolved || report.totalCalls - (report.pending || 0)}`, 14, finalY + 24);
      doc.text(`Average Rating: ${report.averageRating}`, 14, finalY + 31);
      doc.text(`Satisfaction Rate: ${report.satisfactionRate || report.satisfaction}%`, 14, finalY + 38);

      doc.save(`${title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to download PDF file');
    }
  };

  const stats = [
    { label: 'Total Calls', value: '3,850', icon: FiBarChart2, change: '+12%', color: 'purple' },
    { label: 'Avg Rating', value: '4.7', icon: FiStar, change: '+0.2', color: 'yellow' },
    { label: 'Resolution Rate', value: '94%', icon: FiCheckCircle, change: '+5%', color: 'green' },
    { label: 'Avg Time', value: '4.5 min', icon: FiClock, change: '-0.3', color: 'blue' }
  ];

  const getColorStyles = (color) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    };
    return colors[color] || colors.purple;
  };

  // CSS Styles as a constant
  const styles = {
    fadeIn: {
      animation: 'fadeIn 0.3s ease-out'
    },
    slideDown: {
      animation: 'slideDown 0.3s ease-out'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex overflow-hidden">
      <CallCenterSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 ml-14 lg:ml-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Call Center Reports
                </h1>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                  {reportType.charAt(0).toUpperCase() + reportType.slice(1)} View
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-white dark:bg-gray-600 text-purple-600 shadow-sm' 
                        : 'text-gray-500 hover:text-purple-600'
                    }`}
                    title="List View"
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-white dark:bg-gray-600 text-purple-600 shadow-sm' 
                        : 'text-gray-500 hover:text-purple-600'
                    }`}
                    title="Grid View"
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                </div>

                {/* Refresh Button */}
                <button className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                  <FiRefreshCw className="w-5 h-5" />
                </button>

                {/* Notification Bell */}
                <button className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fadeIn">
                      <Link to="/callcenter/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20">
                        Your Profile
                      </Link>
                      <Link to="/callcenter/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20">
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-12 h-12 rounded-xl ${getColorStyles(stat.color)} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Report Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {['daily', 'weekly', 'monthly', 'yearly'].map(type => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        reportType === type 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 scale-105' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      showFilters 
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <FiFilter className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300">
                    <FiPrinter className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300">
                    <FiShare2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slideDown">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Agent
                    </label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="">All Agents</option>
                      <option value="sarah">Sarah T.</option>
                      <option value="john">John D.</option>
                      <option value="mike">Mike R.</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="">All Categories</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Reports List/Grid */}
            {viewMode === 'list' ? (
              <div className="space-y-4">
                {reports.map(report => (
                  <div 
                    key={report.id} 
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group"
                  >
                    {/* Header Row */}
                    <div className="p-6 cursor-pointer" onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}>
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {report.date ? new Date(report.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              }) : report.week || report.month || report.year}
                            </h3>
                            {report.day && (
                              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                                {report.day}
                              </span>
                            )}
                          </div>
                          {report.startDate && report.endDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                            </p>
                          )}
                          
                          {/* Quick Stats */}
                          <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center gap-1">
                              <FiBarChart2 className="w-4 h-4 text-purple-600" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-gray-900 dark:text-white">{report.totalCalls}</span> calls
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FiStar className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-gray-900 dark:text-white">{report.averageRating}</span> avg
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FiCheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-green-600">{report.satisfactionRate || report.satisfaction}%</span> satisfied
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Download Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadExcel(report);
                              }}
                              className="px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-green-600/30"
                              title="Download Excel"
                            >
                              <FiFileText className="w-4 h-4" />
                              <span className="hidden sm:inline">Excel</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadPDF(report);
                              }}
                              className="px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-red-600/30"
                              title="Download PDF"
                            >
                              <FiDownload className="w-4 h-4" />
                              <span className="hidden sm:inline">PDF</span>
                            </button>
                          </div>

                          {/* View Details Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReport(report);
                              setViewModal(true);
                            }}
                            className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all duration-300"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>

                          {/* Expand/Collapse Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId(expandedId === report.id ? null : report.id);
                            }}
                            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                          >
                            {expandedId === report.id ? (
                              <FiChevronUp className="w-5 h-5" />
                            ) : (
                              <FiChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === report.id && (
                      <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700/30 animate-slideDown">
                        {reportType === 'daily' && (
                          <div className="space-y-6">
                            {/* Categories Breakdown */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <FiPieChart className="text-purple-600" />
                                Categories Breakdown
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  {report.categories.map((cat, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                      <span className="text-sm text-gray-600 dark:text-gray-400 w-32">{cat.name}</span>
                                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                                          style={{ width: `${cat.percentage}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">{cat.count}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Category Summary</p>
                                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{report.categories.length} categories</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Top: <span className="font-semibold text-purple-600">{report.categories[0].name}</span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Call Details Table */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <FiActivity className="text-purple-600" />
                                Call Details
                              </h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                      <th className="p-3 text-left text-gray-600 dark:text-gray-400 font-medium">Time</th>
                                      <th className="p-3 text-left text-gray-600 dark:text-gray-400 font-medium">Caller</th>
                                      <th className="p-3 text-left text-gray-600 dark:text-gray-400 font-medium">Category</th>
                                      <th className="p-3 text-left text-gray-600 dark:text-gray-400 font-medium">Duration</th>
                                      <th className="p-3 text-left text-gray-600 dark:text-gray-400 font-medium">Status</th>
                                      <th className="p-3 text-left text-gray-600 dark:text-gray-400 font-medium">Rating</th>
                                      <th className="p-3 text-left text-gray-600 dark:text-gray-400 font-medium">Agent</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {report.calls.map(call => (
                                      <tr key={call.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-3 text-gray-900 dark:text-white">{call.time}</td>
                                        <td className="p-3 text-gray-900 dark:text-white">{call.caller}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-400">{call.category}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-400">{call.duration}</td>
                                        <td className="p-3">
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            call.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                            call.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-orange-100 text-orange-700'
                                          }`}>
                                            {call.status}
                                          </span>
                                        </td>
                                        <td className="p-3">
                                          <div className="flex items-center gap-1">
                                            <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                                            <span className="text-gray-900 dark:text-white">{call.rating}</span>
                                          </div>
                                        </td>
                                        <td className="p-3 text-gray-600 dark:text-gray-400">{call.agent}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Agent Performance */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Agent Performance</h4>
                                <div className="space-y-2">
                                  {report.agentPerformance.map((agent, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                                      <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{agent.calls} calls</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-semibold text-purple-600">{agent.avgRating} avg</p>
                                        <p className="text-xs text-green-600">{agent.resolved} resolved</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Peak Hours</h4>
                                <div className="space-y-2">
                                  {report.peakHours.map((hour, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                                      <span className="text-sm text-gray-600 dark:text-gray-400">{hour.hour}</span>
                                      <span className="text-sm font-semibold text-purple-600">{hour.calls} calls</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {reportType === 'weekly' && (
                          <div className="space-y-6">
                            {/* Daily Breakdown */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Daily Breakdown</h4>
                              <div className="grid grid-cols-7 gap-2">
                                {report.dailyBreakdown.map((day, idx) => (
                                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{day.day.substring(0, 3)}</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{day.calls}</p>
                                    <div className="flex items-center justify-center gap-1">
                                      <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                                      <span className="text-xs text-gray-600 dark:text-gray-400">{day.rating}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Category Totals */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Category Totals</h4>
                              <div className="space-y-2">
                                {report.categoryTotals.map((cat, idx) => (
                                  <div key={idx} className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 w-32">{cat.name}</span>
                                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                                        style={{ width: `${cat.percentage}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Top Agents */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Top Agents</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {report.topAgents.map((agent, idx) => (
                                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                                      {agent.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{agent.calls} calls · {agent.rating} avg</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {reportType === 'monthly' && (
                          <div className="space-y-6">
                            {/* Weekly Breakdown */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Weekly Breakdown</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {report.weeklyBreakdown.map((week, idx) => (
                                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{week.week}</p>
                                    <p className="text-2xl font-bold text-purple-600">{week.calls}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                      <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                                      <span className="text-xs text-gray-600 dark:text-gray-400">{week.rating} avg</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Agent Rankings */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Agent Rankings</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                      <th className="p-3 text-left">Agent</th>
                                      <th className="p-3 text-left">Calls</th>
                                      <th className="p-3 text-left">Rating</th>
                                      <th className="p-3 text-left">Resolved</th>
                                      <th className="p-3 text-left">Efficiency</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {report.agentRankings.map((agent, idx) => {
                                      const efficiency = Math.round((agent.resolved / agent.calls) * 100);
                                      return (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                          <td className="p-3">
                                            <div className="flex items-center gap-2">
                                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs">
                                                {agent.name.charAt(0)}
                                              </div>
                                              <span className="font-medium">{agent.name}</span>
                                            </div>
                                          </td>
                                          <td className="p-3 font-semibold">{agent.calls}</td>
                                          <td className="p-3">
                                            <div className="flex items-center gap-1">
                                              <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                                              {agent.rating}
                                            </div>
                                          </td>
                                          <td className="p-3 text-green-600">{agent.resolved}</td>
                                          <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              efficiency >= 90 ? 'bg-green-100 text-green-700' :
                                              efficiency >= 80 ? 'bg-yellow-100 text-yellow-700' :
                                              'bg-orange-100 text-orange-700'
                                            }`}>
                                              {efficiency}%
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}

                        {reportType === 'yearly' && (
                          <div className="space-y-6">
                            {/* Quarterly Breakdown */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quarterly Breakdown</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {report.quarterlyBreakdown.map((quarter, idx) => (
                                  <div key={idx} className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${quarter.calls === 0 ? 'opacity-50' : ''}`}>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{quarter.quarter}</p>
                                    <p className="text-2xl font-bold text-purple-600">{quarter.calls || '—'}</p>
                                    {quarter.calls > 0 && (
                                      <>
                                        <div className="flex items-center gap-1 mt-1">
                                          <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                                          <span className="text-xs text-gray-600 dark:text-gray-400">{quarter.rating}</span>
                                        </div>
                                        <p className="text-xs text-green-600 mt-1">{quarter.satisfaction}% satisfaction</p>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Monthly Trend */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Monthly Trend</h4>
                              <div className="flex items-end gap-1 h-32">
                                {report.monthlyBreakdown.map((month, idx) => {
                                  const height = (month.calls / 650) * 100;
                                  return (
                                    <div key={idx} className="flex-1 flex flex-col items-center group">
                                      <div className="relative w-full">
                                        <div 
                                          className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg transition-all duration-300 group-hover:from-purple-700 group-hover:to-pink-700"
                                          style={{ height: `${height}%` }}
                                        />
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                          {month.month}: {month.calls} calls
                                        </div>
                                      </div>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{month.month}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Category Totals */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Category Totals</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  {report.categoryTotals.map((cat, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                      <span className="text-sm text-gray-600 dark:text-gray-400 w-32">{cat.name}</span>
                                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                                          style={{ width: `${cat.percentage}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.count}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
                                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">Yearly Summary</p>
                                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{report.totalCalls}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">total calls</p>
                                  <div className="flex items-center gap-2 mt-3">
                                    <FiTrendingUp className="text-green-600" />
                                    <span className="text-sm font-medium text-green-600">{report.growth} growth</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Top Performers */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Top Performers</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                {report.topPerformers.map((agent, idx) => (
                                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                                      {agent.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900 dark:text-white">{agent.name}</p>
                                      <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{agent.calls} calls</span>
                                        <div className="flex items-center gap-1">
                                          <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                                          <span className="text-xs font-medium text-gray-900 dark:text-white">{agent.rating}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map(report => (
                  <div 
                    key={report.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:-translate-y-1"
                    onClick={() => {
                      setSelectedReport(report);
                      setViewModal(true);
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {report.date ? new Date(report.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          }) : report.week || report.month || report.year}
                        </h3>
                        {report.day && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{report.day}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSatisfactionColor(report.satisfactionRate || report.satisfaction)}`}>
                        {report.satisfactionRate || report.satisfaction}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{report.totalCalls}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Calls</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-xl font-bold text-yellow-600">{report.averageRating}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                      </div>
                    </div>

                    {report.trend && (
                      <div className="flex items-center justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
                        <span className="text-gray-500 dark:text-gray-400">Trend</span>
                        <span className="flex items-center gap-1">
                          {getTrendIcon(report.trend)}
                          {report.trend}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-end mt-3">
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                        View Details
                        <FiChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Report Detail Modal */}
      {viewModal && selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {selectedReport.date ? new Date(selectedReport.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : selectedReport.week || selectedReport.month || selectedReport.year}
                  </h2>
                  {selectedReport.startDate && selectedReport.endDate && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(selectedReport.startDate).toLocaleDateString()} - {new Date(selectedReport.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadExcel(selectedReport)}
                    className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300"
                    title="Download Excel"
                  >
                    <FiFileText className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => downloadPDF(selectedReport)}
                    className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300"
                    title="Download PDF"
                  >
                    <FiDownload className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewModal(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-center text-white">
                  <FiBarChart2 className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{selectedReport.totalCalls}</p>
                  <p className="text-xs opacity-90">Total Calls</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-center text-white">
                  <FiCheckCircle className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{selectedReport.resolved || selectedReport.totalCalls - (selectedReport.pending || 0)}</p>
                  <p className="text-xs opacity-90">Resolved</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-4 text-center text-white">
                  <FiStar className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{selectedReport.averageRating}</p>
                  <p className="text-xs opacity-90">Avg Rating</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-center text-white">
                  <FiClock className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{selectedReport.averageTime || '4.5m'}</p>
                  <p className="text-xs opacity-90">Avg Time</p>
                </div>
              </div>

              {/* Content based on report type */}
              {reportType === 'daily' && (
                <>
                  {/* Categories */}
                  {selectedReport.categories && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <FiPieChart className="text-purple-600" />
                        Categories Breakdown
                      </h3>
                      <div className="space-y-3">
                        {selectedReport.categories.map((cat, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-32">{cat.name}</span>
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                                style={{ width: `${cat.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Call Details */}
                  {selectedReport.calls && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Call Details</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                              <th className="p-3 text-left">Time</th>
                              <th className="p-3 text-left">Caller</th>
                              <th className="p-3 text-left">Category</th>
                              <th className="p-3 text-left">Duration</th>
                              <th className="p-3 text-left">Status</th>
                              <th className="p-3 text-left">Rating</th>
                              <th className="p-3 text-left">Agent</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {selectedReport.calls.map(call => (
                              <tr key={call.id}>
                                <td className="p-3">{call.time}</td>
                                <td className="p-3 font-medium">{call.caller}</td>
                                <td className="p-3">{call.category}</td>
                                <td className="p-3">{call.duration}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    call.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                    call.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-orange-100 text-orange-700'
                                  }`}>
                                    {call.status}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                                    {call.rating}
                                  </div>
                                </td>
                                <td className="p-3">{call.agent}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}

              {reportType === 'weekly' && selectedReport.dailyBreakdown && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Daily Breakdown</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {selectedReport.dailyBreakdown.map((day, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{day.day.substring(0, 3)}</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{day.calls}</p>
                        <div className="flex items-center justify-center gap-1">
                          <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs">{day.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reportType === 'monthly' && selectedReport.agentRankings && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Agent Rankings</h3>
                  <div className="space-y-2">
                    {selectedReport.agentRankings.map((agent, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{agent.calls} calls</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-purple-600">{agent.rating} avg</p>
                          <p className="text-xs text-green-600">{agent.resolved} resolved</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reportType === 'yearly' && selectedReport.quarterlyBreakdown && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quarterly Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedReport.quarterlyBreakdown.map((quarter, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{quarter.quarter}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{quarter.calls || '—'}</p>
                        {quarter.calls > 0 && (
                          <>
                            <div className="flex items-center gap-1 mt-1">
                              <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{quarter.rating}</span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">{quarter.satisfaction}% sat</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewModal(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => downloadPDF(selectedReport)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 font-medium shadow-lg shadow-purple-600/30"
                >
                  <FiDownload className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add keyframe animations in a style tag */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyReports;