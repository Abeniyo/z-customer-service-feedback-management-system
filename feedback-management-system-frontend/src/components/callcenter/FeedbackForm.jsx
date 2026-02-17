import React, { useState } from 'react';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiStar, 
  FiMessageSquare, 
  FiCheckCircle,
  FiClock,
  FiSend,
  FiRefreshCw,
  FiHelpCircle,
  FiTool,
  FiDollarSign,
  FiInfo,
  FiAlertCircle,
  FiThumbsUp,
  FiArrowLeft
} from 'react-icons/fi';

const FeedbackForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    category: 'General Inquiry',
    rating: 5,
    message: '',
    status: 'pending'
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { id: 'general', label: 'General Inquiry', icon: FiHelpCircle, color: 'purple' },
    { id: 'technical', label: 'Technical Support', icon: FiTool, color: 'blue' },
    { id: 'billing', label: 'Billing Inquiry', icon: FiDollarSign, color: 'green' },
    { id: 'product', label: 'Product Information', icon: FiInfo, color: 'yellow' },
    { id: 'complaint', label: 'Complaint', icon: FiAlertCircle, color: 'red' },
    { id: 'feedback', label: 'Feedback', icon: FiThumbsUp, color: 'orange' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'in-progress', label: 'In Progress', color: 'blue' },
    { value: 'resolved', label: 'Resolved', color: 'green' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^[\d\s\+\-\(\)]{10,}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Please enter a valid phone number';
    }
    
    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Feedback message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Feedback submitted:', formData);
      setSubmitted(true);
      
      // Auto reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          category: 'General Inquiry',
          rating: 5,
          message: '',
          status: 'pending'
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the form?')) {
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        category: 'General Inquiry',
        rating: 5,
        message: '',
        status: 'pending'
      });
      setErrors({});
    }
  };

  // Get category icon
  const getCategoryIcon = (categoryLabel) => {
    const category = categories.find(c => c.label === categoryLabel);
    const Icon = category?.icon || FiHelpCircle;
    return <Icon className="w-4 h-4" />;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
      'in-progress': 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
      'resolved': 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
    };
    return colors[status] || colors.pending;
  };

  if (submitted) {
    return (
      <div className="text-center py-12 px-4 animate-fadeIn">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <FiCheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Feedback Submitted Successfully!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Thank you for recording the customer feedback. The customer has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setSubmitted(false)} 
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold 
                     hover:bg-purple-700 transition-all duration-300 hover:scale-105 
                     shadow-lg hover:shadow-purple-500/25 flex items-center gap-2 justify-center"
          >
            <FiSend className="w-5 h-5" />
            Add Another Feedback
          </button>
          <button 
            onClick={() => window.print()} 
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                     rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 
                     transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <FiCheckCircle className="w-5 h-5" />
            View Receipt
          </button>
          {onBack && (
            <button 
              onClick={onBack}
              className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                       border border-gray-300 dark:border-gray-600 rounded-lg font-semibold 
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 
                       flex items-center gap-2 justify-center"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <FiMessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Record Customer Feedback
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Enter the details of the customer interaction
            </p>
          </div>
        </div>
        
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 
                     dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 
                     rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Step 1 of 1
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Complete all required fields
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiUser className="text-purple-600" />
            Customer Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <FiUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                  errors.customerName ? 'text-red-500' : 'text-gray-400 group-focus-within:text-purple-500'
                }`} />
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           ${errors.customerName 
                             ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                             : 'border-gray-300 dark:border-gray-600'
                           }`}
                />
              </div>
              {errors.customerName && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1 animate-fadeIn">
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* Customer Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Email
              </label>
              <div className="relative group">
                <FiMail className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                  errors.customerEmail ? 'text-red-500' : 'text-gray-400 group-focus-within:text-purple-500'
                }`} />
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="customer@email.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           ${errors.customerEmail 
                             ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                             : 'border-gray-300 dark:border-gray-600'
                           }`}
                />
              </div>
              {errors.customerEmail && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1 animate-fadeIn">
                  {errors.customerEmail}
                </p>
              )}
            </div>

            {/* Customer Phone */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <FiPhone className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                  errors.customerPhone ? 'text-red-500' : 'text-gray-400 group-focus-within:text-purple-500'
                }`} />
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="+1 234-567-8901"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           ${errors.customerPhone 
                             ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                             : 'border-gray-300 dark:border-gray-600'
                           }`}
                />
              </div>
              {errors.customerPhone && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1 animate-fadeIn">
                  {errors.customerPhone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiStar className="text-purple-600" />
            Feedback Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-300 appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.label}>{cat.label}</option>
                ))}
              </select>
              
              {/* Category Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {categories.slice(0, 3).map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.label }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300
                              flex items-center gap-1.5 border hover:scale-105 ${
                      formData.category === cat.label
                        ? `bg-${cat.color}-100 text-${cat.color}-700 border-${cat.color}-300 
                           dark:bg-${cat.color}-900/30 dark:text-${cat.color}-400 dark:border-${cat.color}-800`
                        : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <cat.icon className="w-3 h-3" />
                    {cat.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rating (1-5)
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {[1, 2, 3, 4, 5].map(num => (
                  <label key={num} className="cursor-pointer flex-1">
                    <input
                      type="radio"
                      name="rating"
                      value={num}
                      checked={formData.rating === num}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className={`text-center py-2 rounded-lg transition-all duration-300
                                  ${formData.rating === num 
                                    ? 'bg-purple-600 text-white scale-105 shadow-md' 
                                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:scale-105'
                                  }`}>
                      {num}
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <FiStar 
                    key={num}
                    className={`w-5 h-5 transition-all duration-300 ${
                      formData.rating >= num 
                        ? 'text-yellow-400 fill-current scale-110' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2 font-medium">
                  {formData.rating} out of 5
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <FiClock className={`w-5 h-5 ${getStatusColor(formData.status).split(' ')[0]}`} />
                  <span className={`text-sm px-3 py-1.5 rounded-full ${getStatusColor(formData.status)}`}>
                    {statusOptions.find(o => o.value === formData.status)?.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiMessageSquare className="text-purple-600" />
            Feedback Message
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe the customer's feedback or issue in detail..."
              required
              rows="6"
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-300
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       resize-none ${errors.message 
                         ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                         : 'border-gray-300 dark:border-gray-600'
                       }`}
            />
            {errors.message && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1 animate-fadeIn">
                {errors.message}
              </p>
            )}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Minimum 10 characters</span>
              <span className={formData.message.length < 10 ? 'text-red-500' : 'text-green-500'}>
                {formData.message.length} / 500
              </span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 
                     text-white rounded-lg font-semibold
                     hover:from-purple-700 hover:to-purple-800 transform hover:-translate-y-0.5
                     transition-all duration-300 disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:hover:translate-y-0
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                     dark:focus:ring-offset-gray-800 flex items-center justify-center gap-2
                     shadow-lg hover:shadow-purple-500/25"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FiSend className="w-5 h-5" />
                Submit Feedback
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                     rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600
                     transition-all duration-300 disabled:opacity-50 
                     flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600
                     hover:scale-105 transform"
          >
            <FiRefreshCw className="w-5 h-5" />
            Clear Form
          </button>
        </div>

        {/* Form Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p>All fields marked with <span className="text-red-500">*</span> are required</p>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;