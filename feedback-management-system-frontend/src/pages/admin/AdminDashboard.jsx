import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';

// Import React Icons
import { 
  FiUsers, 
  FiPhoneCall, 
  FiStar, 
  FiClock,
  FiTrendingUp,
  FiBarChart2,
  FiEye,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';

const AdminDashboard = () => {
  const stats = [
    { 
      label: 'Total Agents', 
      value: '24', 
      icon: FiUsers, 
      change: '+3', 
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      label: 'Active Calls', 
      value: '156', 
      icon: FiPhoneCall, 
      change: '+12%', 
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      label: 'Avg Rating', 
      value: '4.8', 
      icon: FiStar, 
      change: '+0.2', 
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    { 
      label: 'Response Time', 
      value: '2.4m', 
      icon: FiClock, 
      change: '-0.3m', 
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const recentAgents = [
    { id: 1, name: 'Jane Smith', email: 'jane.smith@company.com', status: 'online', calls: 45, rating: 4.9 },
    { id: 2, name: 'John Doe', email: 'john.doe@company.com', status: 'busy', calls: 38, rating: 4.7 },
    { id: 3, name: 'Mike Johnson', email: 'mike.j@company.com', status: 'offline', calls: 42, rating: 4.8 },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.w@company.com', status: 'online', calls: 51, rating: 5.0 },
  ];

  const performanceData = [
    { day: 'Mon', calls: 145, resolved: 132 },
    { day: 'Tue', calls: 152, resolved: 140 },
    { day: 'Wed', calls: 168, resolved: 155 },
    { day: 'Thu', calls: 175, resolved: 162 },
    { day: 'Fri', calls: 190, resolved: 178 },
    { day: 'Sat', calls: 120, resolved: 110 },
    { day: 'Sun', calls: 98, resolved: 90 },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const quickActions = [
    { 
      path: '/admin/agents', 
      label: 'Manage Agents', 
      description: '24 active agents',
      icon: FiUsers, 
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      path: '/admin/reports', 
      label: 'View Reports', 
      description: 'Performance analytics',
      icon: FiBarChart2, 
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      path: '/admin/analytics', 
      label: 'Analytics', 
      description: 'Deep insights',
      icon: FiTrendingUp, 
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h1>
          <p className="text-blue-100">Here's your team's performance overview</p>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.path} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${action.textColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{action.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Performance</h2>
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiDownload className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiRefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {performanceData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center gap-1">
                  <div 
                    className="w-4 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${(item.calls / 200) * 160}px` }}
                  ></div>
                  <div 
                    className="w-4 bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                    style={{ height: `${(item.resolved / 200) * 160}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Calls</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
            </div>
          </div>
        </div>

        {/* Recent Agents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Agents</h2>
            <Link to="/admin/agents" className="text-sm text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Agent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Calls</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Rating</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentAgents.map((agent) => (
                  <tr key={agent.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{agent.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${getStatusColor(agent.status)} rounded-full`}></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{agent.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{agent.calls}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{agent.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button className="p-1 text-blue-600 hover:text-blue-700">
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;