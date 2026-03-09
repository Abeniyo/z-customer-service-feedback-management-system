// CallCenterDashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import CallCenterSidebar from './CallCenterSidebar';

// Import React Icons
import { 
  FiPhoneCall, 
  FiUsers, 
  FiUserCheck, 
  FiClock,
  FiHome,
  FiCheckCircle,
  FiSun,
  FiMoon,
  FiBell,
  FiSearch
} from 'react-icons/fi';

const CallCenterDashboard = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Only 6 cards - clean and professional
  const stats = [
    { 
      label: 'Total Customers', 
      value: '1,284', 
      icon: FiUsers, 
      change: '+12.5%', 
      iconBg: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      label: 'Active Focals', 
      value: '42', 
      icon: FiUserCheck, 
      change: '+5', 
      iconBg: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/10',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      label: 'Pending Requests', 
      value: '16', 
      icon: FiClock, 
      change: '-3', 
      iconBg: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/10',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    { 
      label: 'Total Branches', 
      value: '8', 
      icon: FiHome, 
      change: '+2', 
      iconBg: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/10',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      label: "Today's Calls", 
      value: '89', 
      icon: FiPhoneCall, 
      change: '+15%', 
      iconBg: 'bg-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/10',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    { 
      label: 'Resolved Issues', 
      value: '234', 
      icon: FiCheckCircle, 
      change: '+28%', 
      iconBg: 'bg-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900/10',
      textColor: 'text-teal-600 dark:text-teal-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <CallCenterSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white ml-14 lg:ml-0">
                Dashboard
              </h1>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <FiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="ml-2 bg-transparent border-none focus:outline-none text-sm text-gray-700 dark:text-gray-300 w-48"
                  />
                </div>

                {/* Notifications */}
                <button className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
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
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-6">
              <h2 className="text-lg text-gray-600 dark:text-gray-400">Welcome back,</h2>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.name || 'Agent'}</h1>
            </div>

            {/* ONLY 6 CARDS - 3x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center">
                      <span className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-400 ml-2">vs last month</span>
                    </div>

                    {/* Simple progress indicator */}
                    <div className="mt-4 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stat.iconBg} rounded-full`}
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CallCenterDashboard;