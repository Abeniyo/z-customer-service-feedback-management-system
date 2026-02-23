import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiSend, FiUser } from 'react-icons/fi';
import api from '../../services/api';

const FeedbackModal = ({ isOpen, onClose, customer, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer: customer?.id || '',
    feedback_date: new Date().toISOString().split('T')[0],
    comments: '',
    call_reference: ''
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
    if (!formData.comments.trim()) {
      setError('Comments are required');
      return false;
    }
    if (!formData.feedback_date) {
      setError('Feedback date is required');
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
        feedback_date: formData.feedback_date,
        comments: formData.comments,
        call_reference: formData.call_reference || undefined
      };

      await api.post('/feedbacks/feedbacks/', payload);
      onSuccess();
      
      // Reset form
      setFormData({
        customer: customer?.id || '',
        feedback_date: new Date().toISOString().split('T')[0],
        comments: '',
        call_reference: ''
      });
    } catch (err) {
      console.error('Error adding feedback:', err);
      
      // Handle different error formats
      const errorMessage = 
        err.response?.data?.detail || 
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message ||
        'Failed to add feedback';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full my-8 animate-fadeIn"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Add Feedback
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
          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center gap-2">
            <FiUser className="text-purple-600 flex-shrink-0" />
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
            {/* Feedback Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Feedback Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="feedback_date"
                value={formData.feedback_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
            </div>

            {/* Call Reference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Call Reference
              </label>
              <input
                type="text"
                name="call_reference"
                value={formData.call_reference}
                onChange={handleChange}
                placeholder="e.g., CALL-12345"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comments <span className="text-red-500">*</span>
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows="4"
                placeholder="Enter feedback comments..."
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.comments.length} characters
              </p>
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
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    Submit Feedback
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

export default FeedbackModal;