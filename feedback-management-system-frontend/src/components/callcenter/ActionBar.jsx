import React from 'react';
import { 
  FiRefreshCw,
  FiUpload,
  FiDownload,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

const ActionBar = ({
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
    <div className="pt-6 pb-4 px-4 sm:px-6 lg:px-8 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-end gap-4 max-w-7xl mx-auto">
        {/* Right side - Messages and action buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          {/* Messages Container */}
          <div className="flex flex-wrap items-center gap-2 order-2 sm:order-1">
            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 text-green-600 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full animate-slideIn shadow-sm">
                <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-full animate-slideIn shadow-sm">
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">{error}</span>
                <button 
                  onClick={() => setError(null)} 
                  className="ml-1 text-red-600 hover:text-red-700 font-bold text-lg hover:bg-red-200 dark:hover:bg-red-800/50 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}

            {/* Selected Count Badge */}
            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full shadow-sm">
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300 whitespace-nowrap">
                  {selectedRows.length} selected
                </span>
                <button
                  onClick={onBulkDelete}
                  className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                  title="Delete Selected"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-2 order-1 sm:order-2">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="p-2.5 text-gray-600 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md bg-white dark:bg-gray-800"
              title="Refresh Data"
              disabled={loading}
            >
              <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Import Button */}
            <button
              onClick={onImport}
              className="p-2.5 text-gray-600 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md bg-white dark:bg-gray-800"
              title="Import from Excel"
            >
              <FiUpload className="w-5 h-5" />
            </button>

            {/* Export Button */}
            <button
              onClick={onExport}
              className="p-2.5 text-gray-600 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md bg-white dark:bg-gray-800"
              title="Export to Excel"
            >
              <FiDownload className="w-5 h-5" />
            </button>

            {/* Add Customer Button */}
            <button
              onClick={onCreate}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-purple-600/30 ml-1"
              title="Add New Customer"
            >
              <FiPlus className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Add Customer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;