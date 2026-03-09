// ComplainManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import CallCenterSidebar from './CallCenterSidebar';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  AlertCircle,
  Loader
} from 'lucide-react';

const ComplainManagement = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // State management
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    pageSize: 10
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    branch: '',
    dateFrom: '',
    dateTo: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // Form state matching your API structure
  const [formData, setFormData] = useState({
    customer: '',
    customer_name: '',
    focal_name: '',
    branch_name: '',
    description: '',
    priority: 'medium',
    status: 'pending'
  });

  // Fetch complaints from API - FIXED URL
  const fetchComplaints = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters - FIXED: Using correct endpoint
      const params = new URLSearchParams({
        page: page,
        page_size: pagination.pageSize,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.branch && { branch: filters.branch }),
        ...(filters.dateFrom && { created_after: filters.dateFrom }),
        ...(filters.dateTo && { created_before: filters.dateTo })
      });

      // FIXED: Correct URL - don't include /api/v1 in baseURL
      const response = await api.get(`/complaints/complaints/?${params}`);
      
      console.log('API Response:', response.data); // Debug log

      // Transform API data
      const transformedData = response.data.results.map(complaint => ({
        id: complaint.id,
        customerId: complaint.customer,
        customerName: complaint.customer_name,
        focalName: complaint.focal_name,
        branchName: complaint.branch_name,
        description: complaint.description,
        createdAt: complaint.created_at,
        updatedAt: complaint.updated_at,
        // You might want to add these fields to your API or set defaults
        priority: complaint.priority || 'medium',
        status: complaint.status || 'pending',
        phone: complaint.phone || 'N/A',
        complaintType: complaint.type || 'General'
      }));

      setComplaints(transformedData);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        currentPage: page,
        pageSize: pagination.pageSize
      });
    } catch (err) {
      setError('Failed to fetch complaints');
      toast.error('Error loading complaints: ' + (err.response?.data?.detail || err.message));
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.pageSize]);

  // Initial fetch
  useEffect(() => {
    fetchComplaints(1);
  }, [fetchComplaints]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission - FIXED
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let response;
      
      if (editingComplaint) {
        // Update existing complaint
        response = await api.put(
          `/complaints/complaints/${editingComplaint.id}/`,
          formData
        );
        toast.success('Complaint updated successfully');
      } else {
        // Create new complaint
        response = await api.post(
          '/complaints/complaints/',
          formData
        );
        toast.success('Complaint created successfully');
      }

      console.log('Submit response:', response.data);

      // Reset form and refresh list
      resetForm();
      fetchComplaints(pagination.currentPage);
    } catch (err) {
      toast.error('Error saving complaint: ' + (err.response?.data?.detail || err.message));
      console.error('Submit error:', err.response?.data || err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;

    try {
      await api.delete(`/complaints/complaints/${id}/`);
      toast.success('Complaint deleted successfully');
      fetchComplaints(pagination.currentPage);
    } catch (err) {
      toast.error('Error deleting complaint: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Handle status update - FIXED
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/complaints/complaints/${id}/`, {
        status: newStatus
      });
      toast.success(`Status updated to ${newStatus}`);
      fetchComplaints(pagination.currentPage);
    } catch (err) {
      toast.error('Error updating status: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      customer: '',
      customer_name: '',
      focal_name: '',
      branch_name: '',
      description: '',
      priority: 'medium',
      status: 'pending'
    });
    setShowForm(false);
    setEditingComplaint(null);
  };

  // Handle edit
  const handleEdit = (complaint) => {
    setEditingComplaint(complaint);
    setFormData({
      customer: complaint.customerId || '',
      customer_name: complaint.customerName,
      focal_name: complaint.focalName,
      branch_name: complaint.branchName,
      description: complaint.description,
      priority: complaint.priority,
      status: complaint.status
    });
    setShowForm(true);
  };

  // View details
  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetails(true);
  };

  // Status color helper
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
      'resolved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200',
      'closed': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200'
    };
    return colors[status] || colors.pending;
  };

  // Priority color helper
  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
      'medium': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200',
      'low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200'
    };
    return colors[priority] || colors.medium;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <CallCenterSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Complaint Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage and track customer complaints
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
                
                <button
                  onClick={() => fetchComplaints(pagination.currentPage)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  <span>New Complaint</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-4 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && fetchComplaints(1)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors
                  ${showFilters 
                    ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <Filter size={20} />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="From Date"
                />

                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="To Date"
                />

                <div className="md:col-span-4 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setFilters({
                        search: '',
                        status: '',
                        priority: '',
                        branch: '',
                        dateFrom: '',
                        dateTo: ''
                      });
                      fetchComplaints(1);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => fetchComplaints(1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : pagination.count}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {complaints.filter(c => c.status === 'pending').length}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {complaints.filter(c => c.status === 'in-progress').length}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {complaints.filter(c => c.status === 'resolved').length}
              </p>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
              <button onClick={() => fetchComplaints(1)} className="ml-auto underline">
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            <>
              {/* Complaints Table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                      {complaints.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            No complaints found
                          </td>
                        </tr>
                      ) : (
                        complaints.map(complaint => (
                          <tr key={complaint.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                              #{complaint.id}
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {complaint.customerName}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                              {complaint.branchName}
                            </td>
                            <td className="px-4 py-3">
                              <div className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-300">
                                {complaint.description}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(complaint.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleViewDetails(complaint)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                  title="View Details"
                                >
                                  <Eye size={16} className="text-blue-600" />
                                </button>
                                <button
                                  onClick={() => handleEdit(complaint)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={16} className="text-green-600" />
                                </button>
                                <button
                                  onClick={() => handleDelete(complaint.id)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} className="text-red-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.count > 0 && (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600 flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
                      {Math.min(pagination.currentPage * pagination.pageSize, pagination.count)} of{' '}
                      {pagination.count} results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fetchComplaints(pagination.currentPage - 1)}
                        disabled={!pagination.previous}
                        className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="px-3 py-1 bg-blue-600 text-white rounded">
                        {pagination.currentPage}
                      </span>
                      <button
                        onClick={() => fetchComplaints(pagination.currentPage + 1)}
                        disabled={!pagination.next}
                        className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Complaint Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingComplaint ? 'Edit Complaint' : 'New Complaint'}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Customer ID
                </label>
                <input
                  type="number"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Focal Person Name *
                </label>
                <input
                  type="text"
                  name="focal_name"
                  value={formData.focal_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Branch *
                </label>
                <input
                  type="text"
                  name="branch_name"
                  value={formData.branch_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {editingComplaint && (
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader size={16} className="animate-spin" />}
                  {editingComplaint ? 'Update Complaint' : 'Create Complaint'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Complaint Details #{selectedComplaint.id}
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Customer</label>
                  <p className="font-medium">{selectedComplaint.customerName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Customer ID</label>
                  <p className="font-medium">{selectedComplaint.customerId || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Focal Person</label>
                  <p className="font-medium">{selectedComplaint.focalName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Branch</label>
                  <p className="font-medium">{selectedComplaint.branchName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Priority</label>
                  <p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
                  <p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400">Description</label>
                  <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    {selectedComplaint.description}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Created</label>
                  <p className="font-medium">{formatDate(selectedComplaint.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Last Updated</label>
                  <p className="font-medium">{formatDate(selectedComplaint.updatedAt)}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowDetails(false);
                    handleEdit(selectedComplaint);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit Complaint
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplainManagement;