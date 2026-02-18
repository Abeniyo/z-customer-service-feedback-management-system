import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SystemAdminLayout from './SystemAdminLayout';

// Import React Icons
import { 
  FiHome, 
  FiUsers, 
  FiBarChart2, 
  FiSettings,
  FiUser,
  FiActivity,
  FiServer,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiDatabase,
  FiCpu,
  FiHardDrive
} from 'react-icons/fi';

const SystemDashboard = () => {
  const stats = [
    { 
      label: 'Total Users', 
      value: '1,245', 
      icon: FiUsers, 
      change: '+48', 
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400'
    },
    { 
      label: 'Active Sessions', 
      value: '328', 
      icon: FiActivity, 
      change: '+23', 
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      label: 'System Uptime', 
      value: '99.9%', 
      icon: FiServer, 
      change: '+0.1%', 
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      label: 'Security Alerts', 
      value: '3', 
      icon: FiShield, 
      change: '-2', 
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    }
  ];

  const systemHealth = [
    { component: 'Database Server', status: 'healthy', usage: '78%', latency: '12ms', icon: FiDatabase },
    { component: 'API Gateway', status: 'healthy', usage: '45%', latency: '8ms', icon: FiCpu },
    { component: 'Authentication Service', status: 'healthy', usage: '34%', latency: '15ms', icon: FiShield },
    { component: 'Storage Service', status: 'degraded', usage: '92%', latency: '45ms', icon: FiHardDrive },
    { component: 'Cache Server', status: 'healthy', usage: '56%', latency: '3ms', icon: FiServer },
  ];

  const recentActivities = [
    { id: 1, user: 'System Admin', action: 'Created new user', target: 'john.doe@company.com', time: '2 min ago', status: 'success' },
    { id: 2, user: 'System Admin', action: 'Updated security settings', target: 'System Configuration', time: '15 min ago', status: 'success' },
    { id: 3, user: 'Admin User', action: 'Reset password', target: 'jane.smith@company.com', time: '1 hour ago', status: 'success' },
    { id: 4, user: 'System', action: 'Database backup', target: 'PostgreSQL', time: '3 hours ago', status: 'success' },
    { id: 5, user: 'Unknown', action: 'Failed login attempt', target: '192.168.1.105', time: '5 hours ago', status: 'failed' },
  ];

  const userRoles = [
    { role: 'System Admin', count: 3, color: 'red', percentage: 4 },
    { role: 'Admin', count: 12, color: 'blue', percentage: 18 },
    { role: 'Call Center', count: 45, color: 'green', percentage: 66 },
    { role: 'Inactive', count: 8, color: 'gray', percentage: 12 },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'degraded': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'failed': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getActivityStatusColor = (status) => {
    return status === 'success' 
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <SystemAdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">System Overview</h1>
          <p className="text-red-100">All systems are operational with 99.9% uptime</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 group">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  } bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full`}>
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiServer className="text-red-600" />
              System Health
            </h2>
            <div className="space-y-4">
              {systemHealth.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.component}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <span className="text-xs text-gray-500">Usage: {item.usage}</span>
                          <span className="text-xs text-gray-500">Latency: {item.latency}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          parseInt(item.usage) > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: item.usage }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Roles Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiUsers className="text-red-600" />
              User Distribution
            </h2>
            <div className="space-y-4">
              {userRoles.map((role, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{role.role}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{role.count} users</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        role.role === 'System Admin' ? 'bg-red-500' :
                        role.role === 'Admin' ? 'bg-blue-500' :
                        role.role === 'Call Center' ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${role.percentage}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Users</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">68</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiActivity className="text-red-600" />
            Recent System Activities
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Target</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FiUser className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">{activity.user}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{activity.action}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{activity.target}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{activity.time}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getActivityStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/systemadmin/users" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-red-500 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiUsers className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">User Management</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create, edit, disable users</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/systemadmin/audit-logs" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiBarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Audit Logs</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View system activities</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/systemadmin/settings" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiSettings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">System Settings</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configure system parameters</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </SystemAdminLayout>
  );
};

export default SystemDashboard;