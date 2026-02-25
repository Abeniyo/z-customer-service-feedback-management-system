import React, { useState, useEffect } from 'react';
import SystemAdminLayout from './SystemAdminLayout';

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
  FiMoreVertical
} from 'react-icons/fi';

const DatabaseBackup = () => {
  const [activeTab, setActiveTab] = useState('backups');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [restoreModal, setRestoreModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expandedStats, setExpandedStats] = useState(false);

  // Backup statistics
  const stats = [
    { 
      label: 'Total Backups', 
      value: '156', 
      icon: FiDatabase, 
      change: '+12', 
      color: 'red',
      subtext: 'Last 30 days'
    },
    { 
      label: 'Storage Used', 
      value: '245.8 GB', 
      icon: FiHardDrive, 
      change: '+18.2 GB', 
      color: 'blue',
      subtext: 'of 500 GB'
    },
    { 
      label: 'Last Backup', 
      value: '2 hours ago', 
      icon: FiClock, 
      change: 'Success', 
      color: 'green',
      subtext: 'Feb 25, 2026 14:30'
    },
    { 
      label: 'Success Rate', 
      value: '99.2%', 
      icon: FiActivity, 
      change: '+0.3%', 
      color: 'purple',
      subtext: 'Last 30 days'
    }
  ];

  // Detailed statistics
  const detailedStats = [
    { label: 'Database Size', value: '185.4 GB', icon: FiServer, color: 'red' },
    { label: 'Backup Frequency', value: 'Daily', icon: FiRefreshCw, color: 'blue' },
    { label: 'Retention Period', value: '30 days', icon: FiCalendar, color: 'green' },
    { label: 'Compression Ratio', value: '3.2x', icon: FiArchive, color: 'purple' },
    { label: 'Cloud Backups', value: '42', icon: FiCloud, color: 'yellow' },
    { label: 'Failed Attempts', value: '3', icon: FiAlertCircle, color: 'red' }
  ];

  // Backup schedules
  const schedules = [
    {
      id: 1,
      name: 'Daily Full Backup',
      type: 'Full',
      frequency: 'Daily',
      time: '02:00 AM',
      retention: '30 days',
      destination: 'AWS S3',
      status: 'active',
      lastRun: '2026-02-25 02:00 AM',
      nextRun: '2026-02-26 02:00 AM',
      size: '185.4 GB',
      compression: true,
      encryption: true
    },
    {
      id: 2,
      name: 'Hourly Incremental',
      type: 'Incremental',
      frequency: 'Hourly',
      time: 'Every hour',
      retention: '7 days',
      destination: 'Local + Cloud',
      status: 'active',
      lastRun: '2026-02-25 14:00 PM',
      nextRun: '2026-02-25 15:00 PM',
      size: '12-25 MB',
      compression: true,
      encryption: true
    },
    {
      id: 3,
      name: 'Weekly Archive',
      type: 'Full',
      frequency: 'Weekly',
      time: 'Sunday 03:00 AM',
      retention: '90 days',
      destination: 'Cold Storage',
      status: 'paused',
      lastRun: '2026-02-23 03:00 AM',
      nextRun: '2026-03-02 03:00 AM',
      size: '185.4 GB',
      compression: true,
      encryption: true
    },
    {
      id: 4,
      name: 'Transaction Logs',
      type: 'Transaction Log',
      frequency: 'Every 15 min',
      time: 'Continuous',
      retention: '2 days',
      destination: 'Local SSD',
      status: 'active',
      lastRun: '2026-02-25 14:45 PM',
      nextRun: '2026-02-25 15:00 PM',
      size: '45-60 MB',
      compression: false,
      encryption: true
    }
  ];

  // Backup history
  const backups = [
    {
      id: 1,
      name: 'full_backup_20260225_0200.sql.gz',
      type: 'Full',
      size: '185.4 GB',
      created: '2026-02-25 02:00:15',
      completed: '2026-02-25 02:45:22',
      duration: '45 min 7 sec',
      status: 'success',
      location: 'AWS S3 /backups/full/',
      checksum: 'sha256: a47d...e92f',
      encryption: 'AES-256',
      compressed: true,
      verified: true
    },
    {
      id: 2,
      name: 'incremental_backup_20260225_1400.sql.gz',
      type: 'Incremental',
      size: '18.2 MB',
      created: '2026-02-25 14:00:03',
      completed: '2026-02-25 14:00:45',
      duration: '42 sec',
      status: 'success',
      location: 'Local + Cloud',
      checksum: 'sha256: b83f...a41c',
      encryption: 'AES-256',
      compressed: true,
      verified: true
    },
    {
      id: 3,
      name: 'full_backup_20260224_0200.sql.gz',
      type: 'Full',
      size: '184.8 GB',
      created: '2026-02-24 02:00:10',
      completed: '2026-02-24 02:44:18',
      duration: '44 min 8 sec',
      status: 'success',
      location: 'AWS S3 /backups/full/',
      checksum: 'sha256: f92e...c73a',
      encryption: 'AES-256',
      compressed: true,
      verified: true
    },
    {
      id: 4,
      name: 'transaction_log_20260225_1430.trn',
      type: 'Transaction Log',
      size: '45.6 MB',
      created: '2026-02-25 14:30:02',
      completed: '2026-02-25 14:30:18',
      duration: '16 sec',
      status: 'success',
      location: 'Local SSD',
      checksum: 'sha256: d41c...8b92',
      encryption: 'AES-256',
      compressed: false,
      verified: true
    },
    {
      id: 5,
      name: 'weekly_archive_20260223_0300.sql.gz',
      type: 'Full',
      size: '185.4 GB',
      created: '2026-02-23 03:00:05',
      completed: '2026-02-23 03:46:32',
      duration: '46 min 27 sec',
      status: 'success',
      location: 'Cold Storage',
      checksum: 'sha256: a73b...f29d',
      encryption: 'AES-256',
      compressed: true,
      verified: true
    },
    {
      id: 6,
      name: 'incremental_backup_20260225_1300.sql.gz',
      type: 'Incremental',
      size: '15.8 MB',
      created: '2026-02-25 13:00:01',
      completed: '2026-02-25 13:00:38',
      duration: '37 sec',
      status: 'success',
      location: 'Local + Cloud',
      checksum: 'sha256: e92f...b83f',
      encryption: 'AES-256',
      compressed: true,
      verified: true
    },
    {
      id: 7,
      name: 'incremental_backup_20260225_1200.sql.gz',
      type: 'Incremental',
      size: '22.4 MB',
      created: '2026-02-25 12:00:02',
      completed: '2026-02-25 12:00:51',
      duration: '49 sec',
      status: 'success',
      location: 'Local + Cloud',
      checksum: 'sha256: c73a...d41c',
      encryption: 'AES-256',
      compressed: true,
      verified: true
    },
    {
      id: 8,
      name: 'full_backup_20260222_0200.sql.gz',
      type: 'Full',
      size: '184.2 GB',
      created: '2026-02-22 02:00:08',
      completed: '2026-02-22 02:43:55',
      duration: '43 min 47 sec',
      status: 'warning',
      location: 'AWS S3 /backups/full/',
      checksum: 'sha256: 8b92...a47d',
      encryption: 'AES-256',
      compressed: true,
      verified: false,
      warning: 'Verification failed, retry scheduled'
    },
    {
      id: 9,
      name: 'incremental_backup_20260225_1100.sql.gz',
      type: 'Incremental',
      size: '12.5 MB',
      created: '2026-02-25 11:00:04',
      completed: '2026-02-25 11:00:29',
      duration: '25 sec',
      status: 'success',
      location: 'Local + Cloud',
      checksum: 'sha256: f29d...b83f',
      encryption: 'AES-256',
      compressed: true,
      verified: true
    },
    {
      id: 10,
      name: 'incremental_backup_20260225_1000.sql.gz',
      type: 'Incremental',
      size: '25.7 MB',
      created: '2026-02-25 10:00:06',
      completed: '2026-02-25 10:00:58',
      duration: '52 sec',
      status: 'failed',
      location: 'Local + Cloud',
      checksum: 'sha256: e92f...c73a',
      encryption: 'AES-256',
      compressed: true,
      verified: false,
      error: 'Network timeout during transfer'
    }
  ];

  // Filter backups based on search and filter
  const filteredBackups = backups.filter(backup => {
    const matchesSearch = backup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backup.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backup.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && backup.status === filter;
  });

  // Filter schedules based on search
  const filteredSchedules = schedules.filter(schedule => {
    return schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           schedule.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
           schedule.destination.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Auto-refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        // Refresh data
        console.log('Auto-refreshing backup data...');
      }, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Handle create backup
  const handleCreateBackup = () => {
    setLoading(true);
    setError(null);
    
    // Simulate backup creation
    setTimeout(() => {
      setLoading(false);
      setSuccess('Backup started successfully!');
      setTimeout(() => setSuccess(null), 3000);
    }, 2000);
  };

  // Handle restore backup
  const handleRestoreBackup = () => {
    setLoading(true);
    setError(null);
    
    // Simulate restore process
    setTimeout(() => {
      setLoading(false);
      setRestoreModal(false);
      setSuccess('Database restore initiated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    }, 2000);
  };

  // Handle delete backup
  const handleDeleteBackup = () => {
    setLoading(true);
    setError(null);
    
    // Simulate deletion
    setTimeout(() => {
      setLoading(false);
      setDeleteModal(false);
      setSuccess('Backup deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    }, 1500);
  };

  // Handle schedule backup
  const handleScheduleBackup = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simulate scheduling
    setTimeout(() => {
      setLoading(false);
      setScheduleModal(false);
      setSuccess('Backup schedule created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    }, 1500);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'paused': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  // Get type color
  const getTypeColor = (type) => {
    switch(type) {
      case 'Full': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Incremental': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Transaction Log': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  // Format file size
  const formatSize = (size) => {
    if (size.includes('GB')) return size;
    if (size.includes('MB')) return size;
    return size;
  };

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
          {stats.map((stat, index) => {
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

        {/* Detailed Stats (Expandable) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setExpandedStats(!expandedStats)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <FiBarChart2 className="w-5 h-5 text-red-600" />
              <span className="font-medium text-gray-900 dark:text-white">Detailed Statistics</span>
            </div>
            {expandedStats ? (
              <FiChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {expandedStats && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {detailedStats.map((stat, index) => {
                  const Icon = stat.icon;
                  const colors = {
                    red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
                    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                    green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                  };
                  return (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${colors[stat.color]} flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
                Backup History
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
                Backup Schedules
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
                    </select>
                  </div>
                )}
                <button className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiDownload className="w-5 h-5" />
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
                  {filteredBackups.map((backup) => (
                    <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FiDatabase className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{backup.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(backup.type)}`}>
                          {backup.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{backup.size}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <FiClock className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{backup.created}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{backup.duration}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{backup.location}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                          {backup.status === 'success' && <FiCheckCircle className="w-3 h-3" />}
                          {backup.status === 'failed' && <FiAlertCircle className="w-3 h-3" />}
                          {backup.status === 'warning' && <FiAlertCircle className="w-3 h-3" />}
                          {backup.status}
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
                            onClick={() => {
                              setSelectedBackup(backup);
                              setDeleteModal(true);
                            }}
                            className="p-1 text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-gray-700" title="More">
                            <FiMoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                  {filteredSchedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FiClock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{schedule.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(schedule.type)}`}>
                          {schedule.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">{schedule.frequency}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{schedule.time}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{schedule.nextRun}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{schedule.retention}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{schedule.destination}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                          {schedule.status === 'active' && <FiCheckCircle className="w-3 h-3" />}
                          {schedule.status === 'paused' && <FiPause className="w-3 h-3" />}
                          {schedule.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1 text-blue-600 hover:text-blue-700" title="Edit">
                            <FiSettings className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:text-green-700" title="Run Now">
                            <FiPlay className="w-4 h-4" />
                          </button>
                          {schedule.status === 'active' ? (
                            <button className="p-1 text-yellow-600 hover:text-yellow-700" title="Pause">
                              <FiPause className="w-4 h-4" />
                            </button>
                          ) : (
                            <button className="p-1 text-green-600 hover:text-green-700" title="Resume">
                              <FiPlay className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing 1 to {activeTab === 'backups' ? filteredBackups.length : filteredSchedules.length} of {activeTab === 'backups' ? backups.length : schedules.length} items
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-1 rounded bg-red-600 text-white text-sm">1</button>
              <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm">2</button>
              <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm">3</button>
              <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm">Next</button>
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
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedBackup.type)}`}>
                      {selectedBackup.type}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBackup.status)}`}>
                      {selectedBackup.status === 'success' && <FiCheckCircle className="w-3 h-3" />}
                      {selectedBackup.status === 'failed' && <FiAlertCircle className="w-3 h-3" />}
                      {selectedBackup.status === 'warning' && <FiAlertCircle className="w-3 h-3" />}
                      {selectedBackup.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Size</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBackup.size}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBackup.duration}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBackup.created}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completed</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedBackup.completed}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBackup.location}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Checksum</p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">{selectedBackup.checksum}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Encryption</p>
                    <FiShield className="w-4 h-4 mx-auto text-green-600" />
                    <p className="text-xs text-gray-900 dark:text-white mt-1">{selectedBackup.encryption}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Compressed</p>
                    {selectedBackup.compressed ? (
                      <FiArchive className="w-4 h-4 mx-auto text-green-600" />
                    ) : (
                      <FiX className="w-4 h-4 mx-auto text-gray-400" />
                    )}
                    <p className="text-xs text-gray-900 dark:text-white mt-1">
                      {selectedBackup.compressed ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Verified</p>
                    {selectedBackup.verified ? (
                      <FiCheckCircle className="w-4 h-4 mx-auto text-green-600" />
                    ) : (
                      <FiAlertCircle className="w-4 h-4 mx-auto text-yellow-600" />
                    )}
                    <p className="text-xs text-gray-900 dark:text-white mt-1">
                      {selectedBackup.verified ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                {selectedBackup.warning && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                      <FiAlertCircle className="w-5 h-5" />
                      <p className="text-sm">{selectedBackup.warning}</p>
                    </div>
                  </div>
                )}

                {selectedBackup.error && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <FiAlertCircle className="w-5 h-5" />
                      <p className="text-sm">{selectedBackup.error}</p>
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
                  onClick={handleDeleteBackup}
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
                      Delete Backup
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full">
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

              <form onSubmit={handleScheduleBackup}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Schedule Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Daily Full Backup"
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
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="full">Full Backup</option>
                        <option value="incremental">Incremental</option>
                        <option value="transaction">Transaction Log</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequency *
                      </label>
                      <select
                        required
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
                        Time *
                      </label>
                      <input
                        type="time"
                        required
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
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="7">7 days</option>
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Destination *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="local">Local Storage</option>
                      <option value="cloud">AWS S3</option>
                      <option value="both">Local + Cloud</option>
                      <option value="cold">Cold Storage</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enable compression</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" defaultChecked />
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
    </SystemAdminLayout>
  );
};

export default DatabaseBackup;