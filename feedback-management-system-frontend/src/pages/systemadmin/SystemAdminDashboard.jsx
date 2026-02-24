import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import SystemAdminSidebar from './SystemAdminSidebar';

// Import React Icons
import { 
  FiUsers, 
  FiKey, 
  FiShield,
  FiActivity,
  FiServer,
  FiDatabase,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiSun,
  FiMoon,
  FiBell,
  FiSearch,
  FiUserPlus,
  FiLock,
  FiFileText,
  FiDownload,
  FiRefreshCw,
  FiCpu,
  FiHardDrive,
  FiWifi,
  FiZap
} from 'react-icons/fi';

const SystemAdminDashboard = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');

  // System Stats
  const systemStats = [
    { 
      label: 'Total Users', 
      value: '1,284', 
      icon: FiUsers, 
      change: '+12%', 
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      changeColor: 'text-green-600'
    },
    { 
      label: 'Active Sessions', 
      value: '342', 
      icon: FiActivity, 
      change: '+5%', 
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      changeColor: 'text-green-600'
    },
    { 
      label: 'System Uptime', 
      value: '99.9%', 
      icon: FiCpu, 
      change: '+0.1%', 
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      changeColor: 'text-green-600'
    },
    { 
      label: 'Storage Used', 
      value: '156 GB', 
      icon: FiHardDrive, 
      change: '+8%', 
      color: 'orange',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      changeColor: 'text-orange-600'
    }
  ];

  // Quick Actions
  const quickActions = [
    { 
      path: '/systemadmin/users', 
      label: 'Create User', 
      description: 'Add new system user',
      icon: FiUserPlus, 
      color: 'blue',
      borderColor: 'hover:border-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      path: '/systemadmin/roles', 
      label: 'Manage Roles', 
      description: 'Configure user roles',
      icon: FiShield, 
      color: 'purple',
      borderColor: 'hover:border-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      path: '/systemadmin/audit-logs', 
      label: 'View Audit Logs', 
      description: 'Review system activity',
      icon: FiFileText, 
      color: 'green',
      borderColor: 'hover:border-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      path: '/systemadmin/backup', 
      label: 'Backup System', 
      description: 'Create system backup',
      icon: FiDatabase, 
      color: 'orange',
      borderColor: 'hover:border-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  // Recent Activities
  const recentActivities = [
    { id: 1, user: 'Admin User', action: 'Created new user', target: 'john.doe@example.com', time: '2 min ago', status: 'success' },
    { id: 2, user: 'System', action: 'Automated backup', target: 'Database backup', time: '15 min ago', status: 'success' },
    { id: 3, user: 'Admin User', action: 'Modified role permissions', target: 'Call Center Role', time: '1 hour ago', status: 'success' },
    { id: 4, user: 'System', action: 'Security scan', target: 'Completed', time: '2 hours ago', status: 'warning' },
    { id: 5, user: 'Admin User', action: 'Password reset', target: 'User: Sarah', time: '3 hours ago', status: 'success' },
  ];

  // System Alerts
  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Database backup pending', time: '30 min ago', icon: FiAlertCircle },
    { id: 2, type: 'info', message: 'New user registrations: 12', time: '1 hour ago', icon: FiUsers },
    { id: 3, type: 'success', message: 'Security update installed', time: '2 hours ago', icon: FiCheckCircle },
    { id: 4, type: 'error', message: 'Failed login attempts: 3', time: '3 hours ago', icon: FiLock },
  ];

  // System Health Metrics
  const healthMetrics = [
    { label: 'CPU Usage', value: '45%', status: 'normal', icon: FiCpu, color: 'text-green-500' },
    { label: 'Memory Usage', value: '62%', status: 'normal', icon: FiHardDrive, color: 'text-yellow-500' },
    { label: 'Network', value: '120 Mbps', status: 'normal', icon: FiWifi, color: 'text-green-500' },
    { label: 'Response Time', value: '234ms', status: 'good', icon: FiZap, color: 'text-green-500' },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <FiAlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <FiAlertCircle className="w-4 h-4 text-red-500" />;
      default: return <FiCheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAlertStyles = (type) => {
    const styles = {
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400',
      error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
      success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
      info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      <SystemAdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-14 lg:ml-0">
                System Administration Dashboard
              </h1>

              <div className="flex items-center gap-3">
                {/* Time Range Selector */}
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="hidden md:block px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>

                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <FiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="ml-2 bg-transparent border-none focus:outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 w-48"
                  />
                </div>

                {/* Refresh Button */}
                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiRefreshCw className="w-5 h-5" />
                </button>

                {/* Notification Bell */}
                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>

                {/* Profile Menu */}
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
                      <Link to="/systemadmin/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        Your Profile
                      </Link>
                      <Link to="/systemadmin/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
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
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Administrator'}! 🔧</h1>
                  <p className="text-blue-100">System is running smoothly. 3 pending tasks require attention.</p>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">System Time: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* System Health Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {healthMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                        <Icon className={`w-5 h-5 ${metric.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* System Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {systemStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                      <span className={`text-sm font-medium ${stat.changeColor} bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full`}>
                        {stat.change}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} to={action.path} className="group">
                      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 ${action.borderColor} transition-all duration-300 hover:shadow-lg`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-6 h-6 ${action.textColor}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{action.label}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h2>
                  <Link to="/systemadmin/audit-logs" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentActivities.map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      {getStatusIcon(item.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{item.user}</span>
                          <span className="text-xs text-gray-500">{item.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.action}: <span className="font-medium">{item.target}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Alerts */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Alerts</h2>
                  <FiBell className="text-gray-400" />
                </div>
                <div className="space-y-4">
                  {systemAlerts.map(alert => {
                    const Icon = alert.icon;
                    return (
                      <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${getAlertStyles(alert.type)}`}>
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <span className="text-xs opacity-75">{alert.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* System Status Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">All Systems Operational</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2">
                    <FiDatabase className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup: 2 hours ago</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  <FiDownload className="w-4 h-4" />
                  Download System Report
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;