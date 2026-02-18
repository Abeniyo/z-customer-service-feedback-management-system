import React, { useState } from 'react';
import SystemAdminLayout from './SystemAdminLayout';

// Import React Icons
import { 
  FiBarChart2, 
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiEye,
  FiX,
  FiDownload,
  FiUser,
  FiMail,
  FiActivity
} from 'react-icons/fi';

const SystemAuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [selectedLog, setSelectedLog] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const auditLogs = [
    { 
      id: 1, 
      timestamp: '2026-02-17 09:23:15', 
      user: 'System Admin',
      email: 'admin@system.com',
      action: 'User Created',
      target: 'john.doe@company.com',
      details: 'Created new user with role: admin',
      ipAddress: '192.168.1.100',
      status: 'success',
      category: 'user_management'
    },
    { 
      id: 2, 
      timestamp: '2026-02-17 10:45:22', 
      user: 'System Admin',
      email: 'admin@system.com',
      action: 'Password Reset',
      target: 'jane.smith@company.com',
      details: 'Password reset requested and completed',
      ipAddress: '192.168.1.101',
      status: 'success',
      category: 'security'
    },
    { 
      id: 3, 
      timestamp: '2026-02-17 11:12:08', 
      user: 'System Admin',
      email: 'admin@system.com',
      action: 'User Deactivated',
      target: 'bob.johnson@company.com',
      details: 'User account deactivated due to inactivity',
      ipAddress: '192.168.1.100',
      status: 'success',
      category: 'user_management'
    },
    { 
      id: 4, 
      timestamp: '2026-02-17 14:30:45', 
      user: 'Unknown',
      email: 'unknown@attempt.com',
      action: 'Login Attempt',
      target: 'Failed Login',
      details: 'Multiple failed login attempts detected',
      ipAddress: '203.45.67.89',
      status: 'failed',
      category: 'security'
    },
    { 
      id: 5, 
      timestamp: '2026-02-17 09:05:33', 
      user: 'Admin User',
      email: 'admin@company.com',
      action: 'Report Generated',
      target: 'Monthly Performance Report',
      details: 'Generated monthly report for February 2026',
      ipAddress: '192.168.1.105',
      status: 'success',
      category: 'reporting'
    },
    { 
      id: 6, 
      timestamp: '2026-02-17 16:20:19', 
      user: 'System Admin',
      email: 'admin@system.com',
      action: 'Settings Changed',
      target: 'Security Settings',
      details: 'Updated password policy and MFA settings',
      ipAddress: '192.168.1.100',
      status: 'success',
      category: 'configuration'
    }
  ];

  const stats = [
    { label: 'Total Events', value: '12,847', icon: FiBarChart2, change: '+342', color: 'red' },
    { label: 'Security Events', value: '234', icon: FiShield, change: '-12', color: 'blue' },
    { label: 'Failed Attempts', value: '45', icon: FiAlertCircle, change: '+3', color: 'yellow' },
    { label: 'Success Rate', value: '98.5%', icon: FiCheckCircle, change: '+0.5%', color: 'green' }
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ipAddress.includes(searchTerm);
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && log.category === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'security': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'user_management': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'configuration': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'reporting': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <SystemAdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = {
              red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
              blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
              yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
              green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
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
                    <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} vs yesterday
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs by user, action, IP address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                           appearance-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="security">Security</option>
                  <option value="user_management">User Management</option>
                  <option value="configuration">Configuration</option>
                  <option value="reporting">Reporting</option>
                </select>
              </div>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select 
                  value={dateRange} 
                  onChange={(e) => setDateRange(e.target.value)}
                  className="pl-10 pr-8 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                           appearance-none cursor-pointer"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              <button className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiDownload className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Action</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Target</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">IP Address</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{log.user}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{log.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{log.action}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{log.target}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(log.category)}`}>
                        {log.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{log.ipAddress}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                        {log.status === 'success' && <FiCheckCircle className="w-3 h-3" />}
                        {log.status === 'failed' && <FiAlertCircle className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => {
                          setSelectedLog(log);
                          setViewModal(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing 1 to {filteredLogs.length} of {auditLogs.length} events
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

      {/* View Log Details Modal */}
      {viewModal && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Event Details</h2>
                <button
                  onClick={() => setViewModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Timestamp</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedLog.timestamp}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status === 'success' && <FiCheckCircle className="w-3 h-3" />}
                      {selectedLog.status === 'failed' && <FiAlertCircle className="w-3 h-3" />}
                      {selectedLog.status}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">User</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedLog.user}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLog.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Action</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedLog.action}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedLog.category)}`}>
                      {selectedLog.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Target</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedLog.target}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Details</p>
                  <p className="text-gray-700 dark:text-gray-300">{selectedLog.details}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">IP Address</p>
                    <p className="font-mono text-gray-900 dark:text-white">{selectedLog.ipAddress}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Event ID</p>
                    <p className="font-mono text-gray-900 dark:text-white">LOG-{selectedLog.id.toString().padStart(6, '0')}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                  <FiDownload className="w-4 h-4" />
                  Export Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SystemAdminLayout>
  );
};

export default SystemAuditLogs;