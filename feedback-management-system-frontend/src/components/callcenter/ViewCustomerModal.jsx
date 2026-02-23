import React from 'react';
import { 
  FiX, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiStar, 
  FiMessageSquare,
  FiAlertCircle,
  FiCalendar,
  FiEdit,
  FiTrash2,
  FiMapPin,
  FiUserCheck
} from 'react-icons/fi';

const ViewCustomerModal = ({
  isOpen,
  onClose,
  customer,
  getCustomerFullName,
  onEdit,
  onFeedback,
  onComplaint,
  onDelete
}) => {
  if (!isOpen || !customer) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                {getCustomerFullName(customer).charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {getCustomerFullName(customer)}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {customer.gender} • {customer.status || 'active'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FiUser className="w-4 h-4" />
                Contact Information
              </h3>
              {customer.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <FiMail className="w-4 h-4 text-purple-600" />
                  <span>{customer.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <FiPhone className="w-4 h-4 text-purple-600" />
                <span>{customer.phone_number}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FiMapPin className="w-4 h-4" />
                Location & Assignment
              </h3>
              {customer.branch && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <FiMapPin className="w-4 h-4 text-purple-600" />
                  <span>{customer.branch}</span>
                </div>
              )}
              {customer.focal_person && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <FiUserCheck className="w-4 h-4 text-purple-600" />
                  <span>{customer.focal_person}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 text-center text-white">
              <p className="text-2xl font-bold">{customer.total_calls || 0}</p>
              <p className="text-xs opacity-90">Total Calls</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-3 text-center text-white">
              <p className="text-2xl font-bold">{customer.average_rating?.toFixed(1) || 'N/A'}</p>
              <p className="text-xs opacity-90">Avg Rating</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <FiMessageSquare className="w-4 h-4" />
              Recent Feedback
            </h3>
            {customer.feedbacks?.length > 0 ? (
              <div className="space-y-2">
                {customer.feedbacks.slice(0, 2).map(feedback => (
                  <div key={feedback.id} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FiStar
                            key={star}
                            className={`w-3 h-3 ${
                              star <= feedback.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(feedback.created_at)}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{feedback.comments}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">No feedback yet</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4" />
              Recent Complaints
            </h3>
            {customer.complaints?.length > 0 ? (
              <div className="space-y-2">
                {customer.complaints.slice(0, 2).map(complaint => (
                  <div key={complaint.id} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-orange-600">{complaint.category}</span>
                      <span className="text-xs text-gray-500">{formatDate(complaint.complaint_date)}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{complaint.description}</p>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">No complaints</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onFeedback}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 text-sm flex items-center gap-1"
            >
              <FiMessageSquare className="w-4 h-4" />
              Feedback
            </button>
            <button
              onClick={onComplaint}
              className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300 text-sm flex items-center gap-1"
            >
              <FiAlertCircle className="w-4 h-4" />
              Complaint
            </button>
            <button
              onClick={onEdit}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 text-sm flex items-center gap-1"
            >
              <FiEdit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 text-sm flex items-center gap-1"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerModal;