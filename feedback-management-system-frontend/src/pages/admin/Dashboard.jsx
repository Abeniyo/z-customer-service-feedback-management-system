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
  FiSettings,
  FiLogOut,
  FiSun,
  FiMoon,
  FiBell,
  FiMenu,
  FiX,
  FiUser,
  FiTrendingUp,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiPhoneCall,
  FiMail,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiEye
} from 'react-icons/fi';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FiHome, active: true },
    { path: '/admin/agents', label: 'Agents', icon: FiUsers },
    { path: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
    { path: '/admin/analytics', label: 'Analytics', icon: FiTrendingUp },
  ];

  const stats = [
    { 
      label: 'Total Agents', 
      value: '24', 
      icon: FiUsers, 
      change: '+3', 
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      label: 'Active Calls', 
      value: '156', 
      icon: FiPhoneCall, 
      change: '+12%', 
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      label: 'Avg Rating', 
      value: '4.8', 
      icon: FiStar, 
      change: '+0.2', 
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    { 
      label: 'Response Time', 
      value: '2.4m', 
      icon: FiClock, 
      change: '-0.3m', 
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const recentAgents = [
    { id: 1, name: 'Jane Smith', email: 'jane.smith@company.com', status: 'online', calls: 45, rating: 4.9 },
    { id: 2, name: 'John Doe', email: 'john.doe@company.com', status: 'busy', calls: 38, rating: 4.7 },
    { id: 3, name: 'Mike Johnson', email: 'mike.j@company.com', status: 'offline', calls: 42, rating: 4.8 },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.w@company.com', status: 'online', calls: 51, rating: 5.0 },
  ];

  const performanceData = [
    { day: 'Mon', calls: 145, resolved: 132 },
    { day: 'Tue', calls: 152, resolved: 140 },
    { day: 'Wed', calls: 168, resolved: 155 },
    { day: 'Thu', calls: 175, resolved: 162 },
    { day: 'Fri', calls: 190, resolved: 178 },
    { day: 'Sat', calls: 120, resolved: 110 },
    { day: 'Sun', calls: 98, resolved: 90 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

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
                  Admin Dashboard
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiDownload className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiRefreshCw className="w-5 h-5" />
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
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Admin'}! 👋</h1>
              <p className="text-blue-100">Here's your team's performance overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        <Icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      } bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full`}>
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

            {/* Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Performance</h2>
                <select className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {performanceData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex justify-center gap-1">
                      <div 
                        className="w-4 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${(item.calls / 200) * 160}px` }}
                      ></div>
                      <div 
                        className="w-4 bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                        style={{ height: `${(item.resolved / 200) * 160}px` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
                </div>
              </div>
            </div>

            {/* Recent Agents */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Agents</h2>
                <Link to="/admin/agents" className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Agent</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Calls</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Rating</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAgents.map((agent) => (
                      <tr key={agent.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs">
                              {agent.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{agent.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${getStatusColor(agent.status)} rounded-full`}></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{agent.status}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{agent.calls}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{agent.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button className="p-1 text-blue-600 hover:text-blue-700">
                            <FiEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/agents" className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Manage Agents</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">24 active agents</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/admin/reports" className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiBarChart2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">View Reports</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Performance analytics</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/admin/analytics" className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiTrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Analytics</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Deep insights</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;