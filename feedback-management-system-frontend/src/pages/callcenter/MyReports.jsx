import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import CallCenterSidebar from './CallCenterSidebar';

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
  FiEye
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

  // Mock data
  const dailyReports = [
    { 
      id: 1,
      date: '2026-02-17',
      totalCalls: 24,
      resolved: 18,
      pending: 4,
      escalated: 2,
      averageRating: 4.8,
      satisfactionRate: 96,
      averageTime: '4.5 min',
      categories: [
        { name: 'Technical Support', count: 10 },
        { name: 'Billing', count: 8 },
        { name: 'General', count: 6 }
      ]
    },
    { 
      id: 2,
      date: '2026-02-16',
      totalCalls: 22,
      resolved: 16,
      pending: 5,
      escalated: 1,
      averageRating: 4.7,
      satisfactionRate: 94,
      averageTime: '5.2 min',
      categories: [
        { name: 'Technical Support', count: 9 },
        { name: 'Billing', count: 7 },
        { name: 'General', count: 6 }
      ]
    },
    { 
      id: 3,
      date: '2026-02-15',
      totalCalls: 20,
      resolved: 15,
      pending: 4,
      escalated: 1,
      averageRating: 4.9,
      satisfactionRate: 98,
      averageTime: '4.2 min',
      categories: [
        { name: 'Technical Support', count: 8 },
        { name: 'Billing', count: 6 },
        { name: 'General', count: 6 }
      ]
    }
  ];

  const weeklyReports = [
    { 
      id: 1,
      week: 'Week 7, 2026',
      startDate: '2026-02-10',
      endDate: '2026-02-16',
      totalCalls: 145,
      resolved: 120,
      averageRating: 4.7,
      satisfactionRate: 94,
      trend: '+5%',
      bestDay: 'Friday',
      worstDay: 'Monday'
    },
    { 
      id: 2,
      week: 'Week 6, 2026',
      startDate: '2026-02-03',
      endDate: '2026-02-09',
      totalCalls: 138,
      resolved: 115,
      averageRating: 4.6,
      satisfactionRate: 92,
      trend: '+3%',
      bestDay: 'Thursday',
      worstDay: 'Tuesday'
    }
  ];

  const monthlyReports = [
    { 
      id: 1,
      month: 'February 2026',
      totalCalls: 580,
      resolved: 510,
      averageRating: 4.7,
      satisfactionRate: 94,
      trend: '+8%',
      topCategories: ['Technical Support', 'Billing'],
      bestAgent: 'Jane Smith'
    },
    { 
      id: 2,
      month: 'January 2026',
      totalCalls: 550,
      resolved: 480,
      averageRating: 4.6,
      satisfactionRate: 92,
      trend: '+4%',
      topCategories: ['Technical Support', 'General'],
      bestAgent: 'John Doe'
    }
  ];

  const yearlyReports = [
    { 
      id: 1,
      year: '2026',
      totalCalls: 1650,
      resolved: 1480,
      averageRating: 4.7,
      satisfactionRate: 94,
      growth: '+12%',
      quarterlyBreakdown: [
        { quarter: 'Q1', calls: 410, rating: 4.6 },
        { quarter: 'Q2', calls: 420, rating: 4.7 },
        { quarter: 'Q3', calls: 415, rating: 4.8 },
        { quarter: 'Q4', calls: 405, rating: 4.7 }
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
    return <FiTrendingDown className="text-red-600" />;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Total Calls', value: '1650', icon: FiBarChart2, change: '+12%', color: 'purple' },
    { label: 'Avg Rating', value: '4.7', icon: FiStar, change: '+0.2', color: 'yellow' },
    { label: 'Resolution Rate', value: '94%', icon: FiCheckCircle, change: '+5%', color: 'green' },
    { label: 'Avg Time', value: '4.8 min', icon: FiClock, change: '-0.3', color: 'blue' }
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      <CallCenterSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header - Fixed at top */}


        {/* Main Content - Scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 rounded-lg ${getColorStyles(stat.color)} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Report Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {['daily', 'weekly', 'monthly', 'yearly'].map(type => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        reportType === type 
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FiFilter className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FiDownload className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {reportType === 'daily' && (
                <div className="mt-4 flex items-center gap-2">
                  <FiCalendar className="text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {reports.map(report => (
                <div 
                  key={report.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:-translate-y-1 group"
                  onClick={() => {
                    setSelectedReport(report);
                    setViewModal(true);
                  }}
                >
                  {/* Report Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {report.date ? new Date(report.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : report.week || report.month || report.year}
                      </h3>
                      {report.startDate && report.endDate && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {report.startDate} - {report.endDate}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {report.trend && (
                        <span className="flex items-center gap-1 text-sm font-medium">
                          {getTrendIcon(report.trend)}
                          {report.trend}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSatisfactionColor(report.satisfactionRate)}`}>
                        {report.satisfactionRate}% Satisfaction
                      </span>
                      <FiEye className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{report.totalCalls}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Calls</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">{report.resolved}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Resolved</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{report.averageRating}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{report.averageTime || 'N/A'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Avg Time</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Report Detail Modal */}
      {viewModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedReport.date ? new Date(selectedReport.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : selectedReport.week || selectedReport.month || selectedReport.year}
                </h2>
                <button
                  onClick={() => setViewModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                  <FiBarChart2 className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.totalCalls}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Calls</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.resolved}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Resolved</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                  <FiStar className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.averageRating}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <FiClock className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.averageTime || 'N/A'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Time</p>
                </div>
              </div>

              {/* Categories */}
              {selectedReport.categories && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories Breakdown</h3>
                  <div className="space-y-3">
                    {selectedReport.categories.map((cat, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-32">{cat.name}</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${(cat.count / selectedReport.totalCalls) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quarterly Breakdown */}
              {selectedReport.quarterlyBreakdown && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quarterly Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedReport.quarterlyBreakdown.map((quarter, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{quarter.quarter}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{quarter.calls} calls</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rating: {quarter.rating}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {selectedReport.bestDay && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm text-green-600 dark:text-green-400 mb-1">Best Day</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedReport.bestDay}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Worst Day</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedReport.worstDay}</p>
                  </div>
                </div>
              )}

              {selectedReport.bestAgent && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Top Performer</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedReport.bestAgent}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                  <FiDownload className="w-4 h-4" />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;