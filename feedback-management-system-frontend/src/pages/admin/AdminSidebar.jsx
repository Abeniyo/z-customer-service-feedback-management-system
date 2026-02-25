import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/images/logo.png';

// Import React Icons
import { 
  FiHome, 
  FiUsers, 
  FiBarChart2, 
  FiShield,
  FiDatabase,
  FiActivity,
  FiLogOut,
  FiSettings,
  FiHelpCircle,
  FiChevronRight,
  FiChevronLeft,
  FiServer,
  FiAlertCircle
} from 'react-icons/fi';

const AdminSidebar = ({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen, handleLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/systemadmin', label: 'Dashboard', icon: FiHome },
    { path: '/systemadmin/users', label: 'Users', icon: FiUsers },
    { path: '/systemadmin/companies', label: 'Companies', icon: FiServer },
    { path: '/systemadmin/branches', label: 'Branches', icon: FiActivity },

  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
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

      {/* Sidebar Content */}
      <div className="flex flex-col h-full">
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
                  Admin
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Admin</p>
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
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">© 2026 FeedbackFlow</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;