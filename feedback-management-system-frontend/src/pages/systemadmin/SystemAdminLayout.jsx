import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import SystemAdminSidebar from './SystemAdminSidebar';

// Import React Icons
import { 
  FiSun,
  FiMoon,
  FiBell,
  FiSearch,
  FiUser,
  FiChevronDown
} from 'react-icons/fi';

const SystemAdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      <SystemAdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 ml-14 lg:ml-0">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  System Administration
                </h1>
                <span className="hidden sm:inline-block px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs rounded-full">
                  Admin
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <FiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Quick search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                    <FiChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'admin@system.com'}</p>
                      </div>
                      <Link to="/systemadmin/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Your Profile
                      </Link>
                      <Link to="/systemadmin/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button 
                        onClick={logout}
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