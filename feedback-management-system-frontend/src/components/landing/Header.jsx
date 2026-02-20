import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, 
  FiUser, 
  FiLogOut, 
  FiSettings,
  FiChevronDown,
  FiSearch,
  FiMenu
} from 'react-icons/fi';
import logo from '../../assets/images/logo.png';

const Header = ({ toggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigationLinks = [
    { name: 'Dashboard', path: '/callcenter' },
    { name: 'Customers', path: '/callcenter/customers' },
    { name: 'Feedbacks', path: '/callcenter/feedbacks' },
    { name: 'Complaints', path: '/callcenter/complaints' },
    { name: 'Actions', path: '/callcenter/actions' },
    { name: 'Reports', path: '/callcenter/reports' },
  ];

  const notifications = [
    { id: 1, message: 'New complaint assigned to you', time: '5 min ago', type: 'warning' },
    { id: 2, message: 'Feedback pending review', time: '15 min ago', type: 'info' },
    { id: 3, message: 'Action item overdue', time: '1 hour ago', type: 'error' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and mobile menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            <Link to="/callcenter" className="flex items-center gap-2">
              <img src={logo} alt="FeedbackFlow" className="h-8 w-auto" />
             
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 
                         hover:text-purple-600 dark:hover:text-purple-400 
                         hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg
                         transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right section - Search, Notifications, Profile */}
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
              <FiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none text-sm px-2 w-48
                         text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              >
                <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 
                             rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
                             overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 
                                   border-b border-gray-100 dark:border-gray-700 last:border-0"
                        >
                          <p className="text-sm text-gray-800 dark:text-gray-200">{notif.message}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 
                         dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full 
                              flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name || 'John Doe'}
                </span>
                <FiChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                             rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
                             overflow-hidden z-50"
                  >
                    <Link
                      to="/callcenter/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 
                               dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiUser className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/callcenter/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 
                               dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiSettings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm 
                               text-red-600 dark:text-red-400 hover:bg-red-50 
                               dark:hover:bg-red-900/20"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;