import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import CallCenterSidebar from './CallCenterSidebar';

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
  FiX
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Initial form data matching Excel structure
  const initialFormData = {
    dateOfCall: new Date().toISOString().split('T')[0],
    customerName: '',
    phoneNumber: '',
    callStatus: 'pending',
    branchName: '',
    focalName: '',
    receiptGiven: 'no',
    customerSatisfaction: 5,
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

  // Mock data - Replace with actual API calls
  useEffect(() => {
    // Load existing feedbacks from API
    const loadFeedbacks = async () => {
      // Simulate API call
      const mockFeedbacks = [
        {
          id: 1,
          dateOfCall: '2026-02-18',
          customerName: 'Abenezer Abraham',
          phoneNumber: '+1 234-567-8901',
          callStatus: 'completed',
          branchName: 'Main Branch',
          focalName: 'Jane Smith',
          receiptGiven: 'yes',
          customerSatisfaction: 5,
          complaint: 'no',
          complaintDescription: '',
          actionTaken: 'Resolved immediately',
          callDuration: '5:30',
          callType: 'inbound',
          agentNotes: 'Customer was very satisfied'
        },
        {
          id: 2,
          dateOfCall: '2026-02-17',
          customerName: 'Jerry Jerry',
          phoneNumber: '+1 234-567-8902',
          callStatus: 'pending',
          branchName: 'Downtown',
          focalName: 'Mike Johnson',
          receiptGiven: 'no',
          customerSatisfaction: 3,
          complaint: 'yes',
          complaintDescription: 'Long wait time',
          actionTaken: 'Escalated to manager',
          callDuration: '8:15',
          callType: 'inbound',
          agentNotes: 'Customer was frustrated'
        }
      ];
      setFeedbacks(mockFeedbacks);
    };
    loadFeedbacks();
  }, []);

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
    } else if (!/^[\d\s\+\-\(\)]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Handle radio buttons and selects
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? value : value
    }));
    
    // Special handling for complaint field
    if (name === 'complaint' && value === 'no') {
      setFormData(prev => ({
        ...prev,
        complaintDescription: ''
      }));
    }
    
    // Clear error for this field
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
      
      const feedbackData = {
        id: editMode ? selectedFeedbackId : Date.now(),
        ...formData,
        dateOfCall: formData.dateOfCall || new Date().toISOString().split('T')[0]
      };

      if (editMode) {
        // Update existing feedback
        setFeedbacks(prev => prev.map(f => 
          f.id === selectedFeedbackId ? feedbackData : f
        ));
        console.log('Feedback updated:', feedbackData);
      } else {
        // Add new feedback
        setFeedbacks(prev => [feedbackData, ...prev]);
        console.log('Feedback submitted:', feedbackData);
      }
      
      setSubmitted(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setEditMode(false);
        setSelectedFeedbackId(null);
        setFormData(initialFormData);
        setErrors({});
      }, 3000);
      
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (feedback) => {
    setEditMode(true);
    setSelectedFeedbackId(feedback.id);
    setFormData({
      dateOfCall: feedback.dateOfCall,
      customerName: feedback.customerName,
      phoneNumber: feedback.phoneNumber,
      callStatus: feedback.callStatus,
      branchName: feedback.branchName,
      focalName: feedback.focalName,
      receiptGiven: feedback.receiptGiven,
      customerSatisfaction: feedback.customerSatisfaction,
      complaint: feedback.complaint,
      complaintDescription: feedback.complaintDescription || '',
      actionTaken: feedback.actionTaken || '',
      callDuration: feedback.callDuration || '',
      callType: feedback.callType || 'inbound',
      agentNotes: feedback.agentNotes || ''
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setFeedbacks(prev => prev.filter(f => f.id !== id));
        if (selectedFeedbackId === id) {
          setEditMode(false);
          setSelectedFeedbackId(null);
          setFormData(initialFormData);
        }
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
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


        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Recent Feedbacks List */}
            {feedbacks.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Recent Feedbacks</h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {feedbacks.map(feedback => (
                    <div key={feedback.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">{feedback.customerName}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(feedback.callStatus)}`}>
                              {feedback.callStatus}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <FiPhone className="w-3 h-3" /> {feedback.phoneNumber}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiMapPin className="w-3 h-3" /> {feedback.branchName}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiCalendar className="w-3 h-3" /> {feedback.dateOfCall}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiStar className="w-3 h-3 text-yellow-400" /> {feedback.customerSatisfaction}/5
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
                            onClick={() => handleDelete(feedback.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
                        Date of Call <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                        <input
                          type="date"
                          name="dateOfCall"
                          value={formData.dateOfCall}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Call Type */}
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

                    {/* Call Status */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Call Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="callStatus"
                        value={formData.callStatus}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {callStatusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Customer Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
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

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <FiPhone className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                          errors.phoneNumber ? 'text-red-500' : 'text-gray-400 group-focus-within:text-purple-500'
                        }`} />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="+1 234-567-8901"
                          required
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   placeholder-gray-400 dark:placeholder-gray-500
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   ${errors.phoneNumber 
                                     ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                                     : 'border-gray-300 dark:border-gray-600'
                                   }`}
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1 animate-fadeIn">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Branch & Focal Information */}
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
                      <div className="relative group">
                        <FiUserCheck className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                          errors.focalName ? 'text-red-500' : 'text-gray-400 group-focus-within:text-purple-500'
                        }`} />
                        <input
                          type="text"
                          name="focalName"
                          value={formData.focalName}
                          onChange={handleChange}
                          placeholder="Enter focal person name"
                          required
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   placeholder-gray-400 dark:placeholder-gray-500
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   ${errors.focalName 
                                     ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                                     : 'border-gray-300 dark:border-gray-600'
                                   }`}
                        />
                      </div>
                      {errors.focalName && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.focalName}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <FiStar className="text-purple-600" />
                    Feedback Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    {/* Customer Satisfaction */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Customer Satisfaction (1-5)
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(num => (
                          <label key={num} className="cursor-pointer">
                            <input
                              type="radio"
                              name="customerSatisfaction"
                              value={num}
                              checked={formData.customerSatisfaction === num}
                              onChange={handleChange}
                              className="hidden"
                            />
                            <FiStar 
                              className={`w-6 h-6 transition-all duration-300 hover:scale-110 ${
                                formData.customerSatisfaction >= num 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Complaint Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <FiAlertTriangle className="text-purple-600" />
                    Complaint Information
                  </h3>

                  <div className="space-y-4">
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
                                   resize-none ${errors.complaintDescription 
                                     ? 'border-red-500 dark:border-red-500' 
                                     : 'border-gray-300 dark:border-gray-600'
                                   }`}
                        />
                        {errors.complaintDescription && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.complaintDescription}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Taken */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Action Taken
                  </label>
                  <textarea
                    name="actionTaken"
                    value={formData.actionTaken}
                    onChange={handleChange}
                    placeholder="Describe the action taken to resolve the issue..."
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             transition-all duration-300 resize-none"
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
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewFeedback;