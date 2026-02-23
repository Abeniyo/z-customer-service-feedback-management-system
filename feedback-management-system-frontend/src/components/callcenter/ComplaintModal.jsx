import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiAlertCircle, FiSend } from 'react-icons/fi';
import api from '../../services/api';

const ComplaintModal = ({ isOpen, onClose, customer, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer: customer?.id || '',
    complaint_date: new Date().toISOString().split('T')[0],
    description: '',
    priority: 'medium',
    status: 'pending',
    resolution: '',
    resolved_date: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  // Reset form when customer changes
  useEffect(() => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customer: customer.id
      }));
    }
  }, [customer]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !customer) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      setError('Complaint description is required');
      return false;
    }
    if (!formData.complaint_date) {
      setError('Complaint date is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);

    try {
      const payload = {
        customer: customer.id,
        complaint_date: formData.complaint_date,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        resolution: formData.resolution || undefined,
        resolved_date: formData.resolved_date || undefined
      };

      await api.post('/complaints/complaints/', payload);
      onSuccess();
      
      // Reset form
      setFormData({
        customer: customer?.id || '',
        complaint_date: new Date().toISOString().split('T')[0],
        description: '',
        priority: 'medium',
        status: 'pending',
        resolution: '',
        resolved_date: ''
      });
    } catch (err) {
      console.error('Error adding complaint:', err);
      
      // Handle different error formats
      const errorMessage = 
        err.response?.data?.detail || 
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message ||
        'Failed to add complaint';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const priorities = [
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'urgent', label: 'Urgent', color: 'red' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full my-8 animate-fadeIn"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Register Complaint
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Customer Info */}
          <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="text-orange-600 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {customer.first_name} {customer.middle_name} {customer.last_name}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-orange-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {priorities.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-orange-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Complaint Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="complaint_date"
                  value={formData.complaint_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-orange-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resolution Date
                </label>
                <input
                  type="date"
                  name="resolved_date"
                  value={formData.resolved_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-orange-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || formData.status !== 'resolved'}
                />
                {formData.status === 'resolved' && !formData.resolved_date && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    Please add resolution date
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Complaint Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Describe the complaint in detail..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                         focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.description.length} characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resolution (if any)
              </label>
              <textarea
                name="resolution"
                value={formData.resolution}
                onChange={handleChange}
                rows="2"
                placeholder="Describe how this was resolved..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                         focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 text-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    Register Complaint
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;