import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import logo from '../../assets/images/logo.png';

// Import React Icons
import { 
  FiHome, 
  FiEdit, 
  FiUsers, 
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX,
  FiSettings,
  FiHelpCircle,
  FiChevronRight,
  FiChevronLeft
} from 'react-icons/fi';

const CallCenterSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { path: '/callcenter', label: 'Dashboard', icon: FiHome },
    { path: '/callcenter/new-feedback', label: 'New Feedback', icon: FiEdit },
    { path: '/callcenter/customers', label: 'Customers', icon: FiUsers },
    { path: '/callcenter/my-reports', label: 'My Reports', icon: FiBarChart2 },
  ];

  const bottomMenuItems = [
    { path: '/callcenter/settings', label: 'Settings', icon: FiSettings },
    { path: '/callcenter/help', label: 'Help & Support', icon: FiHelpCircle },
  ];

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => location.pathname === path;

  // Sidebar content with ChatGPT/DeepSeek style
  const SidebarContent = () => (
    <>
    {/* Logo Section - Clean and Centered */}
    <div className="flex-shrink-0 px-4 py-8">
    <div className="flex flex-col items-center justify-center">
        
        {/* Bigger Logo */}
        <div className="relative flex justify-center">
        <img 
            src={logo} 
            alt="FeedbackFlow" 
            className="h-16 w-auto object-contain" 
        />
        </div>

        {!isCollapsed && (
        <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-center"
        >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Call Center
            </p>
        </motion.div>
        )}

    </div>
    </div>



      {/* Navigation Menu - Clean with better spacing */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                setMobileOpen(false);
                setShowUserMenu(false);
              }}
              className={`
                relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} 
                px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${active 
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
                }
              `}
            >
              {active && (
                <motion.div
                  layoutId="activeCallCenterTab"
                  className="absolute inset-0 rounded-xl bg-purple-50 dark:bg-purple-900/20"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              
              <div className="relative z-10">
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 
                                ${active ? 'text-purple-600' : 'text-gray-500 dark:text-gray-400'}`} />
              </div>
              
              {!isCollapsed && (
                <span className="flex-1 relative z-10 text-sm font-medium">{item.label}</span>
              )}
              
              {/* Active indicator dot for collapsed mode */}
              {isCollapsed && active && (
                <div className="absolute right-0 w-1 h-5 bg-purple-600 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Settings, Help, and Logout integrated */}
      <div className="flex-shrink-0 px-3 py-4 border-t border-gray-100 dark:border-gray-700/50">
        {/* Settings and Help */}
        <div className="space-y-1 mb-3">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} 
                  px-3 py-2 rounded-lg transition-all duration-200
                  text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 
                  hover:bg-purple-50/50 dark:hover:bg-purple-900/10
                `}
              >
                <Icon className="w-4 h-4" />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Logout Button - Styled like ChatGPT */}
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

        {/* Version info - subtle */}
        {!isCollapsed && (
          <div className="mt-4 px-3">
            <p className="text-xs text-gray-400 dark:text-gray-500">Version 2.0.0</p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-gray-800 
                   rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
                   hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
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

      {/* Sidebar - Fixed position on desktop */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        flex flex-col h-screen shadow-lg lg:shadow-none
      `}>
        {/* Desktop Collapse Toggle - Moved to bottom for cleaner look */}
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
    </>
  );
};

export default CallCenterSidebar;