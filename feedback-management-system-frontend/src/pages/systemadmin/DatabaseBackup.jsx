import React, { useState, useEffect } from 'react';
import SystemAdminLayout from './SystemAdminLayout';
import axios from 'axios';

// Import React Icons
import { 
  FiDatabase,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiCalendar,
  FiServer,
  FiHardDrive,
  FiActivity,
  FiBarChart2,
  FiX,
  FiEye,
  FiCopy,
  FiSave,
  FiPlay,
  FiPause,
  FiSettings,
  FiArchive,
  FiCloud,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiShield
} from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:8000/api/v1/database-backup/api/backup';

const DatabaseBackup = () => {
  const [activeTab, setActiveTab] = useState('backups');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [restoreModal, setRestoreModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [editScheduleModal, setEditScheduleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expandedStats, setExpandedStats] = useState(false);

  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [backups, setBackups] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [stats, setStats] = useState(null);
  
  // Pagination
  const [backupsPage, setBackupsPage] = useState(1);
  const [schedulesPage, setSchedulesPage] = useState(1);
  const [backupsCount, setBackupsCount] = useState(0);
  const [schedulesCount, setSchedulesCount] = useState(0);
  const [pageSize] = useState(10);

  // Form state for new schedule
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    description: '',
    backup_type: 'full',
    frequency: 'daily',
    scheduled_time: '02:00',
    scheduled_day: '',
    retention_days: 30,
    retention_count: 10,
    destination_type: 'local',
    compression_enabled: true,
    encryption_enabled: true,
    verification_enabled: true,
    notify_on_success: true,
    notify_on_failure: true
  });

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
    fetchBackups();
    fetchSchedules();
    fetchDestinations();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshAllData();
      }, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Refresh when filter/search changes
  useEffect(() => {
    fetchBackups();
  }, [filter, backupsPage, searchTerm]);

  useEffect(() => {
    fetchSchedules();
  }, [schedulesPage, searchTerm]);

  const refreshAllData = async () => {
    await Promise.all([
      fetchDashboardData(),
      fetchBackups(),
      fetchSchedules(),
      fetchDestinations()
    ]);
    setSuccess('Data refreshed successfully');
    setTimeout(() => setSuccess(null), 3000);
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/`, {
        headers: getAuthHeaders()
      });
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    }
  };

  const fetchBackups = async () => {
    try {
      let url = `${API_BASE_URL}/backups/?page=${backupsPage}&page_size=${pageSize}`;
      
      // Add filters
      if (filter !== 'all') {
        url += `&status=${filter}`;
      }
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      const response = await axios.get(url, {
        headers: getAuthHeaders()
      });
      
      // Handle paginated response
      if (response.data.results) {
        setBackups(response.data.results);
        setBackupsCount(response.data.count);
      } else {
        setBackups(response.data);
        setBackupsCount(response.data.length);
      }
    } catch (err) {
      setError('Failed to fetch backups');
      console.error(err);
    }
  };

  const fetchSchedules = async () => {
    try {
      let url = `${API_BASE_URL}/schedules/?page=${schedulesPage}&page_size=${pageSize}`;
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      const response = await axios.get(url, {
        headers: getAuthHeaders()
      });
      
      if (response.data.results) {
        setSchedules(response.data.results);
        setSchedulesCount(response.data.count);
      } else {
        setSchedules(response.data);
        setSchedulesCount(response.data.length);
      }
    } catch (err) {
      setError('Failed to fetch schedules');
      console.error(err);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/destinations/`, {
        headers: getAuthHeaders()
      });
      setDestinations(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch destinations', err);
    }
  };

  const fetchBackupStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/backups/stats/?days=30`, {
        headers: getAuthHeaders()
      });
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Handle create backup
  const handleCreateBackup = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/backups/create/`, {
        backup_type: 'full',
        destination: 'local',
        compression: true,
        encryption: true,
        verify: true
      }, {
        headers: getAuthHeaders()
      });
      
      setSuccess('Backup started successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh data
      fetchBackups();
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  // Handle restore backup
  const handleRestoreBackup = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.post(`${API_BASE_URL}/backups/${selectedBackup.id}/restore/`, {
        overwrite: true,
        verify_before_restore: true,
        create_backup_before: true
      }, {
        headers: getAuthHeaders()
      });
      
      setRestoreModal(false);
      setSuccess('Database restore initiated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Restore failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete backup
  const handleDeleteBackup = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`${API_BASE_URL}/backups/${selectedBackup.id}/`, {
        headers: getAuthHeaders()
      });
      
      setDeleteModal(false);
      setSuccess('Backup deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh data
      fetchBackups();
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle permanent delete
  const handlePermanentDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.post(`${API_BASE_URL}/backups/${selectedBackup.id}/delete-permanent/`, {}, {
        headers: getAuthHeaders()
      });
      
      setDeleteModal(false);
      setSuccess('Backup permanently deleted!');
      setTimeout(() => setSuccess(null), 3000);
      
      fetchBackups();
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle verify backup
  const handleVerifyBackup = async (backupId) => {
    try {
      await axios.post(`${API_BASE_URL}/backups/${backupId}/verify/`, {}, {
        headers: getAuthHeaders()
      });
      
      setSuccess('Verification started');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Verification failed');
    }
  };

  // Handle schedule actions
  const handlePauseSchedule = async (scheduleId) => {
    try {
      await axios.post(`${API_BASE_URL}/schedules/${scheduleId}/pause/`, {}, {
        headers: getAuthHeaders()
      });
      
      setSuccess('Schedule paused');
      fetchSchedules();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to pause schedule');
    }
  };

  const handleResumeSchedule = async (scheduleId) => {
    try {
      await axios.post(`${API_BASE_URL}/schedules/${scheduleId}/resume/`, {}, {
        headers: getAuthHeaders()
      });
      
      setSuccess('Schedule resumed');
      fetchSchedules();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to resume schedule');
    }
  };

  const handleRunNow = async (scheduleId) => {
    try {
      await axios.post(`${API_BASE_URL}/schedules/${scheduleId}/run-now/`, {}, {
        headers: getAuthHeaders()
      });
      
      setSuccess('Backup started');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to start backup');
    }
  };

  // Handle create schedule
  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await axios.post(`${API_BASE_URL}/schedules/`, newSchedule, {
        headers: getAuthHeaders()
      });
      
      setScheduleModal(false);
      setSuccess('Backup schedule created successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      fetchSchedules();
      
      // Reset form
      setNewSchedule({
        name: '',
        description: '',
        backup_type: 'full',
        frequency: 'daily',
        scheduled_time: '02:00',
        scheduled_day: '',
        retention_days: 30,
        retention_count: 10,
        destination_type: 'local',
        compression_enabled: true,
        encryption_enabled: true,
        verification_enabled: true,
        notify_on_success: true,
        notify_on_failure: true
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  // Handle update schedule
  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await axios.put(`${API_BASE_URL}/schedules/${selectedSchedule.id}/`, selectedSchedule, {
        headers: getAuthHeaders()
      });
      
      setEditScheduleModal(false);
      setSuccess('Schedule updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      fetchSchedules();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update schedule');
    } finally {
      setLoading(false);
    }
  };

  // Handle test destination
  const handleTestDestination = async (destinationId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/destinations/${destinationId}/test-connection/`, {}, {
        headers: getAuthHeaders()
      });
      
      if (response.data.status === 'success') {
        setSuccess('Connection successful!');
      } else {
        setError('Connection failed');
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Connection test failed');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'success':
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'failed':
      case 'error':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'warning':
      case 'paused':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'pending':
      case 'running':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'verified':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  // Get type color
  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'full':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'incremental':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'transaction_log':
      case 'transaction log':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'differential':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Filter backups
  const filteredBackups = backups.filter(backup => {
    const matchesSearch = backup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backup.backup_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backup.location_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && backup.status === filter;
  });

  // Filter schedules
  const filteredSchedules = schedules.filter(schedule => {
    return schedule.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           schedule.backup_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           schedule.destination_type?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Stats cards data from API
  const statsCards = dashboardData ? [
    { 
      label: 'Total Backups', 
      value: dashboardData.total_backups?.toString() || '0', 
      icon: FiDatabase, 
      change: `+${dashboardData.recent_backups?.length || 0}`, 
      color: 'red',
      subtext: 'Last 30 days'
    },
    { 
      label: 'Storage Used', 
      value: `${dashboardData.storage_used_gb?.toFixed(1) || '0'} GB`, 
      icon: FiHardDrive, 
      change: `${dashboardData.storage_percentage?.toFixed(1) || '0'}%`, 
      color: 'blue',
      subtext: `of ${dashboardData.storage_total_gb || 500} GB`
    },
    { 
      label: 'Last Backup', 
      value: dashboardData.last_backup?.created_humanized || 'Never', 
      icon: FiClock, 
      change: dashboardData.last_backup?.status || 'N/A', 
      color: 'green',
      subtext: dashboardData.last_backup?.created_at ? formatDate(dashboardData.last_backup.created_at) : 'No backups'
    },
    { 
      label: 'Success Rate', 
      value: `${dashboardData.success_rate?.toFixed(1) || '0'}%`, 
      icon: FiActivity, 
      change: `${dashboardData.success_rate > 95 ? '+' : ''}${(dashboardData.success_rate - 95).toFixed(1)}%`, 
      color: 'purple',
      subtext: 'Last 30 days'
    }
  ] : [];

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
            <button onClick={() => setSuccess(null)} className="text-green-700">
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
            <button onClick={() => setError(null)} className="text-red-700">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Database Backup Management</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg border ${
                autoRefresh 
                  ? 'bg-red-50 border-red-300 text-red-600 dark:bg-red-900/20 dark:border-red-700' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-500 hover:text-red-600'
              }`}
            >
              <FiRefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setScheduleModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FiClock className="w-4 h-4" />
              New Schedule
            </button>
            <button
              onClick={handleCreateBackup}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiDatabase className="w-4 h-4" />
                  Create Backup
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const colors = {
              red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
              blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
              green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
              purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
            };
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${colors[stat.color]} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className={`text-xs ${
                      stat.change.includes('+') ? 'text-green-600' : 
                      stat.change === 'Success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                    <p className="text-xs text-gray-400">{stat.subtext}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('backups')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'backups'
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FiDatabase className="w-4 h-4" />
                Backup History ({backupsCount})
              </button>
              <button
                onClick={() => setActiveTab('schedules')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'schedules'
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FiClock className="w-4 h-4" />
                Backup Schedules ({schedulesCount})
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4">
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
                {activeTab === 'backups' && (
                  <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select 
                      value={filter} 
                      onChange={(e) => setFilter(e.target.value)}
                      className="pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                               appearance-none cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="warning">Warning</option>
                      <option value="pending">Pending</option>
                      <option value="running">Running</option>
                      <option value="verified">Verified</option>
                    </select>
                  </div>
                )}
                <button 
                  onClick={refreshAllData}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiRefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-x-auto">
            {activeTab === 'backups' ? (
              // Backups Table
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Backup Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Size</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBackups.length > 0 ? (
                    filteredBackups.map((backup) => (
                      <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <FiDatabase className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{backup.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(backup.backup_type)}`}>
                            {backup.backup_type_display || backup.backup_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{backup.size_humanized || backup.file_size}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <FiClock className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{backup.created_humanized || formatDate(backup.created_at)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{backup.duration_humanized || 'N/A'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{backup.location_type}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                            {backup.status === 'success' && <FiCheckCircle className="w-3 h-3" />}
                            {backup.status === 'failed' && <FiAlertCircle className="w-3 h-3" />}
                            {backup.status === 'warning' && <FiAlertCircle className="w-3 h-3" />}
                            {backup.status === 'verified' && <FiCheckCircle className="w-3 h-3" />}
                            {backup.status_display || backup.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => {
                                setSelectedBackup(backup);
                                setViewModal(true);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-700"
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedBackup(backup);
                                setRestoreModal(true);
                              }}
                              className="p-1 text-green-600 hover:text-green-700"
                              title="Restore"
                            >
                              <FiRefreshCw className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleVerifyBackup(backup.id)}
                              className="p-1 text-purple-600 hover:text-purple-700"
                              title="Verify"
                            >
                              <FiCheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedBackup(backup);
                                setDeleteModal(true);
                              }}
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
                      <td colSpan="8" className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No backups found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              // Schedules Table
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Schedule Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Frequency</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Next Run</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Retention</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Destination</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSchedules.length > 0 ? (
                    filteredSchedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <FiClock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{schedule.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(schedule.backup_type)}`}>
                            {schedule.backup_type_display || schedule.backup_type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">{schedule.frequency_display || schedule.frequency}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {schedule.scheduled_time || 'Anytime'}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {schedule.next_run_humanized || formatDate(schedule.next_run) || 'Not scheduled'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{schedule.retention_days} days</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{schedule.destination_type}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                            {schedule.status === 'active' && <FiCheckCircle className="w-3 h-3" />}
                            {schedule.status === 'paused' && <FiPause className="w-3 h-3" />}
                            {schedule.status_display || schedule.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => {
                                setSelectedSchedule(schedule);
                                setEditScheduleModal(true);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-700"
                              title="Edit"
                            >
                              <FiSettings className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleRunNow(schedule.id)}
                              className="p-1 text-green-600 hover:text-green-700"
                              title="Run Now"
                            >
                              <FiPlay className="w-4 h-4" />
                            </button>
                            {schedule.status === 'active' ? (
                              <button 
                                onClick={() => handlePauseSchedule(schedule.id)}
                                className="p-1 text-yellow-600 hover:text-yellow-700"
                                title="Pause"
                              >
                                <FiPause className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleResumeSchedule(schedule.id)}
                                className="p-1 text-green-600 hover:text-green-700"
                                title="Resume"
                              >
                                <FiPlay className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No schedules found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing 1 to {activeTab === 'backups' ? filteredBackups.length : filteredSchedules.length} of {activeTab === 'backups' ? backupsCount : schedulesCount} items
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => activeTab === 'backups' 
                  ? setBackupsPage(p => Math.max(1, p - 1))
                  : setSchedulesPage(p => Math.max(1, p - 1))
                }
                disabled={activeTab === 'backups' ? backupsPage === 1 : schedulesPage === 1}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button className="px-3 py-1 rounded bg-red-600 text-white text-sm">
                {activeTab === 'backups' ? backupsPage : schedulesPage}
              </button>
              <button 
                onClick={() => activeTab === 'backups' 
                  ? setBackupsPage(p => p + 1)
                  : setSchedulesPage(p => p + 1)
                }
                disabled={activeTab === 'backups' 
                  ? filteredBackups.length < pageSize 
                  : filteredSchedules.length < pageSize
                }
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Backup Details Modal */}
      {viewModal && selectedBackup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Backup Details</h2>
                <button
                  onClick={() => setViewModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Backup Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBackup.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Type</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedBackup.backup_type)}`}>
                      {selectedBackup.backup_type_display || selectedBackup.backup_type}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBackup.status)}`}>
                      {selectedBackup.status === 'success' && <FiCheckCircle className="w-3 h-3" />}
                      {selectedBackup.status === 'failed' && <FiAlertCircle className="w-3 h-3" />}
                      {selectedBackup.status === 'warning' && <FiAlertCircle className="w-3 h-3" />}
                      {selectedBackup.status_display || selectedBackup.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Size</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBackup.size_humanized || selectedBackup.file_size}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBackup.duration_humanized || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedBackup.created_at)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completed</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedBackup.completed_at)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBackup.location_path || selectedBackup.location_type}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Checksum</p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white break-all">{selectedBackup.checksum || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Encryption</p>
                    <FiShield className="w-4 h-4 mx-auto text-green-600" />
                    <p className="text-xs text-gray-900 dark:text-white mt-1">{selectedBackup.encryption_algorithm || 'AES-256'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Compressed</p>
                    {selectedBackup.compression_enabled ? (
                      <FiArchive className="w-4 h-4 mx-auto text-green-600" />
                    ) : (
                      <FiX className="w-4 h-4 mx-auto text-gray-400" />
                    )}
                    <p className="text-xs text-gray-900 dark:text-white mt-1">
                      {selectedBackup.compression_enabled ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Verified</p>
                    {selectedBackup.verification_status === 'passed' ? (
                      <FiCheckCircle className="w-4 h-4 mx-auto text-green-600" />
                    ) : (
                      <FiAlertCircle className="w-4 h-4 mx-auto text-yellow-600" />
                    )}
                    <p className="text-xs text-gray-900 dark:text-white mt-1">
                      {selectedBackup.verification_status === 'passed' ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                {selectedBackup.warning_message && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                      <FiAlertCircle className="w-5 h-5" />
                      <p className="text-sm">{selectedBackup.warning_message}</p>
                    </div>
                  </div>
                )}

                {selectedBackup.error_message && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <FiAlertCircle className="w-5 h-5" />
                      <p className="text-sm">{selectedBackup.error_message}</p>
                    </div>
                  </div>
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
                    setRestoreModal(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Restore
                </button>
                <button
                  onClick={() => {
                    setViewModal(false);
                    setDeleteModal(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {restoreModal && selectedBackup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <FiAlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Restore Database</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This action will overwrite current data</p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to restore <span className="font-semibold">{selectedBackup.name}</span>? 
                This will replace your current database with this backup. This action cannot be undone.
              </p>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  <strong>Warning:</strong> All current data will be lost. Make sure you have a recent backup of the current state.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRestoreModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestoreBackup}
                  disabled={loading}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Restoring...
                    </>
                  ) : (
                    <>
                      <FiRefreshCw className="w-4 h-4" />
                      Restore Backup
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && selectedBackup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <FiAlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Backup</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedBackup.name}</span>? 
                This backup will be permanently removed.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePermanentDelete}
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
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Schedule Modal */}
      {scheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Backup Schedule</h2>
                <button
                  onClick={() => setScheduleModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateSchedule}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Schedule Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSchedule.name}
                      onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
                      placeholder="e.g., Daily Full Backup"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newSchedule.description}
                      onChange={(e) => setNewSchedule({...newSchedule, description: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Backup Type *
                      </label>
                      <select
                        required
                        value={newSchedule.backup_type}
                        onChange={(e) => setNewSchedule({...newSchedule, backup_type: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="full">Full Backup</option>
                        <option value="incremental">Incremental</option>
                        <option value="transaction_log">Transaction Log</option>
                        <option value="differential">Differential</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequency *
                      </label>
                      <select
                        required
                        value={newSchedule.frequency}
                        onChange={(e) => setNewSchedule({...newSchedule, frequency: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="continuous">Continuous (15 min)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={newSchedule.scheduled_time}
                        onChange={(e) => setNewSchedule({...newSchedule, scheduled_time: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Retention Period *
                      </label>
                      <select
                        required
                        value={newSchedule.retention_days}
                        onChange={(e) => setNewSchedule({...newSchedule, retention_days: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="7">7 days</option>
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Destination *
                    </label>
                    <select
                      required
                      value={newSchedule.destination_type}
                      onChange={(e) => setNewSchedule({...newSchedule, destination_type: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="local">Local Storage</option>
                      <option value="s3">AWS S3</option>
                      <option value="both">Local + Cloud</option>
                      <option value="cold">Cold Storage</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={newSchedule.compression_enabled}
                        onChange={(e) => setNewSchedule({...newSchedule, compression_enabled: e.target.checked})}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500" 
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enable compression</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={newSchedule.encryption_enabled}
                        onChange={(e) => setNewSchedule({...newSchedule, encryption_enabled: e.target.checked})}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500" 
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enable encryption</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setScheduleModal(false)}
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
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Create Schedule
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {editScheduleModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Schedule</h2>
                <button
                  onClick={() => setEditScheduleModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateSchedule}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Schedule Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={selectedSchedule.name}
                      onChange={(e) => setSelectedSchedule({...selectedSchedule, name: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={selectedSchedule.description}
                      onChange={(e) => setSelectedSchedule({...selectedSchedule, description: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Backup Type
                      </label>
                      <select
                        value={selectedSchedule.backup_type}
                        onChange={(e) => setSelectedSchedule({...selectedSchedule, backup_type: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="full">Full Backup</option>
                        <option value="incremental">Incremental</option>
                        <option value="transaction_log">Transaction Log</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequency
                      </label>
                      <select
                        value={selectedSchedule.frequency}
                        onChange={(e) => setSelectedSchedule({...selectedSchedule, frequency: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={selectedSchedule.scheduled_time}
                        onChange={(e) => setSelectedSchedule({...selectedSchedule, scheduled_time: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Retention Days
                      </label>
                      <input
                        type="number"
                        value={selectedSchedule.retention_days}
                        onChange={(e) => setSelectedSchedule({...selectedSchedule, retention_days: parseInt(e.target.value)})}
                        min="1"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Destination
                    </label>
                    <select
                      value={selectedSchedule.destination_type}
                      onChange={(e) => setSelectedSchedule({...selectedSchedule, destination_type: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="local">Local Storage</option>
                      <option value="s3">AWS S3</option>
                      <option value="both">Local + Cloud</option>
                      <option value="cold">Cold Storage</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={selectedSchedule.compression_enabled}
                        onChange={(e) => setSelectedSchedule({...selectedSchedule, compression_enabled: e.target.checked})}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500" 
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enable compression</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={selectedSchedule.encryption_enabled}
                        onChange={(e) => setSelectedSchedule({...selectedSchedule, encryption_enabled: e.target.checked})}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500" 
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enable encryption</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setEditScheduleModal(false)}
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
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Update Schedule
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </SystemAdminLayout>
  );
};

export default DatabaseBackup;