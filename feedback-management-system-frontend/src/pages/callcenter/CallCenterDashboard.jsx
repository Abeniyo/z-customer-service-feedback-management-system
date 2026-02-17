import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import CallCenterSidebar from './CallCenterSidebar';

// Import React Icons
import { 
  FiPhoneCall, 
  FiStar, 
  FiCheckCircle, 
  FiClock,
  FiTrendingUp,
  FiUsers,
  FiMessageSquare,
  FiCalendar,
  FiBarChart2,
  FiSun,
  FiMoon,
  FiBell,
  FiSearch,
  FiMenu
} from 'react-icons/fi';

const CallCenterDashboard = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const stats = [
    { 
      label: "Today's Calls", 
      value: '24', 
      icon: FiPhoneCall, 
      change: '+12%', 
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      changeColor: 'text-green-600'
    },
    { 
      label: 'Avg Rating', 
      value: '4.8', 
      icon: FiStar, 
      change: '+0.3', 
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      changeColor: 'text-green-600'
    },
    { 
      label: 'Resolved', 
      value: '18', 
      icon: FiCheckCircle, 
      change: '+5%', 
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      changeColor: 'text-green-600'
    },
    { 
      label: 'Pending', 
      value: '6', 
      icon: FiClock, 
      change: '-2%', 
      color: 'orange',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      changeColor: 'text-red-600'
    }
  ];

  const recentFeedback = [
    { id: 1, customer: 'John Doe', rating: 5, message: 'Excellent service!', time: '5 min ago' },
    { id: 2, customer: 'Jane Smith', rating: 4, message: 'Very helpful', time: '15 min ago' },
    { id: 3, customer: 'Bob Johnson', rating: 5, message: 'Quick resolution', time: '30 min ago' },
  ];

  const upcomingTasks = [
    { id: 1, task: 'Follow up with Client A', priority: 'High', time: '10:30 AM' },
    { id: 2, task: 'Review feedback forms', priority: 'Medium', time: '2:00 PM' },
    { id: 3, task: 'Team meeting', priority: 'Low', time: '4:00 PM' },
  ];

  const quickActions = [
    { 
      path: '/callcenter/new-feedback', 
      label: 'New Feedback', 
      description: 'Record customer feedback',
      icon: FiMessageSquare, 
      color: 'purple',
      borderColor: 'hover:border-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      path: '/callcenter/customers', 
      label: 'View Customers', 
      description: '24 active customers',
      icon: FiUsers, 
      color: 'blue',
      borderColor: 'hover:border-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      path: '/callcenter/my-reports', 
      label: 'View Reports', 
      description: 'Daily performance',
      icon: FiTrendingUp, 
      color: 'green',
      borderColor: 'hover:border-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    }
  ];

  const getPriorityStyles = (priority) => {
    const styles = {
      High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    };
    return styles[priority] || styles.Low;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      {/* Sidebar - Fixed height */}
      <CallCenterSidebar />
      
      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header - Fixed at top */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-14 lg:ml-0">
                Call Center Dashboard
              </h1>

              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <FiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="ml-2 bg-transparent border-none focus:outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 w-48"
                  />
                </div>

                {/* Notification Bell */}
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

                {/* Profile Menu */}
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
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <Link to="/callcenter/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                        Your Profile
                      </Link>
                      <Link to="/callcenter/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
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

        {/* Main Content - Scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Agent'}! 👋</h1>
              <p className="text-purple-100">You have 6 pending tasks and 3 new messages</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, index) => {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Feedback */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Feedback</h2>
                  <Link to="/callcenter/customers" className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentFeedback.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.customer}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">"{item.message}"</p>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.rating}</span>
                        </div>
                        <span className="text-xs text-gray-400">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Tasks</h2>
                  <FiCalendar className="text-gray-400" />
                </div>
                <div className="space-y-4">
                  {upcomingTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{task.task}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${getPriorityStyles(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-4 flex-shrink-0">
                        {task.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CallCenterDashboard;