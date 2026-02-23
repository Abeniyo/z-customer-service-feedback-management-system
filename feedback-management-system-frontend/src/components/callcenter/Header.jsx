import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiBell,
  FiSun,
  FiMoon,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash2,
  FiPlus,
  FiUser
} from 'react-icons/fi';

const Header = ({
  user,
  isDark,
  toggleTheme,
  profileMenuOpen,
  setProfileMenuOpen,
  logout,
  loading,
  success,
  error,
  setError,
  selectedRows,
  onBulkDelete,
  onRefresh,
  onImport,
  onExport,
  onCreate
}) => {
  return (
    <header className="flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 ml-14 lg:ml-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Customer Management
            </h1>
            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-full">
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  {selectedRows.length} selected
                </span>
                <button
                  onClick={onBulkDelete}
                  className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 text-green-600 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full animate-slideIn">
                <FiCheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              title="Refresh"
            >
              <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Import Button */}
            <button
              onClick={onImport}
              className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              title="Import from Excel"
            >
              <FiUpload className="w-5 h-5" />
            </button>

            {/* Export Button */}
            <button
              onClick={onExport}
              className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              title="Export to Excel"
            >
              <FiDownload className="w-5 h-5" />
            </button>

            {/* Add Customer Button */}
            <button
              onClick={onCreate}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-purple-600/30"
            >
              <FiPlus className="w-4 h-4" />
              Add Customer
            </button>

            {/* Notification Bell */}
            <button className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fadeIn">
                  <Link to="/callcenter/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20">
                    Your Profile
                  </Link>
                  <Link to="/callcenter/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20">
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
  );
};

export default Header;