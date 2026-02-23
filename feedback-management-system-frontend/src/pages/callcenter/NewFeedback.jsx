import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import CallCenterSidebar from './CallCenterSidebar';
import api from '../../services/api';

// Import React Icons
import { 
  FiUser,
  FiMinus, 
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
  FiLoader,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiPlus,
  FiDownload,
  FiTrendingUp,
  FiTrendingDown,
  FiAward,
  FiPieChart,
  FiBarChart2
} from 'react-icons/fi';

const FeedbackManagement = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Data State
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [callCenterUsers, setCallCenterUsers] = useState([]);

  // Form State
  const [editMode, setEditMode] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [formData, setFormData] = useState({
    satisfaction_level: 'good',
    feedback_date: new Date().toISOString().split('T')[0],
    call_interaction: null,
    customer: null,
    call_center: null,
    // Additional UI fields
    customerName: '',
    phoneNumber: '',
    branchName: '',
    focalName: '',
    receiptGiven: 'no',
    complaint: 'no',
    complaintDescription: '',
    actionTaken: '',
    callDuration: '',
    callType: 'inbound',
    agentNotes: '',
    callStatus: 'pending'
  });

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [satisfactionFilter, setSatisfactionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: 'feedback_date', direction: 'desc' });

  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalFeedbacks: 0,
    limit: 10
  });

  // Statistics State
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    goodCount: 0,
    neutralCount: 0,
    badCount: 0,
    satisfactionTrend: 0
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Satisfaction level options matching Django model
  const satisfactionOptions = [
    { value: 'good', label: 'Good', color: 'green', icon: FiCheckCircle },
    { value: 'neutral', label: 'Neutral', color: 'yellow', icon: FiMinus },
    { value: 'bad', label: 'Bad', color: 'red', icon: FiAlertTriangle }
  ];

  const callStatusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow', icon: FiClock },
    { value: 'completed', label: 'Completed', color: 'green', icon: FiCheckCircle },
    { value: 'missed', label: 'Missed', color: 'red', icon: FiX },
    { value: 'escalated', label: 'Escalated', color: 'orange', icon: FiTrendingUp }
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

  // Fetch data on mount
  useEffect(() => {
    fetchCustomers();
    fetchCallCenterUsers();
    fetchFeedbacks();
  }, []);

  // Apply filters and search
  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, searchTerm, statusFilter, satisfactionFilter, dateFilter]);

  // Calculate stats when feedbacks change
  useEffect(() => {
    calculateStats();
  }, [feedbacks]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers/?limit=1000');
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
    setError(null);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        page_size: pagination.limit
      });
      
      if (searchTerm) params.append('search', searchTerm);
      
      console.log('Fetching feedbacks from:', `/feedbacks/feedbacks/?${params.toString()}`);
      
      const response = await api.get(`/feedbacks/feedbacks/?${params.toString()}`);
      console.log('Feedbacks response:', response.data);
      
      // Handle paginated response
      let feedbackData = [];
      let paginationData = { ...pagination };

      if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          feedbackData = response.data.results;
          paginationData = {
            ...pagination,
            page: response.data.page || pagination.page,
            totalPages: Math.ceil(response.data.count / pagination.limit),
            totalFeedbacks: response.data.count || response.data.results.length
          };
        } else if (Array.isArray(response.data)) {
          feedbackData = response.data;
          paginationData = {
            ...pagination,
            totalPages: 1,
            totalFeedbacks: response.data.length
          };
        }
      }

      setFeedbacks(feedbackData);
      setPagination(paginationData);
      setFilteredFeedbacks(feedbackData);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError(err.response?.data?.detail || 'Failed to load feedbacks');
      setFeedbacks([]);
      setFilteredFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const filterFeedbacks = () => {
    let filtered = [...feedbacks];

    // Apply search filter (search in customer name)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(f => {
        const customerName = f.customer ? 
          `${f.customer.first_name} ${f.customer.middle_name || ''} ${f.customer.last_name}`.toLowerCase() : '';
        return customerName.includes(term);
      });
    }

    // Apply satisfaction filter
    if (satisfactionFilter !== 'all') {
      filtered = filtered.filter(f => f.satisfaction_level === satisfactionFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch(dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(f => new Date(f.feedback_date) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(f => new Date(f.feedback_date) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(f => new Date(f.feedback_date) >= filterDate);
          break;
      }
    }

    setFilteredFeedbacks(filtered);
  };

  const calculateStats = () => {
    if (!feedbacks.length) {
      setStats({
        totalFeedbacks: 0,
        goodCount: 0,
        neutralCount: 0,
        badCount: 0,
        satisfactionTrend: 0
      });
      return;
    }

    const total = feedbacks.length;
    const goodCount = feedbacks.filter(f => f.satisfaction_level === 'good').length;
    const neutralCount = feedbacks.filter(f => f.satisfaction_level === 'neutral').length;
    const badCount = feedbacks.filter(f => f.satisfaction_level === 'bad').length;

    // Calculate trend (compare with previous period)
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    const recentCount = feedbacks.filter(f => new Date(f.feedback_date) > lastMonth).length;
    const previousCount = feedbacks.filter(f => {
      const date = new Date(f.feedback_date);
      return date <= lastMonth && date > new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));
    }).length;
    
    const trend = previousCount ? ((recentCount - previousCount) / previousCount * 100).toFixed(1) : 100;

    setStats({
      totalFeedbacks: total,
      goodCount,
      neutralCount,
      badCount,
      satisfactionTrend: trend
    });
  };

  const getCustomerFullName = (customer) => {
    if (!customer) return 'Unknown Customer';
    
    const parts = [
      customer.first_name || '',
      customer.middle_name || '',
      customer.last_name || ''
    ].filter(Boolean);
    
    return parts.join(' ');
  };

  const getCustomerPhone = (customer) => {
    return customer?.phone_number || 'N/A';
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer) {
      newErrors.customer = 'Please select a customer';
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
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    const customerId = e.target.value ? parseInt(e.target.value) : null;
    const selectedCustomer = customers.find(c => c.id === customerId);
    
    setFormData(prev => ({
      ...prev,
      customer: customerId,
      customerName: selectedCustomer ? getCustomerFullName(selectedCustomer) : '',
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
      // Prepare data for API - matching Django model
      const feedbackData = {
        satisfaction_level: formData.satisfaction_level,
        feedback_date: new Date(formData.feedback_date).toISOString(),
        call_interaction: null, // This needs to be created or passed
        customer: formData.customer,
        call_center: user?.id || null
      };

      console.log('Submitting feedback:', feedbackData);

      let response;
      if (editMode && selectedFeedbackId) {
        response = await api.patch(`/feedbacks/feedbacks/${selectedFeedbackId}/`, feedbackData);
        console.log('Feedback updated:', response.data);
        setSuccess('Feedback updated successfully!');
      } else {
        response = await api.post('/feedbacks/feedbacks/', feedbackData);
        console.log('Feedback created:', response.data);
        setSuccess('Feedback created successfully!');
      }
      
      setSubmitted(true);
      await fetchFeedbacks(); // Refresh the list
      
      setTimeout(() => {
        setSubmitted(false);
        setEditMode(false);
        setSelectedFeedbackId(null);
        setFormData({
          satisfaction_level: 'good',
          feedback_date: new Date().toISOString().split('T')[0],
          call_interaction: null,
          customer: null,
          call_center: null,
          customerName: '',
          phoneNumber: '',
          branchName: '',
          focalName: '',
          receiptGiven: 'no',
          complaint: 'no',
          complaintDescription: '',
          actionTaken: '',
          callDuration: '',
          callType: 'inbound',
          agentNotes: '',
          callStatus: 'pending'
        });
        setErrors({});
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error saving feedback:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to save feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (feedback) => {
    setEditMode(true);
    setSelectedFeedbackId(feedback.id);
    
    setFormData({
      ...formData,
      satisfaction_level: feedback.satisfaction_level || 'good',
      feedback_date: feedback.feedback_date ? feedback.feedback_date.split('T')[0] : new Date().toISOString().split('T')[0],
      customer: feedback.customer?.id || feedback.customer,
      customerName: getCustomerFullName(feedback.customer),
      phoneNumber: getCustomerPhone(feedback.customer),
      call_center: feedback.call_center
    });
    
    setViewMode('form');
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
      setSuccess('Feedback deleted successfully!');
      await fetchFeedbacks(); // Refresh the list
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError('Failed to delete feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleView = (feedback) => {
    // For viewing details, you might want to show a modal instead of form
    console.log('View feedback:', feedback);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sorted = [...filteredFeedbacks].sort((a, b) => {
      let aValue, bValue;
      
      switch(key) {
        case 'customer_name':
          aValue = getCustomerFullName(a.customer);
          bValue = getCustomerFullName(b.customer);
          break;
        case 'satisfaction':
          aValue = a.satisfaction_level || '';
          bValue = b.satisfaction_level || '';
          break;
        case 'date':
          aValue = new Date(a.feedback_date);
          bValue = new Date(b.feedback_date);
          break;
        default:
          aValue = a[key];
          bValue = b[key];
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredFeedbacks(sorted);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSatisfactionFilter('all');
    setDateFilter('all');
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Customer Name', 'Phone', 'Satisfaction', 'Date', 'Call Interaction', 'Call Center'];
    const data = filteredFeedbacks.map(f => [
      f.id,
      getCustomerFullName(f.customer),
      getCustomerPhone(f.customer),
      f.satisfaction_level,
      new Date(f.feedback_date).toLocaleDateString(),
      f.call_interaction || 'N/A',
      f.call_center || 'N/A'
    ]);
    
    const csv = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedbacks_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getSatisfactionColor = (level) => {
    switch(level) {
      case 'good': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'neutral': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'bad': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getSatisfactionIcon = (level) => {
    const option = satisfactionOptions.find(opt => opt.value === level);
    const Icon = option?.icon || FiStar;
    return <Icon className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex overflow-hidden">
        <CallCenterSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fadeIn">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-lg">
                <FiCheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {editMode ? 'Feedback Updated Successfully!' : 'Feedback Submitted Successfully!'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {editMode ? 'The feedback has been updated in the system.' : 'Thank you for recording the customer feedback.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setViewMode('list');
                  }} 
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold 
                           hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 
                           shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
                >
                  <FiEye className="w-5 h-5" />
                  View All Feedbacks
                </button>
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setViewMode('form');
                    setEditMode(false);
                    setSelectedFeedbackId(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                           rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 
                           transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiPlus className="w-5 h-5" />
                  Add Another
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex overflow-hidden">
      <CallCenterSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ml-14 lg:ml-0">
                {viewMode === 'list' ? 'Feedback Management' : (editMode ? 'Edit Feedback' : 'New Feedback')}
              </h1>

              <div className="flex items-center gap-3">
                {/* Success/Error Messages */}
                {success && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full animate-slideIn">
                    <FiCheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{success}</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-full animate-slideIn">
                    <FiAlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                {/* View Toggle */}
                {viewMode === 'list' ? (
                  <>
                    <button
                      onClick={exportToCSV}
                      className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                      title="Export to CSV"
                    >
                      <FiDownload className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        showFilters 
                          ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                          : 'text-gray-500 hover:text-purple-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title="Toggle Filters"
                    >
                      <FiFilter className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('form')}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/25"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Feedback
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setViewMode('list')}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    Back to List
                  </button>
                )}

                {/* Refresh Button */}
                <button 
                  onClick={fetchFeedbacks}
                  className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
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
          {viewMode === 'list' ? (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Feedbacks</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFeedbacks}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 flex items-center justify-center">
                      <FiMessageSquare className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    {stats.satisfactionTrend > 0 ? (
                      <FiTrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <FiTrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${stats.satisfactionTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stats.satisfactionTrend)}%
                    </span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Good</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.goodCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center justify-center">
                      <FiCheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: stats.totalFeedbacks ? (stats.goodCount / stats.totalFeedbacks) * 100 : 0 + '%' }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Neutral</p>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.neutralCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 flex items-center justify-center">
                      <FiMinus className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: stats.totalFeedbacks ? (stats.neutralCount / stats.totalFeedbacks) * 100 : 0 + '%' }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Bad</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.badCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center justify-center">
                      <FiAlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: stats.totalFeedbacks ? (stats.badCount / stats.totalFeedbacks) * 100 : 0 + '%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by customer name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 
                               bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                               placeholder-gray-400 dark:placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               transition-all duration-300"
                    />
                  </div>
                  
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3.5 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 font-medium"
                  >
                    Clear Filters
                  </button>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-slideDown">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Satisfaction
                      </label>
                      <select
                        value={satisfactionFilter}
                        onChange={(e) => setSatisfactionFilter(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="all">All Satisfaction</option>
                        {satisfactionOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date Range
                      </label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Feedbacks Table */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-700">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-purple-600 transition-colors"
                          onClick={() => handleSort('customer_name')}
                        >
                          <div className="flex items-center gap-1">
                            Customer
                            {sortConfig.key === 'customer_name' && (
                              sortConfig.direction === 'asc' ? 
                              <FiChevronUp className="w-4 h-4" /> : 
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Phone
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-purple-600 transition-colors"
                          onClick={() => handleSort('satisfaction')}
                        >
                          <div className="flex items-center gap-1">
                            Satisfaction
                            {sortConfig.key === 'satisfaction' && (
                              sortConfig.direction === 'asc' ? 
                              <FiChevronUp className="w-4 h-4" /> : 
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-purple-600 transition-colors"
                          onClick={() => handleSort('date')}
                        >
                          <div className="flex items-center gap-1">
                            Date
                            {sortConfig.key === 'date' && (
                              sortConfig.direction === 'asc' ? 
                              <FiChevronUp className="w-4 h-4" /> : 
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Call Interaction
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-12 text-center">
                            <div className="flex justify-center">
                              <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
                            </div>
                            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading feedbacks...</p>
                          </td>
                        </tr>
                      ) : filteredFeedbacks.length > 0 ? (
                        filteredFeedbacks.map(feedback => (
                          <tr 
                            key={feedback.id} 
                            className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-900/10 dark:hover:to-pink-900/10 transition-all duration-300 cursor-pointer group"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              #{feedback.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm mr-3 shadow-lg">
                                  {feedback.customer?.first_name?.charAt(0) || '?'}
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {getCustomerFullName(feedback.customer)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {getCustomerPhone(feedback.customer)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getSatisfactionColor(feedback.satisfaction_level)}`}>
                                {getSatisfactionIcon(feedback.satisfaction_level)}
                                {feedback.satisfaction_level}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(feedback.feedback_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {feedback.call_interaction || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(feedback);
                                }}
                                className="text-purple-600 hover:text-purple-900 dark:hover:text-purple-400 mr-3 transition-colors"
                                title="Edit"
                              >
                                <FiEdit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(feedback);
                                }}
                                className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center mb-4">
                                <FiMessageSquare className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">No feedbacks found</p>
                              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Try adjusting your search or filters</p>
                              <button
                                onClick={() => setViewMode('form')}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                              >
                                Add Your First Feedback
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredFeedbacks.length > 0 && pagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Showing <span className="font-medium">{filteredFeedbacks.length}</span> of{' '}
                      <span className="font-medium">{pagination.totalFeedbacks}</span> feedbacks
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-1"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button 
                        onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-1"
                      >
                        Next
                        <FiChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Form Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {editMode ? 'Edit Feedback' : 'New Feedback'}
                  </h2>
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-medium px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    {editMode ? 'Editing' : 'Creating'} Feedback
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-full" />
                </div>
              </div>

              {/* Form */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Customer Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                      <FiUsers className="text-purple-600" />
                      Customer Information
                    </h3>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select Customer <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                        <select
                          name="customer"
                          value={formData.customer || ''}
                          onChange={handleCustomerChange}
                          required
                          className={`w-full pl-12 pr-10 py-3.5 rounded-xl border transition-all duration-300
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   appearance-none cursor-pointer
                                   ${errors.customer ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                        >
                          <option value="">Select a customer</option>
                          {customers.map(customer => {
                            const fullName = getCustomerFullName(customer);
                            return (
                              <option key={customer.id} value={customer.id}>
                                {fullName} - {customer.phone_number || 'No phone'}
                              </option>
                            );
                          })}
                        </select>
                        <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.customer && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                          <FiAlertTriangle className="w-4 h-4" />
                          {errors.customer}
                        </p>
                      )}
                      {formData.customer && (
                        <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                              {formData.customerName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{formData.customerName}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{formData.phoneNumber}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feedback Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                      <FiStar className="text-purple-600" />
                      Feedback Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Feedback Date */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Feedback Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                          <input
                            type="date"
                            name="feedback_date"
                            value={formData.feedback_date}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                     transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* Satisfaction Level */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Satisfaction Level <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {satisfactionOptions.map(option => {
                            const Icon = option.icon;
                            return (
                              <label key={option.value} className="cursor-pointer">
                                <input
                                  type="radio"
                                  name="satisfaction_level"
                                  value={option.value}
                                  checked={formData.satisfaction_level === option.value}
                                  onChange={handleChange}
                                  className="hidden"
                                  required
                                />
                                <div className={`flex items-center justify-center gap-1 py-3 rounded-xl transition-all duration-300 font-medium
                                              ${formData.satisfaction_level === option.value 
                                                ? `bg-${option.color}-600 text-white scale-105 shadow-md` 
                                                : `bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-${option.color}-100 dark:hover:bg-${option.color}-900/20`
                                              }`}>
                                  <Icon className="w-4 h-4" />
                                  {option.label}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Branch Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                      <FiMapPin className="text-purple-600" />
                      Branch Information
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
                          className={`w-full px-4 py-3.5 rounded-xl border transition-all duration-300
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
                          className={`w-full px-4 py-3.5 rounded-xl border transition-all duration-300
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

                  {/* Additional Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Receipt Given */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Receipt Given?
                      </label>
                      <div className="flex gap-6">
                        {receiptOptions.map(option => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="receiptGiven"
                              value={option.value}
                              checked={formData.receiptGiven === option.value}
                              onChange={handleChange}
                              className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                          </label>
                        ))}
                      </div>
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
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 placeholder-gray-400 dark:placeholder-gray-500
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Complaint Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Is there a complaint?
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="complaint"
                            value="yes"
                            checked={formData.complaint === 'yes'}
                            onChange={handleChange}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
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
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
                        </label>
                      </div>
                    </div>

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
                          className={`w-full px-4 py-3.5 rounded-xl border transition-all duration-300
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
                      placeholder="Describe the action taken..."
                      rows="3"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 
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
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 
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
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 
                               text-white rounded-xl font-semibold
                               hover:from-purple-700 hover:to-pink-700 transform hover:-translate-y-0.5
                               transition-all duration-300 disabled:opacity-50 
                               disabled:cursor-not-allowed disabled:hover:translate-y-0
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                               dark:focus:ring-offset-gray-800 flex items-center justify-center gap-2
                               shadow-lg hover:shadow-purple-500/25 text-lg"
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
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear the form?')) {
                          setFormData({
                            satisfaction_level: 'good',
                            feedback_date: new Date().toISOString().split('T')[0],
                            call_interaction: null,
                            customer: null,
                            call_center: null,
                            customerName: '',
                            phoneNumber: '',
                            branchName: '',
                            focalName: '',
                            receiptGiven: 'no',
                            complaint: 'no',
                            complaintDescription: '',
                            actionTaken: '',
                            callDuration: '',
                            callType: 'inbound',
                            agentNotes: '',
                            callStatus: 'pending'
                          });
                          setErrors({});
                          setEditMode(false);
                          setSelectedFeedbackId(null);
                        }
                      }}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                               rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600
                               transition-all duration-300 disabled:opacity-50 
                               flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600
                               hover:scale-105 transform text-lg"
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
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && feedbackToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                  <FiAlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delete Feedback</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Are you sure you want to delete feedback from{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {getCustomerFullName(feedbackToDelete.customer)}
                </span>?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setFeedbackToDelete(null);
                  }}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 font-medium shadow-lg shadow-red-600/30"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-5 h-5" />
                      Delete Feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FeedbackManagement;