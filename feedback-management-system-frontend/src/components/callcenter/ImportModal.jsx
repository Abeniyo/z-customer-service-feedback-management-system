import React from 'react';
import { FiX, FiDownload, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const ImportModal = ({ isOpen, onClose, data, onSave, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Import Customers from Excel
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {data.length > 0 ? (
            <>
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FiCheckCircle className="text-green-500" />
                <span>Found {data.length} records to import</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Phone</th>
                      <th className="px-4 py-2 text-left">Branch</th>
                      <th className="px-4 py-2 text-left">Satisfaction</th>
                      <th className="px-4 py-2 text-left">Complaint</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.slice(0, 10).map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">
                          {item.first_name} {item.middle_name} {item.last_name}
                        </td>
                        <td className="px-4 py-2">{item.phone_number}</td>
                        <td className="px-4 py-2">{item.branch || '-'}</td>
                        <td className="px-4 py-2">{item.satisfaction_level}/5</td>
                        <td className="px-4 py-2">
                          {item.has_complaint ? (
                            <span className="text-red-600">Yes</span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {data.length > 10 && (
                      <tr>
                        <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                          ... and {data.length - 10} more records
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No data to import</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading || data.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Importing...
              </>
            ) : (
              <>
                <FiDownload className="w-4 h-4" />
                Import {data.length} Records
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;