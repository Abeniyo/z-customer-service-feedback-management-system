import React from 'react';
import { 
  FiUser,
  FiPhone,
  FiMail,
  FiStar,
  FiClock,
  FiMessageSquare,
  FiAlertCircle,
  FiEye,
  FiEdit,
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus
} from 'react-icons/fi';

const CustomerTable = ({
  customers,
  loading,
  selectedRows,
  onSelectRow,
  onSelectAll,
  sortConfig,
  onSort,
  onView,
  onEdit,
  onDelete,
  onFeedback,
  onComplaint,
  getCustomerFullName
}) => {
  const getStatusStyles = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getRatingColor = (rating) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 4.5) return 'text-yellow-400';
    if (rating >= 3.5) return 'text-yellow-500';
    if (rating >= 2.5) return 'text-orange-500';
    return 'text-red-500';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <FiTrendingUp className="w-3 h-3 text-green-500" />;
    if (trend < 0) return <FiTrendingDown className="w-3 h-3 text-red-500" />;
    return <FiMinus className="w-3 h-3 text-gray-400" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Invalid';
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-700">
              <th className="px-3 py-3 text-left">
                <input
                  type="checkbox"
                  checked={customers.length > 0 && selectedRows.length === customers.length}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </th>
              <th 
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-purple-600 transition-colors"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center gap-1">
                  Customer
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? 
                    <FiChevronUp className="w-3 h-3" /> : 
                    <FiChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                Contact
              </th>
              <th 
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-purple-600 transition-colors"
                onClick={() => onSort('rating')}
              >
                <div className="flex items-center gap-1">
                  Rating
                  {sortConfig.key === 'rating' && (
                    sortConfig.direction === 'asc' ? 
                    <FiChevronUp className="w-3 h-3" /> : 
                    <FiChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-purple-600 transition-colors"
                onClick={() => onSort('calls')}
              >
                <div className="flex items-center gap-1">
                  Calls
                  {sortConfig.key === 'calls' && (
                    sortConfig.direction === 'asc' ? 
                    <FiChevronUp className="w-3 h-3" /> : 
                    <FiChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                Complaints
              </th>
              <th 
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-purple-600 transition-colors"
                onClick={() => onSort('lastContact')}
              >
                <div className="flex items-center gap-1">
                  Last Contact
                  {sortConfig.key === 'lastContact' && (
                    sortConfig.direction === 'asc' ? 
                    <FiChevronUp className="w-3 h-3" /> : 
                    <FiChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-3 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-purple-600 transition-colors"
                onClick={() => onSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortConfig.key === 'status' && (
                    sortConfig.direction === 'asc' ? 
                    <FiChevronUp className="w-3 h-3" /> : 
                    <FiChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {customers.length > 0 ? (
              customers.map(customer => {
                const isSelected = selectedRows.includes(customer.id);
                const fullName = getCustomerFullName(customer);
                
                return (
                  <tr 
                    key={customer.id} 
                    className={`hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-pink-50/30 dark:hover:from-purple-900/5 dark:hover:to-pink-900/5 transition-colors cursor-pointer ${
                      isSelected ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''
                    }`}
                    onClick={() => onView(customer)}
                  >
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow(customer.id)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs">
                          {fullName.charAt(0) || '?'}
                        </div>
                        <div className="truncate max-w-[120px]">
                          <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {fullName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="space-y-0.5">
                        {customer.phone_number && (
                          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <FiPhone className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[100px]">{customer.phone_number}</span>
                          </div>
                        )}
                        {customer.email && (
                          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <FiMail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[100px]">{customer.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <FiStar 
                              key={star}
                              className={`w-3 h-3 ${
                                star <= Math.round(customer.average_rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-xs font-semibold ${getRatingColor(customer.average_rating)}`}>
                          {customer.average_rating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {customer.total_calls || 0}
                        </span>
                        {getTrendIcon(customer.trend)}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <FiAlertCircle className={`w-3 h-3 ${customer.complaints?.length > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {customer.complaints?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <FiClock className="w-3 h-3" />
                        <span>{formatDate(customer.last_contact)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(customer.status)}`}>
                        {customer.status || 'active'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(customer)}
                          className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                          title="View"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(customer)}
                          className="p-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onFeedback(customer)}
                          className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                          title="Add Feedback"
                        >
                          <FiMessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onComplaint(customer)}
                          className="p-1 text-orange-600 hover:text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded transition-colors"
                          title="Add Complaint"
                        >
                          <FiAlertCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(customer)}
                          className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <FiUser className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No customers found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;