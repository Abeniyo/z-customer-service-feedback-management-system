import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

// Import React Icons
import { 
  FiHome, 
  FiUsers, 
  FiBarChart2, 
  FiTrendingUp,
  FiLogOut,
  FiSun,
  FiMoon,
  FiBell,
  FiMenu,
  FiX,
  FiDownload,
  FiCalendar,
  FiFilter,
  FiEye,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiPhoneCall,
  FiTrendingDown
} from 'react-icons/fi';

const AdminReports = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FiHome },
    { path: '/admin/agents', label: 'Agents', icon: FiUsers },
    { path: '/admin/reports', label: 'Reports', icon: FiBarChart2, active: true },
    { path: '/admin/analytics', label: 'Analytics', icon: FiTrendingUp },
  ];

  // Mock data
  const dailyReports = [
    { 
      id: 1,
      date: '2026-02-17',
      totalCalls: 245,
      resolved: 218,
      pending: 22,
      escalated: 5,
      averageRating: 4.7,
      satisfactionRate: 94,
      averageTime: '4.2 min',
      agentPerformance: [
        { name: 'Jane Smith', calls: 45, rating: 4.9 },
        { name: 'John Doe', calls: 38, rating: 4.7 },
        { name: 'Mike Johnson', calls: 42, rating: 4.8 }
      ]
    },
    { 
      id: 2,
      date: '2026-02-16',
      totalCalls: 232,
      resolved: 205,
      pending: 24,
      escalated: 3,
      averageRating: 4.6,
      satisfactionRate: 92,
      averageTime: '4.5 min',
      agentPerformance: [
        { name: 'Jane Smith', calls: 42, rating: 4.8 },
        { name: 'John Doe', calls: 36, rating: 4.6 },
        { name: 'Sarah Wilson', calls: 40, rating: 4.9 }
      ]
    }
  ];

  const weeklyReports = [
    { 
      id: 1,
      week: 'Week 7, 2026',
      startDate: '2026-02-10',
      endDate: '2026-02-16',
      totalCalls: 1650,
      resolved: 1480,
      averageRating: 4.7,
      satisfactionRate: 94,
      trend: '+5%',
      topAgent: 'Jane Smith',
      topAgentCalls: 287
    },
    { 
      id: 2,
      week: 'Week 6, 2026',
      startDate: '2026-02-03',
      endDate: '2026-02-09',
      totalCalls: 1570,
      resolved: 1410,
      averageRating: 4.6,
      satisfactionRate: 92,
      trend: '+3%',
      topAgent: 'Sarah Wilson',
      topAgentCalls: 275
    }
  ];

  const monthlyReports = [
    { 
      id: 1,
      month: 'February 2026',
      totalCalls: 6850,
      resolved: 6230,
      averageRating: 4.7,
      satisfactionRate: 94,
      trend: '+8%',
      topAgent: 'Jane Smith',
      totalAgents: 24,
      avgCallsPerAgent: 285
    },
    { 
      id: 2,
      month: 'January 2026',
      totalCalls: 6340,
      resolved: 5720,
      averageRating: 4.6,
      satisfactionRate: 92,
      trend: '+4%',
      topAgent: 'Mike Johnson',
      totalAgents: 22,
      avgCallsPerAgent: 288
    }
  ];

  const yearlyReports = [
    { 
      id: 1,
      year: '2026',
      totalCalls: 45200,
      resolved: 41800,
      averageRating: 4.7,
      satisfactionRate: 94,
      growth: '+12%',
      totalAgents: 28,
      quarterlyBreakdown: [
        { quarter: 'Q1', calls: 11200, rating: 4.6 },
        { quarter: 'Q2', calls: 11500, rating: 4.7 },
        { quarter: 'Q3', calls: 11400, rating: 4.8 },
        { quarter: 'Q4', calls: 11100, rating: 4.7 }
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
    { label: 'Total Reports', value: '156', icon: FiBarChart2, change: '+12', color: 'blue' },
    { label: 'Avg Satisfaction', value: '94%', icon: FiStar, change: '+2%', color: 'green' },
    { label: 'Active Agents', value: '24', icon: FiUsers, change: '+3', color: 'purple' },
    { label: 'Response Time', value: '4.2m', icon: FiClock, change: '-0.3m', color: 'yellow' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        flex flex-col h-full
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FeedbackFlow" className="h-10 w-auto" />
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">FeedbackFlow</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Admin'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'admin@company.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                  ${item.active 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${item.active ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiMenu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Reports
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiDownload className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        Your Profile
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        Settings
                      </button>
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
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const colors = {
                  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                  green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                };
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg ${colors[stat.color]} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change} vs last period
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Report Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2">
                  {['daily', 'weekly', 'monthly', 'yearly'].map(type => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        reportType === type 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FiFilter className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
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
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {reports.map(report => (
                <div 
                  key={report.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 cursor-pointer"
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
                      <FiEye className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{report.totalCalls}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Calls</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">{report.resolved}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Resolved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{report.averageRating}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{report.averageTime || 'N/A'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Avg Time</p>
                    </div>
                  </div>

                  {/* Agent Performance Preview */}
                  {report.agentPerformance && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Top Agents Today:</p>
                      <div className="flex flex-wrap gap-2">
                        {report.agentPerformance.slice(0, 3).map((agent, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                            {agent.name}: {agent.calls} calls
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Report Detail Modal */}
      {viewModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FiPhoneCall className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.totalCalls}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Calls</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.resolved}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Resolved</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FiStar className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.averageRating}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FiClock className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.averageTime || 'N/A'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Time</p>
                </div>
              </div>

              {/* Agent Performance */}
              {selectedReport.agentPerformance && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Agent Performance</h3>
                  <div className="space-y-3">
                    {selectedReport.agentPerformance.map((agent, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs">
                            {agent.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{agent.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{agent.calls} calls</span>
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{agent.rating}</span>
                          </div>
                        </div>
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
                        <p className="text-xs text-gray-500 dark:text-gray-400">{quarter.calls.toLocaleString()} calls</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rating: {quarter.rating}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
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

export default AdminReports;