import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import CallCenterSidebar from './CallCenterSidebar';
import api from '../../services/api';

// Import React Icons
import { 
  FiSearch, 
  FiFilter, 
  FiMail, 
  FiPhone, 
  FiStar, 
  FiCalendar,
  FiUser,
  FiMoreVertical,
  FiMessageSquare,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiSun,
  FiMoon,
  FiBell,
  FiMenu,
  FiX,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiEdit,
  FiAlertCircle,
  FiPlus,
  FiSave,
  FiTrash2
} from 'react-icons/fi';

const Customers = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Customers state - initialize as empty array
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCustomers: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: 'male',
    phone_number: ''
  });

  // Stats state
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    averageRating: 4.7,
    totalCalls: 0
  });

  // Fetch customers on component mount and when filters/pagination change
  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, filter, genderFilter, searchTerm]);

  // Calculate stats when customers change
  useEffect(() => {
    calculateStats();
  }, [customers]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters according to API spec
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 12 // Show 12 customers per page
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (filter !== 'all') params.append('status', filter);
      if (genderFilter !== 'all') params.append('gender', genderFilter);

      // GET /api/v1/customers/
      const response = await api.get(`/customers/customers/?${params.toString()}`);
      
      console.log('Customers API Response:', response.data);
      
      // Handle different response structures safely
      let customerData = [];
      let paginationData = { ...pagination };

      if (response.data) {
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          customerData = response.data;
          paginationData = {
            page: pagination.page,
            totalPages: 1,
            totalCustomers: response.data.length
          };
        } 
        // Check if response.data has results property (Django REST framework style)
        else if (response.data.results && Array.isArray(response.data.results)) {
          customerData = response.data.results;
          paginationData = {
            page: response.data.page || pagination.page,
            totalPages: response.data.total_pages || 1,
            totalCustomers: response.data.count || response.data.results.length
          };
        }
        // Check if response.data is an object with data property
        else if (response.data.data && Array.isArray(response.data.data)) {
          customerData = response.data.data;
          paginationData = {
            page: response.data.page || pagination.page,
            totalPages: response.data.total_pages || 1,
            totalCustomers: response.data.total || response.data.data.length
          };
        }
        // If it's some other object, try to convert to array or log error
        else {
          console.warn('Unexpected API response format:', response.data);
          customerData = [];
        }
      }

      setCustomers(customerData);
      setPagination(paginationData);
      
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to fetch customers');
      // Set empty array on error to prevent map error
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    // Ensure customers is an array before using array methods
    if (!Array.isArray(customers)) {
      setStats({
        totalCustomers: 0,
        activeCustomers: 0,
        averageRating: 4.7,
        totalCalls: 0
      });
      return;
    }

    const active = customers.filter(c => c && c.status !== 'inactive' && !c.is_deleted).length;
    const totalCalls = customers.reduce((acc, c) => acc + (c?.total_calls || 0), 0);
    const avgRating = customers.length > 0 
      ? (customers.reduce((acc, c) => acc + (c?.average_rating || 0), 0) / customers.length).toFixed(1)
      : 4.7;

    setStats({
      totalCustomers: customers.length,
      activeCustomers: active,
      averageRating: avgRating,
      totalCalls: totalCalls
    });
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/customers/customers/', formData);
      
      console.log('Create customer response:', response.data);
      
      setSuccess(`Customer ${response.data.first_name} ${response.data.last_name} created successfully!`);
      setCreateModal(false);
      resetForm();
      fetchCustomers();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating customer:', err);
      setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData = {};
      if (formData.first_name !== selectedCustomer.first_name) updateData.first_name = formData.first_name;
      if (formData.middle_name !== selectedCustomer.middle_name) updateData.middle_name = formData.middle_name;
      if (formData.last_name !== selectedCustomer.last_name) updateData.last_name = formData.last_name;
      if (formData.gender !== selectedCustomer.gender) updateData.gender = formData.gender;
      if (formData.phone_number !== selectedCustomer.phone_number) updateData.phone_number = formData.phone_number;
      
      const response = await api.patch(`/customers/customers/${selectedCustomer.id}/`, updateData);
      
      console.log('Update customer response:', response.data);
      
      setSuccess(`Customer updated successfully!`);
      setEditModal(false);
      setSelectedCustomer(null);
      resetForm();
      fetchCustomers();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating customer:', err);
      setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/customers/customers/${selectedCustomer.id}/`);
      
      setSuccess(`Customer deleted successfully!`);
      setDeleteModal(false);
      setSelectedCustomer(null);
      fetchCustomers();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to delete customer');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = async (customer) => {
    if (!customer || !customer.id) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/customers/customers/${customer.id}/`);
      setSelectedCustomer(response.data);
      setViewModal(true);
    } catch (err) {
      console.error('Error fetching customer:', err);
      setError('Failed to fetch customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = (customer) => {
    if (!customer) return;
    
    setSelectedCustomer(customer);
    setFormData({
      first_name: customer.first_name || '',
      middle_name: customer.middle_name || '',
      last_name: customer.last_name || '',
      gender: customer.gender || 'male',
      phone_number: customer.phone_number || ''
    });
    setEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      middle_name: '',
      last_name: '',
      gender: 'male',
      phone_number: ''
    });
  };

  const getStatusFromCustomer = (customer) => {
    if (!customer) return 'unknown';
    if (customer.is_deleted) return 'deleted';
    if (customer.status === 'inactive') return 'inactive';
    return 'active';
  };

  const getStatusStyles = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
      case 'deleted':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getColorStyles = (color) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    };
    return colors[color] || colors.purple;
  };

  // Safe check for customers array
  const hasCustomers = Array.isArray(customers) && customers.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      <CallCenterSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-14 lg:ml-0">
                Customer Management
              </h1>

              <div className="flex items-center gap-3">
                {/* Success/Error Messages */}
                {success && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                    <FiCheckCircle className="w-4 h-4" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                {/* Refresh Button */}
                <button 
                  onClick={() => fetchCustomers()}
                  className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>

                {/* Add Customer Button */}
                <button 
                  onClick={() => {
                    resetForm();
                    setCreateModal(true);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Customer
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
                        onClick={logout}
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

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mx-4 mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-700">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Content - Scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 flex items-center justify-center`}>
                    <FiUsers className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCustomers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center justify-center`}>
                    <FiCheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Customers</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeCustomers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 flex items-center justify-center`}>
                    <FiStar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 flex items-center justify-center`}>
                    <FiPhone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Calls</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCalls}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search customers by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select 
                      value={filter} 
                      onChange={(e) => setFilter(e.target.value)}
                      className="pl-10 pr-8 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               appearance-none cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select 
                      value={genderFilter} 
                      onChange={(e) => setGenderFilter(e.target.value)}
                      className="pl-10 pr-8 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               appearance-none cursor-pointer"
                    >
                      <option value="all">All Genders</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Customers Grid */}
            {loading && !hasCustomers ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Loading customers...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hasCustomers ? (
                    customers.map(customer => {
                      if (!customer) return null;
                      const status = getStatusFromCustomer(customer);
                      return (
                        <div 
                          key={customer.id || Math.random()} 
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden hover:-translate-y-1 cursor-pointer group"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                  {customer.first_name?.charAt(0) || '?'}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {customer.first_name} {customer.last_name}
                                  </h3>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(status)}`}>
                                    {status}
                                  </span>
                                </div>
                              </div>
                              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <FiMoreVertical className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="space-y-2 mb-4">
                              {customer.email && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <FiMail className="w-4 h-4 flex-shrink-0" />
                                  <span className="truncate">{customer.email}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <FiPhone className="w-4 h-4 flex-shrink-0" />
                                <span>{customer.phone_number}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-4">
                              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {customer.total_calls || 0}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Calls</p>
                              </div>
                              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {customer.average_rating?.toFixed(1) || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                              </div>
                              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {customer.gender?.charAt(0).toUpperCase() || '?'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Last: {formatDate(customer.last_contact)}
                              </span>
                              <button className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                                View Details
                                <FiEye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No customers found</p>
                      <button 
                        onClick={() => { setSearchTerm(''); setFilter('all'); setGenderFilter('all'); }}
                        className="mt-4 px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {hasCustomers && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Showing {customers.length} of {pagination.totalCustomers} customers
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                        disabled={pagination.page === 1}
                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 rounded bg-purple-600 text-white text-sm">
                        {pagination.page}
                      </span>
                      <button 
                        onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Create Customer Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Customer</h2>
                <button
                  onClick={() => setCreateModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      placeholder="Enter first name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={formData.middle_name}
                      onChange={(e) => setFormData({...formData, middle_name: e.target.value})}
                      placeholder="Enter middle name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      placeholder="Enter last name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      placeholder="0912345678"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setCreateModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Create Customer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Customer</h2>
                <button
                  onClick={() => {
                    setEditModal(false);
                    setSelectedCustomer(null);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateCustomer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={formData.middle_name}
                      onChange={(e) => setFormData({...formData, middle_name: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setEditModal(false);
                      setSelectedCustomer(null);
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Update Customer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <FiAlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Customer</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete customer <span className="font-semibold">
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </span>?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setDeleteModal(false);
                    setSelectedCustomer(null);
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCustomer}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      Delete Customer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Customer Modal */}
      {viewModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {selectedCustomer.first_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedCustomer.first_name} {selectedCustomer.middle_name} {selectedCustomer.last_name}
                    </h2>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(getStatusFromCustomer(selectedCustomer))}`}>
                      {getStatusFromCustomer(selectedCustomer)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setViewModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Contact Information</h3>
                  {selectedCustomer.email && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <FiMail className="w-4 h-4" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <FiPhone className="w-4 h-4" />
                    <span>{selectedCustomer.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <FiUser className="w-4 h-4" />
                    <span>Gender: {selectedCustomer.gender}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Statistics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-purple-600">{selectedCustomer.total_calls || 0}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Calls</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{selectedCustomer.average_rating?.toFixed(1) || 'N/A'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Contact</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatDate(selectedCustomer.last_contact)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Feedback</h3>
                {selectedCustomer.feedbacks?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.feedbacks.slice(0, 3).map(feedback => (
                      <div key={feedback.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{feedback.rating}/5</span>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(feedback.created_at)}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">"{feedback.message}"</p>
                        <p className="text-xs text-gray-500">Agent: {feedback.agent_name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">No feedback history available</p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setViewModal(false);
                    handleEditCustomer(selectedCustomer);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit Customer
                </button>
                <button
                  onClick={() => {
                    setViewModal(false);
                    setSelectedCustomer(selectedCustomer);
                    setDeleteModal(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
                <Link
                  to="/callcenter/new-feedback"
                  state={{ customer: selectedCustomer }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FiMessageSquare className="w-4 h-4" />
                  New Feedback
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;