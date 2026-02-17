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
  FiStar,
  FiCheckCircle,
  FiClock,
  FiPhoneCall,
  FiTrendingDown,
  FiPieChart,
  FiActivity
} from 'react-icons/fi';

const AdminAnalytics = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('week');

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FiHome },
    { path: '/admin/agents', label: 'Agents', icon: FiUsers },
    { path: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
    { path: '/admin/analytics', label: 'Analytics', icon: FiTrendingUp, active: true },
  ];

  const performanceData = {
    daily: [
      { day: 'Mon', calls: 245, satisfaction: 94, rating: 4.7 },
      { day: 'Tue', calls: 252, satisfaction: 95, rating: 4.8 },
      { day: 'Wed', calls: 268, satisfaction: 93, rating: 4.6 },
      { day: 'Thu', calls: 275, satisfaction: 96, rating: 4.9 },
      { day: 'Fri', calls: 290, satisfaction: 94, rating: 4.7 },
      { day: 'Sat', calls: 220, satisfaction: 92, rating: 4.5 },
      { day: 'Sun', calls: 198, satisfaction: 91, rating: 4.4 },
    ],
    weekly: [
      { week: 'Week 7', calls: 1650, satisfaction: 94, rating: 4.7 },
      { week: 'Week 6', calls: 1570, satisfaction: 92, rating: 4.6 },
      { week: 'Week 5', calls: 1620, satisfaction: 93, rating: 4.7 },
      { week: 'Week 4', calls: 1580, satisfaction: 91, rating: 4.5 },
    ],
    monthly: [
      { month: 'Feb', calls: 6850, satisfaction: 94, rating: 4.7 },
      { month: 'Jan', calls: 6340, satisfaction: 92, rating: 4.6 },
      { month: 'Dec', calls: 6120, satisfaction: 91, rating: 4.5 },
      { month: 'Nov', calls: 5980, satisfaction: 90, rating: 4.4 },
    ]
  };

  const categoryBreakdown = [
    { category: 'Technical Support', percentage: 45, calls: 2340, satisfaction: 95 },
    { category: 'Billing Inquiry', percentage: 30, calls: 1560, satisfaction: 92 },
    { category: 'General Support', percentage: 15, calls: 780, satisfaction: 94 },
    { category: 'Product Info', percentage: 10, calls: 520, satisfaction: 96 },
  ];

  const agentRanking = [
    { name: 'Jane Smith', calls: 287, rating: 4.9, satisfaction: 98, efficiency: 96 },
    { name: 'Sarah Wilson', calls: 275, rating: 4.8, satisfaction: 97, efficiency: 94 },
    { name: 'Mike Johnson', calls: 268, rating: 4.8, satisfaction: 96, efficiency: 93 },
    { name: 'John Doe', calls: 252, rating: 4.7, satisfaction: 94, efficiency: 91 },
    { name: 'Emily Davis', calls: 245, rating: 4.6, satisfaction: 92, efficiency: 89 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Avg Response Time', value: '4.2 min', change: '-0.3', icon: FiClock, color: 'blue' },
    { label: 'First Call Resolution', value: '86%', change: '+2%', icon: FiCheckCircle, color: 'green' },
    { label: 'Customer Satisfaction', value: '94%', change: '+1%', icon: FiStar, color: 'yellow' },
    { label: 'Agent Utilization', value: '92%', change: '+3%', icon: FiActivity, color: 'purple' }
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
                  Advanced Analytics
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last 90 Days</option>
                </select>
                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiDownload className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>
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
                  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
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

            {/* Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Trends</h2>
              <div className="h-80">
                <div className="flex h-64 items-end justify-between gap-2">
                  {(timeRange === 'week' ? performanceData.daily : 
                    timeRange === 'month' ? performanceData.weekly : performanceData.monthly).map((item, index) => {
                    const maxCalls = Math.max(...(timeRange === 'week' ? performanceData.daily : 
                      timeRange === 'month' ? performanceData.weekly : performanceData.monthly).map(d => d.calls));
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                          style={{ height: `${(item.calls / maxCalls) * 200}px` }}
                        >
                          <div className="relative group">
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              {item.calls} calls
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.day || item.week || item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Call Volume</span>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiPieChart className="text-blue-600" />
                  Category Breakdown
                </h2>
                <div className="space-y-4">
                  {categoryBreakdown.map((cat, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.category}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{cat.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">{cat.calls.toLocaleString()} calls</span>
                        <span className="text-xs text-green-600">{cat.satisfaction}% satisfaction</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Ranking */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiUsers className="text-blue-600" />
                  Top Performing Agents
                </h2>
                <div className="space-y-3">
                  {agentRanking.map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{agent.calls} calls</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{agent.rating}</span>
                        </div>
                        <p className="text-xs text-green-600">{agent.efficiency}% efficiency</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Satisfaction Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Satisfaction Trend</h2>
              <div className="flex items-end justify-between h-40 gap-1">
                {performanceData.daily.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t-lg"
                      style={{ height: `${day.satisfaction * 1.5}px` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{day.day}</span>
                    <span className="text-xs font-medium">{day.satisfaction}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;