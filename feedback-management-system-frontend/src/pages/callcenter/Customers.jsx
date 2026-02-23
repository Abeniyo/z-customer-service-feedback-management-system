import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import CallCenterSidebar from './CallCenterSidebar';
import * as XLSX from 'xlsx';

// Import Components
import CustomerTable from '../../components/callcenter/CustomerTable';
import CustomerStats from '../../components/callcenter/CustomerStats';
import SearchFilter from '../../components/callcenter/SearchFilter';
import ImportModal from '../../components/callcenter/ImportModal';
import CreateCustomerModal from '../../components/callcenter/CreateCustomerModal';
import EditCustomerModal from '../../components/callcenter/EditCustomerModal';
import DeleteModal from '../../components/callcenter/DeleteModal';
import ViewCustomerModal from '../../components/callcenter/ViewCustomerModal';
import FeedbackModal from '../../components/callcenter/FeedbackModal';
import ComplaintModal from '../../components/callcenter/ComplaintModal';
import Header from '../../components/callcenter/ActionBar';

// Import React Icons
import { 
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiBell,
  FiSun,
  FiMoon,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiPlus
} from 'react-icons/fi';

import api from '../../services/api';

const Customers = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Modal States
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  
  // Data States
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [importedData, setImportedData] = useState([]);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCustomers: 0,
    limit: 15
  });

  // Stats State
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    averageRating: 4.7,
    totalCalls: 0,
    totalComplaints: 0,
    pendingComplaints: 0
  });

  // Fetch customers on component mount and when dependencies change
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
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (filter !== 'all') params.append('status', filter);
      if (genderFilter !== 'all') params.append('gender', genderFilter);

      const response = await api.get(`/customers/customers/?${params.toString()}`);
      
      let customerData = [];
      let paginationData = { ...pagination };

      if (response.data) {
        if (Array.isArray(response.data)) {
          customerData = response.data;
          paginationData = {
            ...pagination,
            totalPages: Math.ceil(response.data.length / pagination.limit),
            totalCustomers: response.data.length
          };
        } 
        else if (response.data.results && Array.isArray(response.data.results)) {
          customerData = response.data.results;
          paginationData = {
            ...pagination,
            page: response.data.page || pagination.page,
            totalPages: response.data.total_pages || 1,
            totalCustomers: response.data.count || response.data.results.length
          };
        }
      }

      setCustomers(customerData);
      setPagination(paginationData);
      
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.response?.data?.detail || 'Failed to fetch customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (!Array.isArray(customers)) return;

    const active = customers.filter(c => c?.status !== 'inactive' && !c?.is_deleted).length;
    const totalCalls = customers.reduce((acc, c) => acc + (c?.total_calls || 0), 0);
    const totalComplaints = customers.reduce((acc, c) => acc + (c?.complaints?.length || 0), 0);
    const pendingComplaints = customers.reduce((acc, c) => 
      acc + (c?.complaints?.filter(comp => comp.status === 'pending')?.length || 0), 0);
    
    const avgRating = customers.length > 0 
      ? (customers.reduce((acc, c) => acc + (c?.average_rating || 0), 0) / customers.length).toFixed(1)
      : 4.7;

    setStats({
      totalCustomers: customers.length,
      activeCustomers: active,
      averageRating: avgRating,
      totalCalls: totalCalls,
      totalComplaints,
      pendingComplaints
    });
  };

  const handleImportExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Transform Excel data to match customer format
      const transformedData = jsonData.map(row => ({
        first_name: row['Customer Name']?.split(' ')[0] || '',
        middle_name: row['Customer Name']?.split(' ').length > 2 ? row['Customer Name']?.split(' ')[1] : '',
        last_name: row['Customer Name']?.split(' ').slice(-1)[0] || '',
        phone_number: row['Phone Number']?.toString() || '',
        email: row['Email'] || '',
        gender: row['Gender'] || 'male',
        branch: row['Branch Name'] || '',
        focal_person: row['Focal Name'] || '',
        receipt_given: row['Receipt Given'] === 'Yes',
        satisfaction_level: parseInt(row['Customer Satisfaction']) || 5,
        has_complaint: row['Complaint?'] === 'Yes',
        complaint_description: row['Complaint Description'] || '',
        action_taken: row['Action Taken'] || '',
        call_status: row['Call Status'] || 'pending',
        call_date: row['Date of Call'] || new Date().toISOString().split('T')[0]
      }));
      
      setImportedData(transformedData);
      setShowImportModal(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSaveImportedData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await Promise.allSettled(
        importedData.map(async (customer) => {
          const payload = {
            first_name: customer.first_name,
            middle_name: customer.middle_name,
            last_name: customer.last_name,
            phone_number: customer.phone_number,
            email: customer.email,
            gender: customer.gender,
            branch: customer.branch,
            focal_person: customer.focal_person,
            receipt_given: customer.receipt_given,
            satisfaction_level: customer.satisfaction_level,
            has_complaint: customer.has_complaint,
            complaint_description: customer.complaint_description,
            action_taken: customer.action_taken,
            call_status: customer.call_status,
            call_date: customer.call_date
          };
          
          return await api.post('/customers/customers/', payload);
        })
      );

      const succeeded = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      setSuccess(`Successfully imported ${succeeded} customers${failed > 0 ? `, ${failed} failed` : ''}`);
      setShowImportModal(false);
      setImportedData([]);
      fetchCustomers();
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('Error importing customers:', err);
      setError('Failed to import some customers');
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === customers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(customers.map(c => c.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    setLoading(true);
    setError(null);

    try {
      await Promise.all(selectedRows.map(id => api.delete(`/customers/customers/${id}/`)));
      
      setSuccess(`${selectedRows.length} customers deleted successfully!`);
      setSelectedRows([]);
      fetchCustomers();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting customers:', err);
      setError('Failed to delete some customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const getCustomerFullName = (customer) => {
    if (!customer) return '';
    const parts = [
      customer.first_name || '',
      customer.middle_name || '',
      customer.last_name || ''
    ].filter(Boolean);
    return parts.join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex overflow-hidden">
      <CallCenterSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <Header
          user={user}
          isDark={isDark}
          toggleTheme={toggleTheme}
          profileMenuOpen={profileMenuOpen}
          setProfileMenuOpen={setProfileMenuOpen}
          logout={logout}
          loading={loading}
          success={success}
          error={error}
          setError={setError}
          selectedRows={selectedRows}
          onBulkDelete={handleBulkDelete}
          onRefresh={fetchCustomers}
          onImport={() => document.getElementById('excel-upload').click()}
          onExport={() => {}}
          onCreate={() => setShowCreateModal(true)}
        />

        {/* Hidden file input for Excel upload */}
        <input
          type="file"
          id="excel-upload"
          accept=".xlsx, .xls, .csv"
          className="hidden"
          onChange={(e) => handleImportExcel(e.target.files[0])}
        />

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 mx-4 mt-4 rounded-xl flex items-center justify-between animate-slideIn">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Stats Cards */}
            <CustomerStats stats={stats} />

            {/* Search and Filter */}
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filter={filter}
              setFilter={setFilter}
              genderFilter={genderFilter}
              setGenderFilter={setGenderFilter}
            />

            {/* Customers Table */}
            <CustomerTable
              customers={customers}
              loading={loading}
              selectedRows={selectedRows}
              onSelectRow={handleRowSelect}
              onSelectAll={handleSelectAll}
              sortConfig={sortConfig}
              onSort={handleSort}
              onView={(customer) => {
                setSelectedCustomer(customer);
                setShowViewModal(true);
              }}
              onEdit={(customer) => {
                setSelectedCustomer(customer);
                setShowEditModal(true);
              }}
              onDelete={(customer) => {
                setSelectedCustomer(customer);
                setShowDeleteModal(true);
              }}
              onFeedback={(customer) => {
                setSelectedCustomer(customer);
                setShowFeedbackModal(true);
              }}
              onComplaint={(customer) => {
                setSelectedCustomer(customer);
                setShowComplaintModal(true);
              }}
              getCustomerFullName={getCustomerFullName}
            />

            {/* Pagination */}
            {customers.length > 0 && pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-medium">{customers.length}</span> of{' '}
                  <span className="font-medium">{pagination.totalCustomers}</span> customers
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportedData([]);
        }}
        data={importedData}
        onSave={handleSaveImportedData}
        loading={loading}
      />

      <CreateCustomerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchCustomers();
          setSuccess('Customer created successfully!');
          setTimeout(() => setSuccess(null), 3000);
        }}
      />

      <EditCustomerModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedCustomer(null);
          fetchCustomers();
          setSuccess('Customer updated successfully!');
          setTimeout(() => setSuccess(null), 3000);
        }}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSuccess={() => {
          setShowDeleteModal(false);
          setSelectedCustomer(null);
          fetchCustomers();
          setSuccess('Customer deleted successfully!');
          setTimeout(() => setSuccess(null), 3000);
        }}
      />

      <ViewCustomerModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        getCustomerFullName={getCustomerFullName}
        onEdit={() => {
          setShowViewModal(false);
          setShowEditModal(true);
        }}
        onFeedback={() => {
          setShowViewModal(false);
          setShowFeedbackModal(true);
        }}
        onComplaint={() => {
          setShowViewModal(false);
          setShowComplaintModal(true);
        }}
        onDelete={() => {
          setShowViewModal(false);
          setShowDeleteModal(true);
        }}
      />

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSuccess={() => {
          setShowFeedbackModal(false);
          setSelectedCustomer(null);
          fetchCustomers();
          setSuccess('Feedback added successfully!');
          setTimeout(() => setSuccess(null), 3000);
        }}
      />

      <ComplaintModal
        isOpen={showComplaintModal}
        onClose={() => {
          setShowComplaintModal(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSuccess={() => {
          setShowComplaintModal(false);
          setSelectedCustomer(null);
          fetchCustomers();
          setSuccess('Complaint recorded successfully!');
          setTimeout(() => setSuccess(null), 3000);
        }}
      />
    </div>
  );
};

export default Customers;