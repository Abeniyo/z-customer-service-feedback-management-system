import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import CallCenterSidebar from './CallCenterSidebar';
import api from '../../services/api';

// Import Icons
import { 
  FiChevronRight,
  FiChevronDown,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiStar,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiSun,
  FiMoon,
  FiBell,
  FiUsers,
  FiMessageSquare,
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiUserPlus,
  FiUserMinus,
  FiLoader
} from 'react-icons/fi';

// Stats Summary Component
const StatsSummary = ({ focals }) => {
  const stats = {
    totalFocals: focals.length,
    activeFocals: focals.filter(f => f.is_active).length,
    totalCustomers: focals.reduce((acc, f) => acc + (f.customer_count || 0), 0),
    avgRating: (focals.reduce((acc, f) => acc + (f.average_rating || 0), 0) / focals.length).toFixed(1) || '0.0'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Focals</p>
            <p className="text-2xl font-bold">{stats.totalFocals}</p>
          </div>
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FiUsers className="text-purple-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Active Focals</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeFocals}</p>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <FiCheckCircle className="text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold">{stats.totalCustomers}</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FiUsers className="text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Avg Rating</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}</p>
          </div>
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <FiStar className="text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Focal Card Component
const FocalCard = ({ 
  focal, 
  isExpanded, 
  onToggle, 
  onViewFocal, 
  onEditFocal, 
  onDeleteFocal,
  onAssignCustomers,
  customers,
  loading,
  onViewCustomer
}) => {
  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  };

  const formatName = (focal) => {
    const parts = [
      focal.first_name || '',
      focal.middle_name || '',
      focal.last_name || ''
    ].filter(Boolean);
    return parts.join(' ') || 'Unknown';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Focal Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? (
                <FiLoader className="animate-spin" size={20} />
              ) : isExpanded ? (
                <FiChevronDown size={20} />
              ) : (
                <FiChevronRight size={20} />
              )}
            </button>
            
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
              {formatName(focal).charAt(0)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{formatName(focal)}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(focal.is_active)}`}>
                  {focal.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {focal.role || 'Focal Person'} • {focal.branch || 'No Branch'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Customers</p>
                <p className="font-semibold">{focal.customer_count || 0}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onAssignCustomers(focal)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Assign Customers"
              >
                <FiUserPlus size={18} />
              </button>
              <button
                onClick={() => onViewFocal(focal)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Details"
              >
                <FiEye size={18} />
              </button>
              <button
                onClick={() => onEditFocal(focal)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Edit Focal"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={() => onDeleteFocal(focal)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Focal"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Customer List */}
      {isExpanded && (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <FiUsers />
            Customers ({customers?.length || 0})
          </h4>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <FiLoader className="animate-spin text-purple-600" size={30} />
            </div>
          ) : customers && customers.length > 0 ? (
            <div className="space-y-2">
              {customers.map(customer => (
                <div
                  key={customer.id}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onViewCustomer(customer)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {`${customer.first_name?.charAt(0) || ''}${customer.last_name?.charAt(0) || ''}`}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {`${customer.first_name || ''} ${customer.middle_name || ''} ${customer.last_name || ''}`}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiPhone size={12} />
                            {customer.phone_number || 'N/A'}
                          </span>
                          {customer.email && (
                            <span className="flex items-center gap-1">
                              <FiMail size={12} />
                              {customer.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCustomer(customer);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <FiEye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiUsers className="mx-auto mb-2" size={30} />
              <p>No customers assigned</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Component
const FocalManagement = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // State
  const [focals, setFocals] = useState([]);
  const [expandedFocalId, setExpandedFocalId] = useState(null);
  const [focalCustomers, setFocalCustomers] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // UI State
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [selectedFocal, setSelectedFocal] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Modal States
  const [showFocalModal, setShowFocalModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');

  // Fetch focals on mount
  useEffect(() => {
    fetchFocals();
  }, []);

  // Fetch focals from API
  const fetchFocals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/focal/');
      console.log('Focals response:', response.data);
      
      let focalData = [];
      if (Array.isArray(response.data)) {
        focalData = response.data;
      } else if (response.data.results) {
        focalData = response.data.results;
      }
      
      setFocals(focalData);
    } catch (err) {
      console.error('Error fetching focals:', err);
      setError(err.response?.data?.detail || 'Failed to fetch focals');
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers for a specific focal
  const fetchFocalCustomers = async (focalId) => {
    setLoadingCustomers(prev => ({ ...prev, [focalId]: true }));
    try {
      const response = await api.get(`/focal/focals/${focalId}/customers/`);
      console.log(`Customers for focal ${focalId}:`, response.data);
      
      setFocalCustomers(prev => ({
        ...prev,
        [focalId]: response.data.customers || []
      }));
    } catch (err) {
      console.error(`Error fetching customers for focal ${focalId}:`, err);
      setError(err.response?.data?.detail || 'Failed to fetch customers');
    } finally {
      setLoadingCustomers(prev => ({ ...prev, [focalId]: false }));
    }
  };

  // Handle focal expansion
  const toggleFocal = (focalId) => {
    if (expandedFocalId === focalId) {
      setExpandedFocalId(null);
    } else {
      setExpandedFocalId(focalId);
      // Fetch customers if not already loaded
      if (!focalCustomers[focalId]) {
        fetchFocalCustomers(focalId);
      }
    }
  };

  // Filter focals based on search and status
  const filteredFocals = focals.filter(focal => {
    const fullName = `${focal.first_name || ''} ${focal.middle_name || ''} ${focal.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         (focal.branch || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && focal.is_active) ||
                         (filterStatus === 'inactive' && !focal.is_active);
    return matchesSearch && matchesStatus;
  });

  // Handle focal actions
  const handleViewFocal = (focal) => {
    setSelectedFocal(focal);
    setModalMode('view');
    setShowFocalModal(true);
  };

  const handleEditFocal = (focal) => {
    setSelectedFocal(focal);
    setModalMode('edit');
    setShowFocalModal(true);
  };

  const handleDeleteFocal = async (focal) => {
    if (!window.confirm(`Are you sure you want to delete ${focal.first_name} ${focal.last_name}?`)) return;
    
    setLoading(true);
    try {
      await api.delete(`/focal/focals/${focal.id}/`);
      setSuccess('Focal deleted successfully!');
      fetchFocals();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting focal:', err);
      setError(err.response?.data?.detail || 'Failed to delete focal');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCustomers = (focal) => {
    setSelectedFocal(focal);
    setShowAssignModal(true);
  };

  const handleAddFocal = () => {
    setSelectedFocal(null);
    setModalMode('add');
    setShowFocalModal(true);
  };

  // Handle customer actions
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  // Focal Modal Component
  const FocalModal = () => {
    if (!showFocalModal) return null;

    const [formData, setFormData] = useState(
      modalMode === 'add' 
        ? {
            first_name: '',
            middle_name: '',
            last_name: '',
            role: '',
            branch: '',
            phone_number: '',
            email: '',
            is_active: true,
            join_date: new Date().toISOString().split('T')[0]
          }
        : selectedFocal || {}
    );

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      
      try {
        if (modalMode === 'add') {
          await api.post('/focal/focals/', formData);
          setSuccess('Focal added successfully!');
        } else if (modalMode === 'edit') {
          await api.patch(`/focal/focals/${selectedFocal.id}/`, formData);
          setSuccess('Focal updated successfully!');
        }
        
        setShowFocalModal(false);
        fetchFocals();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Error saving focal:', err);
        setError(err.response?.data?.detail || 'Failed to save focal');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-800 pt-2">
            <h2 className="text-xl font-bold">
              {modalMode === 'add' ? 'Add New Focal' : modalMode === 'edit' ? 'Edit Focal' : 'Focal Details'}
            </h2>
            <button onClick={() => setShowFocalModal(false)} className="p-1 hover:bg-gray-100 rounded">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  disabled={modalMode === 'view'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Middle Name</label>
                <input
                  type="text"
                  value={formData.middle_name || ''}
                  onChange={(e) => setFormData({...formData, middle_name: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  disabled={modalMode === 'view'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  disabled={modalMode === 'view'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  disabled={modalMode === 'view'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <input
                  type="text"
                  value={formData.branch || ''}
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  disabled={modalMode === 'view'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone_number || ''}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  disabled={modalMode === 'view'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  disabled={modalMode === 'view'}
                />
              </div>

              {modalMode !== 'view' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({...formData, is_active: e.target.value === 'active'})}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              )}
            </div>

            {modalMode !== 'view' && (
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <FiLoader className="animate-spin" />}
                  {modalMode === 'add' ? 'Add Focal' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFocalModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}

            {modalMode === 'view' && (
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setModalMode('edit');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowFocalModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

  // Customer Modal Component
  const CustomerModal = () => {
    if (!showCustomerModal || !selectedCustomer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Customer Details</h2>
            <button onClick={() => setShowCustomerModal(false)} className="p-1 hover:bg-gray-100 rounded">
              <FiX size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {`${selectedCustomer.first_name?.charAt(0) || ''}${selectedCustomer.last_name?.charAt(0) || ''}`}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {`${selectedCustomer.first_name || ''} ${selectedCustomer.middle_name || ''} ${selectedCustomer.last_name || ''}`}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FiPhone className="text-gray-400" />
                <span>{selectedCustomer.phone_number || 'N/A'}</span>
              </div>
              {selectedCustomer.email && (
                <div className="flex items-center gap-2">
                  <FiMail className="text-gray-400" />
                  <span>{selectedCustomer.email}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowCustomerModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Assign Customers Modal
  const AssignModal = () => {
    if (!showAssignModal || !selectedFocal) return null;

    const [availableCustomers, setAvailableCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      fetchAvailableCustomers();
    }, []);

    const fetchAvailableCustomers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/customers/customers/?unassigned=true');
        setAvailableCustomers(response.data.results || response.data || []);
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleAssign = async () => {
      if (selectedCustomers.length === 0) return;
      
      setSubmitting(true);
      try {
        await Promise.all(selectedCustomers.map(customerId => 
          api.post('/focal/assign/', {
            focal_id: selectedFocal.id,
            customer_id: customerId
          })
        ));
        
        setSuccess(`Assigned ${selectedCustomers.length} customers successfully!`);
        setShowAssignModal(false);
        // Refresh customers for this focal
        if (focalCustomers[selectedFocal.id]) {
          fetchFocalCustomers(selectedFocal.id);
        }
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Error assigning customers:', err);
        setError('Failed to assign customers');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Assign Customers to {selectedFocal.first_name} {selectedFocal.last_name}
            </h2>
            <button onClick={() => setShowAssignModal(false)} className="p-1 hover:bg-gray-100 rounded">
              <FiX size={20} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <FiLoader className="animate-spin text-purple-600" size={30} />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableCustomers.map(customer => (
                  <label key={customer.id} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      value={customer.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCustomers([...selectedCustomers, customer.id]);
                        } else {
                          setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id));
                        }
                      }}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div>
                      <p className="font-medium">
                        {`${customer.first_name || ''} ${customer.middle_name || ''} ${customer.last_name || ''}`}
                      </p>
                      <p className="text-sm text-gray-500">{customer.phone_number}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleAssign}
                  disabled={selectedCustomers.length === 0 || submitting}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <FiLoader className="animate-spin" />}
                  Assign Selected ({selectedCustomers.length})
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex">
      <CallCenterSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Focal Management
            </h1>

            <div className="flex items-center gap-3">
              {/* Success/Error Messages */}
              {success && (
                <div className="flex items-center gap-2 text-green-600 bg-green-100 px-4 py-2 rounded-lg">
                  <FiCheckCircle />
                  <span>{success}</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-100 px-4 py-2 rounded-lg">
                  <FiAlertCircle />
                  <span>{error}</span>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search focals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 w-64"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg ${
                  showFilters ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
                }`}
              >
                <FiFilter size={20} />
              </button>

              {/* Refresh Button */}
              <button
                onClick={fetchFocals}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={loading}
              >
                <FiRefreshCw className={loading ? 'animate-spin' : ''} size={20} />
              </button>

              {/* Add Focal Button */}
              <button
                onClick={handleAddFocal}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <FiPlus size={18} />
                Add Focal
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold"
                >
                  {user?.name?.charAt(0) || 'U'}
                </button>
                
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats */}
            <StatsSummary focals={filteredFocals} />

            {/* Loading State */}
            {loading && !focals.length ? (
              <div className="flex justify-center items-center h-64">
                <FiLoader className="animate-spin text-purple-600" size={40} />
              </div>
            ) : (
              /* Focals List */
              <div className="space-y-4">
                {filteredFocals.length > 0 ? (
                  filteredFocals.map(focal => (
                    <FocalCard
                      key={focal.id}
                      focal={focal}
                      isExpanded={expandedFocalId === focal.id}
                      onToggle={() => toggleFocal(focal.id)}
                      onViewFocal={handleViewFocal}
                      onEditFocal={handleEditFocal}
                      onDeleteFocal={handleDeleteFocal}
                      onAssignCustomers={handleAssignCustomers}
                      customers={focalCustomers[focal.id]}
                      loading={loadingCustomers[focal.id]}
                      onViewCustomer={handleViewCustomer}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                    <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No focals found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <FocalModal />
      <CustomerModal />
      <AssignModal />
    </div>
  );
};

export default FocalManagement;