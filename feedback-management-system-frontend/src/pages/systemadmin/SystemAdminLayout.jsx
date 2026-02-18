import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import logo from '../../assets/images/logo.png';

// Import React Icons
import { 
  FiHome, 
  FiUsers, 
  FiBarChart2, 
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
  FiChevronLeft,
  FiSun,
  FiMoon,
  FiBell,
  FiSearch
} from 'react-icons/fi';

const SystemAdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/systemadmin', label: 'Dashboard', icon: FiHome },
    { path: '/systemadmin/users', label: 'User Management', icon: FiUsers },
    { path: '/systemadmin/audit-logs', label: 'Audit Logs', icon: FiBarChart2 },
    { path: '/systemadmin/settings', label: 'System Settings', icon: FiSettings },
  ];

  const isActive = (path) => {
    if (path === '/systemadmin') {
      return location.pathname === '/systemadmin' || location.pathname === '/systemadmin/dashboard';
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="flex-shrink-0 px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex justify-center">
            <img src={logo} alt="FeedbackFlow" className="h-16 w-auto object-contain" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-center"
            >
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                System Admin
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 mt-1 inline-block">
                Root Access
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`
                relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} 
                px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${active 
                  ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10'
                }
              `}
            >
              {active && (
                <motion.div
                  layoutId="activeSystemAdminTab"
                  className="absolute inset-0 rounded-xl bg-red-50 dark:bg-red-900/20"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              
              <div className="relative z-10">
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 
                                ${active ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`} />
              </div>
              
              {!isCollapsed && (
                <span className="flex-1 relative z-10 text-sm font-medium">{item.label}</span>
              )}
              
              {isCollapsed && active && (
                <div className="absolute right-0 w-1 h-5 bg-red-600 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="flex-shrink-0 px-3 py-4 border-t border-gray-100 dark:border-gray-700/50">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} 
            px-3 py-2 rounded-lg transition-all duration-200
            text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 
            hover:bg-red-50 dark:hover:bg-red-900/10 group
          `}
        >
          <FiLogOut className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>

        {!isCollapsed && (
          <div className="mt-4 px-3">
            <p className="text-xs text-gray-400 dark:text-gray-500">Version 2.0.0</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">System Admin Console</p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-gray-800 
                   rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
                   hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        flex flex-col h-screen shadow-lg lg:shadow-none
      `}>
        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 
                     z-10 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 
                     dark:border-gray-700 rounded-full items-center justify-center
                     shadow-md hover:shadow-lg transition-shadow"
        >
          {isCollapsed ? (
            <FiChevronRight className="w-3 h-3 text-gray-600 dark:text-gray-300" />
          ) : (
            <FiChevronLeft className="w-3 h-3 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-14 lg:ml-0">
                System Administration
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
                <button className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || 'S'}
                    </div>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <Link to="/systemadmin/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Your Profile
                      </Link>
                      <Link to="/systemadmin/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20">
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemAdminLayout;