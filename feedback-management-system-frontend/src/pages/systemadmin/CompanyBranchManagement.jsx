import React, { useState, useEffect } from 'react';
import SystemAdminLayout from './SystemAdminLayout';
import api from '../../services/api';

// Import React Icons
import { 
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
  FiSave,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiMapPin,
  FiHome,
  FiBriefcase,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const CompanyBranchManagement = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('companies');

  // Company States
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    description: ''
  });

  // Branch States
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchFormData, setBranchFormData] = useState({
    name: '',
    location: '',
    company: ''
  });

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal States
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [deleteType, setDeleteType] = useState(null); // 'company' or 'branch'
  const [itemToDelete, setItemToDelete] = useState(null);

  // Pagination States
  const [companyPagination, setCompanyPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  const [branchPagination, setBranchPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  // Filtered data for current tab
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (branch.location && branch.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (branch.company_name && branch.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
    fetchBranches();
  }, []);

  // Fetch companies when pagination changes
  useEffect(() => {
    if (activeTab === 'companies') {
      fetchCompanies();
    }
  }, [companyPagination.page, companyPagination.limit]);

  // Fetch branches when pagination changes
  useEffect(() => {
    if (activeTab === 'branches') {
      fetchBranches();
    }
  }, [branchPagination.page, branchPagination.limit]);

  // Fetch companies with pagination and search
  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: companyPagination.page,
        page_size: companyPagination.limit
      });
      
      if (searchTerm && activeTab === 'companies') {
        params.append('search', searchTerm);
      }

      const response = await api.get(`/company/?${params.toString()}`);
      
      // Handle paginated response
      if (response.data.results) {
        setCompanies(response.data.results);
        setCompanyPagination(prev => ({
          ...prev,
          totalItems: response.data.count,
          totalPages: Math.ceil(response.data.count / prev.limit)
        }));
      } else {
        setCompanies(response.data);
        setCompanyPagination(prev => ({
          ...prev,
          totalItems: response.data.length,
          totalPages: Math.ceil(response.data.length / prev.limit)
        }));
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err.response?.data?.detail || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  // Fetch branches with pagination and search
  const fetchBranches = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: branchPagination.page,
        page_size: branchPagination.limit
      });
      
      if (searchTerm && activeTab === 'branches') {
        params.append('search', searchTerm);
      }

      const response = await api.get(`/branch/?${params.toString()}`);
      
      // Handle paginated response
      if (response.data.results) {
        setBranches(response.data.results);
        setBranchPagination(prev => ({
          ...prev,
          totalItems: response.data.count,
          totalPages: Math.ceil(response.data.count / prev.limit)
        }));
      } else {
        setBranches(response.data);
        setBranchPagination(prev => ({
          ...prev,
          totalItems: response.data.length,
          totalPages: Math.ceil(response.data.length / prev.limit)
        }));
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err.response?.data?.detail || 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setError(null);
    if (tab === 'companies') {
      fetchCompanies();
    } else {
      fetchBranches();
    }
  };

  // Company CRUD Operations
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/company/', companyFormData);
      setSuccess('Company created successfully!');
      setShowCompanyModal(false);
      resetCompanyForm();
      fetchCompanies();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating company:', err);
      setError(err.response?.data?.detail || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    if (!selectedCompany) return;
    
    setLoading(true);
    setError(null);

    try {
      await api.patch(`/company/${selectedCompany.id}/`, companyFormData);
      setSuccess('Company updated successfully!');
      setShowCompanyModal(false);
      resetCompanyForm();
      fetchCompanies();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating company:', err);
      setError(err.response?.data?.detail || 'Failed to update company');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!itemToDelete) return;
    
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/company/${itemToDelete.id}/`);
      setSuccess('Company deleted successfully!');
      setShowDeleteModal(false);
      setItemToDelete(null);
      setDeleteType(null);
      fetchCompanies();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting company:', err);
      setError(err.response?.data?.detail || 'Failed to delete company');
    } finally {
      setLoading(false);
    }
  };

  // Branch CRUD Operations
  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/branch/', branchFormData);
      setSuccess('Branch created successfully!');
      setShowBranchModal(false);
      resetBranchForm();
      fetchBranches();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating branch:', err);
      setError(err.response?.data?.detail || 'Failed to create branch');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    if (!selectedBranch) return;
    
    setLoading(true);
    setError(null);

    try {
      await api.patch(`/branch/${selectedBranch.id}/`, branchFormData);
      setSuccess('Branch updated successfully!');
      setShowBranchModal(false);
      resetBranchForm();
      fetchBranches();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating branch:', err);
      setError(err.response?.data?.detail || 'Failed to update branch');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBranch = async () => {
    if (!itemToDelete) return;
    
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/branch/${itemToDelete.id}/`);
      setSuccess('Branch deleted successfully!');
      setShowDeleteModal(false);
      setItemToDelete(null);
      setDeleteType(null);
      fetchBranches();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting branch:', err);
      setError(err.response?.data?.detail || 'Failed to delete branch');
    } finally {
      setLoading(false);
    }
  };

  // Reset forms
  const resetCompanyForm = () => {
    setCompanyFormData({
      name: '',
      description: ''
    });
    setSelectedCompany(null);
  };

  const resetBranchForm = () => {
    setBranchFormData({
      name: '',
      location: '',
      company: ''
    });
    setSelectedBranch(null);
  };

  // Handle edit
  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setCompanyFormData({
      name: company.name,
      description: company.description || ''
    });
    setModalMode('edit');
    setShowCompanyModal(true);
  };

  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);
    setBranchFormData({
      name: branch.name,
      location: branch.location || '',
      company: branch.company
    });
    setModalMode('edit');
    setShowBranchModal(true);
  };

  // Handle view
  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setModalMode('view');
    setShowViewModal(true);
  };

  const handleViewBranch = (branch) => {
    setSelectedBranch(branch);
    setModalMode('view');
    setShowViewModal(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (type, item) => {
    setDeleteType(type);
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (deleteType === 'company') {
      handleDeleteCompany();
    } else {
      handleDeleteBranch();
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'companies') {
        setCompanyPagination(prev => ({ ...prev, page: 1 }));
        fetchCompanies();
      } else {
        setBranchPagination(prev => ({ ...prev, page: 1 }));
        fetchBranches();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <SystemAdminLayout>
      <div className="space-y-6">
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
            <button onClick={() => setSuccess(null)} type="button" className="text-green-700">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} type="button" className="text-red-700">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center justify-center">
                <FiBriefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{companies.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center justify-center">
                <FiMapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Branches</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{branches.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => handleTabChange('companies')}
                type="button"
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'companies'
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FiBriefcase className="w-4 h-4" />
                Companies
              </button>
              <button
                onClick={() => handleTabChange('branches')}
                type="button"
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'branches'
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FiMapPin className="w-4 h-4" />
                Branches
              </button>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  type="button"
                  className={`p-2 rounded-lg border ${
                    showFilters 
                      ? 'bg-red-50 border-red-300 text-red-600 dark:bg-red-900/20 dark:border-red-700' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-500 hover:text-red-600'
                  }`}
                >
                  <FiFilter className="w-5 h-5" />
                </button>
                <button
                  onClick={activeTab === 'companies' ? fetchCompanies : fetchBranches}
                  type="button"
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:text-red-600"
                >
                  <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => {
                    if (activeTab === 'companies') {
                      setModalMode('add');
                      setShowCompanyModal(true);
                    } else {
                      setModalMode('add');
                      setShowBranchModal(true);
                    }
                  }}
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  Add {activeTab === 'companies' ? 'Company' : 'Branch'}
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Additional filters coming soon...</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {loading && !companies.length && !branches.length ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
              </div>
            ) : (
              <>
                {/* Companies Table */}
                {activeTab === 'companies' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Company Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Description</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Branches</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredCompanies.length > 0 ? (
                          filteredCompanies.map((company) => (
                            <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">#{company.id}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                                    <FiBriefcase className="w-4 h-4" />
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-white">{company.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                {company.description || '-'}
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                  {branches.filter(b => b.company === company.id).length} branches
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleViewCompany(company)}
                                    type="button"
                                    className="p-1 text-blue-600 hover:text-blue-700"
                                    title="View Details"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditCompany(company)}
                                    type="button"
                                    className="p-1 text-green-600 hover:text-green-700"
                                    title="Edit"
                                  >
                                    <FiEdit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick('company', company)}
                                    type="button"
                                    className="p-1 text-red-600 hover:text-red-700"
                                    title="Delete"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                              No companies found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {companyPagination.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Showing {filteredCompanies.length} of {companyPagination.totalItems} companies
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCompanyPagination(prev => ({...prev, page: prev.page - 1}))}
                            disabled={companyPagination.page === 1}
                            type="button"
                            className="p-2 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                          >
                            <FiChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 rounded bg-red-600 text-white text-sm">
                            {companyPagination.page} / {companyPagination.totalPages}
                          </span>
                          <button
                            onClick={() => setCompanyPagination(prev => ({...prev, page: prev.page + 1}))}
                            disabled={companyPagination.page === companyPagination.totalPages}
                            type="button"
                            className="p-2 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                          >
                            <FiChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Branches Table */}
                {activeTab === 'branches' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Branch Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Location</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Company</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredBranches.length > 0 ? (
                          filteredBranches.map((branch) => (
                            <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">#{branch.id}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                                    <FiMapPin className="w-4 h-4" />
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-white">{branch.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {branch.location || '-'}
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                  {branch.company_name}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleViewBranch(branch)}
                                    type="button"
                                    className="p-1 text-blue-600 hover:text-blue-700"
                                    title="View Details"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditBranch(branch)}
                                    type="button"
                                    className="p-1 text-green-600 hover:text-green-700"
                                    title="Edit"
                                  >
                                    <FiEdit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick('branch', branch)}
                                    type="button"
                                    className="p-1 text-red-600 hover:text-red-700"
                                    title="Delete"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                              No branches found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {branchPagination.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Showing {filteredBranches.length} of {branchPagination.totalItems} branches
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setBranchPagination(prev => ({...prev, page: prev.page - 1}))}
                            disabled={branchPagination.page === 1}
                            type="button"
                            className="p-2 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                          >
                            <FiChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 rounded bg-red-600 text-white text-sm">
                            {branchPagination.page} / {branchPagination.totalPages}
                          </span>
                          <button
                            onClick={() => setBranchPagination(prev => ({...prev, page: prev.page + 1}))}
                            disabled={branchPagination.page === branchPagination.totalPages}
                            type="button"
                            className="p-2 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                          >
                            <FiChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals - Now passing props instead of defining inside */}
      <CompanyModal 
        show={showCompanyModal}
        onClose={() => {
          setShowCompanyModal(false);
          resetCompanyForm();
        }}
        mode={modalMode}
        formData={companyFormData}
        setFormData={setCompanyFormData}
        selectedCompany={selectedCompany}
        loading={loading}
        onSubmit={modalMode === 'add' ? handleCreateCompany : handleUpdateCompany}
        onEdit={() => {
          setShowCompanyModal(false);
          handleEditCompany(selectedCompany);
        }}
        companies={companies}
      />

      <BranchModal
        show={showBranchModal}
        onClose={() => {
          setShowBranchModal(false);
          resetBranchForm();
        }}
        mode={modalMode}
        formData={branchFormData}
        setFormData={setBranchFormData}
        selectedBranch={selectedBranch}
        loading={loading}
        onSubmit={modalMode === 'add' ? handleCreateBranch : handleUpdateBranch}
        onEdit={() => {
          setShowBranchModal(false);
          handleEditBranch(selectedBranch);
        }}
        companies={companies}
      />

      <ViewModal
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCompany(null);
          setSelectedBranch(null);
        }}
        selectedCompany={selectedCompany}
        selectedBranch={selectedBranch}
        branches={branches}
        companies={companies}
        onEdit={() => {
          setShowViewModal(false);
          if (selectedCompany) {
            handleEditCompany(selectedCompany);
          } else {
            handleEditBranch(selectedBranch);
          }
        }}
      />

      <DeleteModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
          setDeleteType(null);
        }}
        itemToDelete={itemToDelete}
        deleteType={deleteType}
        loading={loading}
        onConfirm={handleConfirmDelete}
      />
    </SystemAdminLayout>
  );
};

// Company Modal Component - Moved outside main component
const CompanyModal = ({ show, onClose, mode, formData, setFormData, selectedCompany, loading, onSubmit, onEdit, companies }) => {
  if (!show) return null;

  const isViewMode = mode === 'view';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'add' ? 'Add New Company' : 
               mode === 'edit' ? 'Edit Company' : 'Company Details'}
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={isViewMode}
                  placeholder="Enter company name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  disabled={isViewMode}
                  placeholder="Enter company description"
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                           disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                />
              </div>
            </div>

            {!isViewMode && (
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {mode === 'add' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      {mode === 'add' ? 'Create Company' : 'Update Company'}
                    </>
                  )}
                </button>
              </div>
            )}

            {isViewMode && (
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={onEdit}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

// Branch Modal Component - Moved outside main component
const BranchModal = ({ show, onClose, mode, formData, setFormData, selectedBranch, loading, onSubmit, onEdit, companies }) => {
  if (!show) return null;

  const isViewMode = mode === 'view';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'add' ? 'Add New Branch' : 
               mode === 'edit' ? 'Edit Branch' : 'Branch Details'}
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Branch Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={isViewMode}
                  placeholder="Enter branch name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  disabled={isViewMode}
                  placeholder="Enter branch location"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company *
                </label>
                <select
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  disabled={isViewMode}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!isViewMode && (
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {mode === 'add' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      {mode === 'add' ? 'Create Branch' : 'Update Branch'}
                    </>
                  )}
                </button>
              </div>
            )}

            {isViewMode && (
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={onEdit}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

// View Modal Component - Moved outside main component
const ViewModal = ({ show, onClose, selectedCompany, selectedBranch, branches, companies, onEdit }) => {
  if (!show || (!selectedCompany && !selectedBranch)) return null;

  const isCompany = !!selectedCompany;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isCompany ? 'Company Details' : 'Branch Details'}
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {isCompany ? (
              // Company Details
              <>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Company ID</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedCompany?.id}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Company Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedCompany?.name}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedCompany?.description || 'No description provided'}
                  </p>
                </div>

                {/* Show associated branches */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Associated Branches</p>
                  {branches.filter(b => b.company === selectedCompany?.id).length > 0 ? (
                    <ul className="space-y-2">
                      {branches.filter(b => b.company === selectedCompany?.id).map(branch => (
                        <li key={branch.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <FiMapPin className="w-4 h-4 text-gray-400" />
                          {branch.name} - {branch.location || 'No location'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No branches associated</p>
                  )}
                </div>
              </>
            ) : (
              // Branch Details
              <>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Branch ID</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBranch?.id}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Branch Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBranch?.name}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedBranch?.location || 'No location provided'}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Company</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedBranch?.company_name || 'Unknown'}
                  </p>
                </div>

                {/* Show company details */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Company Description</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {companies.find(c => c.id === selectedBranch?.company)?.description || 'No description'}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal - Moved outside main component
const DeleteModal = ({ show, onClose, itemToDelete, deleteType, loading, onConfirm }) => {
  if (!show || !itemToDelete) return null;

  const isCompany = deleteType === 'company';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <FiAlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete {isCompany ? 'Company' : 'Branch'}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete <span className="font-semibold">{itemToDelete.name}</span>?
            {isCompany && ' All branches under this company will also be affected.'}
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              type="button"
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
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBranchManagement;