import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import CallCenterSidebar from './CallCenterSidebar';
import api from '../../services/api';

// Import React Icons
import { 
  FiUser, 
  FiPhone, 
  FiStar, 
  FiMessageSquare, 
  FiCheckCircle,
  FiClock,
  FiSend,
  FiRefreshCw,
  FiSun,
  FiMoon,
  FiBell,
  FiMenu,
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiUserCheck,
  FiClipboard,
  FiAlertTriangle,
  FiEdit3,
  FiTrash2,
  FiSave,
  FiX,
  FiUsers,
  FiLoader
} from 'react-icons/fi';

const NewFeedback = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [callCenterUsers, setCallCenterUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial form data matching API structure
  const initialFormData = {
    satisfaction_level: 5,
    feedback_date: new Date().toISOString().split('T')[0],
    is_deleted: false,
    call_interaction: null,
    customer: null,
    call_center: null,
    // Additional fields for UI (not sent to API)
    customerName: '',
    phoneNumber: '',
    callStatus: 'pending',
    branchName: '',
    focalName: '',
    receiptGiven: 'no',
    complaint: 'no',
    complaintDescription: '',
    actionTaken: '',
    callDuration: '',
    callType: 'inbound',
    agentNotes: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch customers and call center users on mount
  useEffect(() => {
    fetchCustomers();
    fetchCallCenterUsers();
    fetchFeedbacks();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers/?limit=100');
      const customerData = response.data.results || response.data || [];
      setCustomers(Array.isArray(customerData) ? customerData : []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setCustomers([]);
    }
  };

  const fetchCallCenterUsers = async () => {
    try {
      const response = await api.get('/users/?role=CALL_CENTER&limit=100');
      const userData = response.data.results || response.data || [];
      setCallCenterUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error('Error fetching call center users:', err);
      setCallCenterUsers([]);
    }
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/feedbacks/feedbacks/?limit=10');
      console.log('Feedbacks response:', response.data);
      
      // Handle paginated response
      const feedbackData = response.data.results || response.data || [];
      setFeedbacks(Array.isArray(feedbackData) ? feedbackData : []);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedbacks');
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const callStatusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'missed', label: 'Missed', color: 'red' },
    { value: 'escalated', label: 'Escalated', color: 'orange' }
  ];

  const callTypeOptions = [
    { value: 'inbound', label: 'Inbound' },
    { value: 'outbound', label: 'Outbound' },
    { value: 'transfer', label: 'Transfer' }
  ];

  const receiptOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  const branchOptions = [
    'Main Branch',
    'Downtown',
    'Northside',
    'Southside',
    'Eastside',
    'Westside'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.branchName.trim()) {
      newErrors.branchName = 'Branch name is required';
    }
    
    if (!formData.focalName.trim()) {
      newErrors.focalName = 'Focal name is required';
    }
    
    if (formData.complaint === 'yes' && !formData.complaintDescription.trim()) {
      newErrors.complaintDescription = 'Please provide complaint description';
    }

    // API required fields
    if (!formData.customer) {
      newErrors.customer = 'Please select a customer';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? value : value
    }));
    
    if (name === 'complaint' && value === 'no') {
      setFormData(prev => ({
        ...prev,
        complaintDescription: ''
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const selectedCustomer = customers.find(c => c.id === parseInt(customerId));
    
    setFormData(prev => ({
      ...prev,
      customer: customerId,
      customerName: selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` : '',
      phoneNumber: selectedCustomer?.phone_number || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare data for API
      const feedbackData = {
        satisfaction_level: formData.satisfaction_level,
        feedback_date: formData.feedback_date,
        is_deleted: false,
        call_interaction: null, // You'll need to create this if required
        customer: parseInt(formData.customer),
        call_center: user?.id || null // Assuming current user is the call center agent
      };

      let response;
      if (editMode && selectedFeedbackId) {
        // PATCH /api/v1/feedbacks/feedbacks/{id}/
        response = await api.patch(`/feedbacks/feedbacks/${selectedFeedbackId}/`, feedbackData);
        console.log('Feedback updated:', response.data);
      } else {
        // POST /api/v1/feedbacks/feedbacks/
        response = await api.post('/feedbacks/feedbacks/', feedbackData);
        console.log('Feedback created:', response.data);
      }
      
      setSubmitted(true);
      fetchFeedbacks(); // Refresh the list
      
      setTimeout(() => {
        setSubmitted(false);
        setEditMode(false);
        setSelectedFeedbackId(null);
        setFormData(initialFormData);
        setErrors({});
      }, 3000);
      
    } catch (err) {
      console.error('Error saving feedback:', err);
      setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to save feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (feedback) => {
    setEditMode(true);
    setSelectedFeedbackId(feedback.id);
    
    // Find customer name
    const customer = customers.find(c => c.id === feedback.customer);
    
    setFormData({
      ...initialFormData,
      satisfaction_level: feedback.satisfaction_level || 5,
      feedback_date: feedback.feedback_date || new Date().toISOString().split('T')[0],
      customer: feedback.customer,
      customerName: customer ? `${customer.first_name} ${customer.last_name}` : '',
      phoneNumber: customer?.phone_number || '',
      call_center: feedback.call_center,
      // Map any additional fields you have stored
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (feedback) => {
    setFeedbackToDelete(feedback);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!feedbackToDelete) return;
    
    setIsSubmitting(true);
    try {
      await api.delete(`/feedbacks/feedbacks/${feedbackToDelete.id}/`);
      setShowDeleteModal(false);
      setFeedbackToDelete(null);
      fetchFeedbacks(); // Refresh the list
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError('Failed to delete feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the form?')) {
      setFormData(initialFormData);
      setEditMode(false);
      setSelectedFeedbackId(null);
      setErrors({});
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
      'completed': 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
      'missed': 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
      'escalated': 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20'
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
        <CallCenterSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8 text-center animate-fadeIn">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <FiCheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {editMode ? 'Feedback Updated Successfully!' : 'Feedback Submitted Successfully!'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {editMode ? 'The feedback has been updated in the system.' : 'Thank you for recording the customer feedback.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold 
                           hover:bg-purple-700 transition-all duration-300 hover:scale-105 
                           shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
                >
                  <FiSend className="w-5 h-5" />
                  {editMode ? 'Update Another' : 'Add Another'}
                </button>
                <button 
                  onClick={() => navigate('/callcenter')}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                           rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 
                           transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      <CallCenterSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-14 lg:ml-0">
                {editMode ? 'Edit Feedback' : 'New Feedback'}
              </h1>

              <div className="flex items-center gap-3">
                {/* Error Display */}
                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full">
                    <FiAlertTriangle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Refresh Button */}
                <button 
                  onClick={fetchFeedbacks}
                  className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>

                {/* Notification Bell */}
                <button className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <Link to="/callcenter/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                        Your Profile
                      </Link>
                      <Link to="/callcenter/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button 
                        onClick={handleLogout}
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Recent Feedbacks List */}
            {feedbacks.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Recent Feedbacks</h3>
                  <span className="text-sm text-gray-500">{feedbacks.length} total</span>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="p-8 text-center">
                      <FiLoader className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
                      <p className="mt-2 text-sm text-gray-500">Loading...</p>
                    </div>
                  ) : (
                    feedbacks.map(feedback => {
                      const customer = customers.find(c => c.id === feedback.customer);
                      return (
                        <div key={feedback.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown Customer'}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                                  Satisfaction: {feedback.satisfaction_level}/5
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <FiCalendar className="w-3 h-3" /> {formatDate(feedback.feedback_date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiStar className="w-3 h-3 text-yellow-400" /> {feedback.satisfaction_level}/5
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => handleEdit(feedback)}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <FiEdit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(feedback)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {editMode ? 'Editing Feedback' : 'New Feedback Form'}
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

            {/* Form Container */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Selection (API required) */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <FiUsers className="text-purple-600" />
                    Select Customer <span className="text-red-500">*</span>
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Customer
                    </label>
                    <select
                      name="customer"
                      value={formData.customer || ''}
                      onChange={handleCustomerChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-300
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               ${errors.customer ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    >
                      <option value="">Select a customer</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.first_name} {customer.last_name} - {customer.phone_number}
                        </option>
                      ))}
                    </select>
                    {errors.customer && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.customer}</p>
                    )}
                  </div>
                </div>

                {/* Call Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <FiClock className="text-purple-600" />
                    Call Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date of Call */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Feedback Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                        <input
                          type="date"
                          name="feedback_date"
                          value={formData.feedback_date}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Satisfaction Level */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Satisfaction Level (1-5) <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(num => (
                          <label key={num} className="cursor-pointer">
                            <input
                              type="radio"
                              name="satisfaction_level"
                              value={num}
                              checked={formData.satisfaction_level === num}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            <FiStar 
                              className={`w-8 h-8 transition-all duration-300 hover:scale-110 ${
                                formData.satisfaction_level >= num 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Call Status (UI only) */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Call Status
                      </label>
                      <select
                        name="callStatus"
                        value={formData.callStatus}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {callStatusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Call Type (UI only) */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Call Type
                      </label>
                      <select
                        name="callType"
                        value={formData.callType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {callTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Customer Information Section (UI only) */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <FiUser className="text-purple-600" />
                    Customer Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Customer Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Enter customer name"
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-300
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 placeholder-gray-400 dark:placeholder-gray-500
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                 ${errors.customerName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                      />
                      {errors.customerName && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.customerName}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+1 234-567-8901"
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-300
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 placeholder-gray-400 dark:placeholder-gray-500
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Branch & Focal Information (UI only) */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <FiMapPin className="text-purple-600" />
                    Branch & Focal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Branch Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Branch Name <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="branchName"
                        value={formData.branchName}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-300
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                 ${errors.branchName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                      >
                        <option value="">Select Branch</option>
                        {branchOptions.map(branch => (
                          <option key={branch} value={branch}>{branch}</option>
                        ))}
                      </select>
                      {errors.branchName && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.branchName}</p>
                      )}
                    </div>

                    {/* Focal Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Focal Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="focalName"
                        value={formData.focalName}
                        onChange={handleChange}
                        placeholder="Enter focal person name"
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-300
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 placeholder-gray-400 dark:placeholder-gray-500
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                 ${errors.focalName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                      />
                      {errors.focalName && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.focalName}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional UI Fields */}
                <div className="space-y-4">
                  {/* Receipt Given */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Receipt Given?
                    </label>
                    <div className="flex gap-4">
                      {receiptOptions.map(option => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="receiptGiven"
                            value={option.value}
                            checked={formData.receiptGiven === option.value}
                            onChange={handleChange}
                            className="w-4 h-4 text-purple-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Complaint */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Is there a complaint?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="complaint"
                          value="yes"
                          checked={formData.complaint === 'yes'}
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="complaint"
                          value="no"
                          checked={formData.complaint === 'no'}
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Complaint Description */}
                  {formData.complaint === 'yes' && (
                    <div className="space-y-2 animate-fadeIn">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Complaint Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="complaintDescription"
                        value={formData.complaintDescription}
                        onChange={handleChange}
                        placeholder="Describe the complaint in detail..."
                        rows="3"
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-300
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 placeholder-gray-400 dark:placeholder-gray-500
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                 resize-none ${errors.complaintDescription ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                      />
                      {errors.complaintDescription && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.complaintDescription}</p>
                      )}
                    </div>
                  )}

                  {/* Action Taken */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Action Taken
                    </label>
                    <textarea
                      name="actionTaken"
                      value={formData.actionTaken}
                      onChange={handleChange}
                      placeholder="Describe the action taken..."
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               placeholder-gray-400 dark:placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Call Duration */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Call Duration
                    </label>
                    <input
                      type="text"
                      name="callDuration"
                      value={formData.callDuration}
                      onChange={handleChange}
                      placeholder="e.g., 5:30"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               placeholder-gray-400 dark:placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Agent Notes */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Agent Notes
                    </label>
                    <textarea
                      name="agentNotes"
                      value={formData.agentNotes}
                      onChange={handleChange}
                      placeholder="Additional notes about the call..."
                      rows="2"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               placeholder-gray-400 dark:placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                        <FiLoader className="w-5 h-5 animate-spin" />
                        {editMode ? 'Updating...' : 'Submitting...'}
                      </>
                    ) : (
                      <>
                        {editMode ? <FiSave className="w-5 h-5" /> : <FiSend className="w-5 h-5" />}
                        {editMode ? 'Update Feedback' : 'Submit Feedback'}
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
                    {editMode ? 'Cancel Edit' : 'Clear Form'}
                  </button>
                </div>

                {/* Required Fields Note */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
                  <p>Fields marked with <span className="text-red-500">*</span> are required</p>
                  <p className="text-xs mt-1">Customer satisfaction and feedback date are sent to the API</p>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && feedbackToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <FiAlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Feedback</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this feedback?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setFeedbackToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewFeedback;