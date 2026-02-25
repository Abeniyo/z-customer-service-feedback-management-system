import React, { useState, useEffect } from 'react';
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
  FiHardDrive,
  FiRefreshCw,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreVertical,
  FiDownload,
  FiCalendar,
  FiEye,
  FiUserPlus,
  FiUserCheck,
  FiUserX,
  FiZap,
  FiGlobe
} from 'react-icons/fi';

const SystemDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [expandedActivity, setExpandedActivity] = useState(null);

  // Simulated live data updates
  const [liveStats, setLiveStats] = useState({
    users: '1,245',
    sessions: '328',
    uptime: '99.9',
    alerts: '3'
  });

  // Stats with enhanced data
  const stats = [
    { 
      id: 'users',
      label: 'Total Users', 
      value: liveStats.users, 
      icon: FiUsers, 
      change: '+48', 
      changePercent: '+3.8%',
      trend: 'up',
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      details: '12 new this hour'
    },
    { 
      id: 'sessions',
      label: 'Active Sessions', 
      value: liveStats.sessions, 
      icon: FiActivity, 
      change: '+23', 
      changePercent: '+7.5%',
      trend: 'up',
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      details: 'Peak: 412 at 14:30'
    },
    { 
      id: 'uptime',
      label: 'System Uptime', 
      value: `${liveStats.uptime}%`, 
      icon: FiServer, 
      change: '+0.1%', 
      changePercent: '+0.1%',
      trend: 'up',
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      details: '45 days since last restart'
    },
    { 
      id: 'alerts',
      label: 'Security Alerts', 
      value: liveStats.alerts, 
      icon: FiShield, 
      change: '-2', 
      changePercent: '-40%',
      trend: 'down',
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      details: '2 critical, 1 warning'
    }
  ];

  // Enhanced system health data
  const systemHealth = [
    { 
      component: 'Database Server', 
      status: 'healthy', 
      usage: '78', 
      latency: '12', 
      icon: FiDatabase,
      metrics: { connections: 42, queries: 156, cache: '94%' }
    },
    { 
      component: 'API Gateway', 
      status: 'healthy', 
      usage: '45', 
      latency: '8', 
      icon: FiCpu,
      metrics: { requests: '2.3k/min', errors: 0, p99: '45ms' }
    },
    { 
      component: 'Authentication Service', 
      status: 'healthy', 
      usage: '34', 
      latency: '15', 
      icon: FiShield,
      metrics: { logins: '156/min', mfa: '89%', failures: 3 }
    },
    { 
      component: 'Storage Service', 
      status: 'degraded', 
      usage: '92', 
      latency: '45', 
      icon: FiHardDrive,
      metrics: { used: '312GB', free: '188GB', iops: 2345 }
    },
    { 
      component: 'Cache Server', 
      status: 'healthy', 
      usage: '56', 
      latency: '3', 
      icon: FiServer,
      metrics: { hitRate: '98%', keys: '12.4k', memory: '1.2GB' }
    },
  ];

  // Enhanced recent activities
  const recentActivities = [
    { 
      id: 1, 
      user: 'System Admin', 
      action: 'Created new user', 
      target: 'john.doe@company.com', 
      time: '2 min ago',
      timestamp: '2026-02-26 14:23:15',
      ip: '192.168.1.100',
      status: 'success',
      details: 'User created with Call Center role'
    },
    { 
      id: 2, 
      user: 'System Admin', 
      action: 'Updated security settings', 
      target: 'System Configuration', 
      time: '15 min ago',
      timestamp: '2026-02-26 14:10:22',
      ip: '192.168.1.100',
      status: 'success',
      details: 'Password policy updated to require MFA'
    },
    { 
      id: 3, 
      user: 'Admin User', 
      action: 'Reset password', 
      target: 'jane.smith@company.com', 
      time: '1 hour ago',
      timestamp: '2026-02-26 13:25:08',
      ip: '192.168.1.105',
      status: 'success',
      details: 'Password reset requested via email'
    },
    { 
      id: 4, 
      user: 'System', 
      action: 'Database backup', 
      target: 'PostgreSQL', 
      time: '3 hours ago',
      timestamp: '2026-02-26 11:30:45',
      ip: 'localhost',
      status: 'success',
      details: 'Full backup completed: 185.4 GB in 45 min'
    },
    { 
      id: 5, 
      user: 'Unknown', 
      action: 'Failed login attempt', 
      target: '203.45.67.89', 
      time: '5 hours ago',
      timestamp: '2026-02-26 09:15:33',
      ip: '203.45.67.89',
      status: 'failed',
      details: '15 attempts from IP (blocked)'
    },
  ];

  // User roles with more details
  const userRoles = [
    { role: 'System Admin', count: 3, color: 'red', percentage: 4, icon: FiUserCheck, active: 3 },
    { role: 'Admin', count: 12, color: 'blue', percentage: 18, icon: FiUser, active: 11 },
    { role: 'Call Center', count: 45, color: 'green', percentage: 66, icon: FiUsers, active: 42 },
    { role: 'Inactive', count: 8, color: 'gray', percentage: 12, icon: FiUserX, active: 0 },
  ];

  // System performance metrics
  const performanceMetrics = [
    { label: 'Avg Response Time', value: '124ms', change: '-12ms', trend: 'down', icon: FiZap },
    { label: 'Error Rate', value: '0.02%', change: '-0.01%', trend: 'down', icon: FiAlertCircle },
    { label: 'Request Volume', value: '2.3k/min', change: '+12%', trend: 'up', icon: FiGlobe },
    { label: 'Cache Hit Rate', value: '98.5%', change: '+2.1%', trend: 'up', icon: FiDatabase },
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        users: (parseInt(prev.users.replace(',', '')) + Math.floor(Math.random() * 3)).toLocaleString(),
        sessions: (parseInt(prev.sessions) + Math.floor(Math.random() * 5)).toString(),
        uptime: (99.9 + (Math.random() * 0.1 - 0.05)).toFixed(1),
        alerts: (Math.max(0, parseInt(prev.alerts) + (Math.random() > 0.7 ? 1 : -1))).toString()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

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

  const getTrendIcon = (trend) => {
    return trend === 'up' 
      ? <FiTrendingUp className="w-3 h-3 text-green-600" />
      : <FiTrendingDown className="w-3 h-3 text-red-600" />;
  };

  return (
    <SystemAdminLayout>
      <div className="space-y-6">
        {/* Welcome Section with Time Range Selector */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">System Overview</h1>
              <p className="text-red-100">All systems are operational with {liveStats.uptime}% uptime</p>
            </div>
            <div className="flex gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <button
                onClick={handleRefresh}
                className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
              >
                <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid with Hover Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isHovered = hoveredStat === stat.id;
            return (
              <div 
                key={stat.id}
                onMouseEnter={() => setHoveredStat(stat.id)}
                onMouseLeave={() => setHoveredStat(null)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 group relative overflow-hidden"
              >
                {/* Animated background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000`} />
                
                <div className="flex items-center justify-between">
                  <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      stat.trend === 'up' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'
                    }`}>
                      {getTrendIcon(stat.trend)}
                      <span className="ml-1">{stat.changePercent}</span>
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                  
                  {/* Expanded details on hover */}
                  {isHovered && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{stat.details}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">{metric.label}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{metric.value}</span>
                <span className={`text-xs flex items-center gap-1 ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getTrendIcon(metric.trend)}
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health with Expandable Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiServer className="text-red-600" />
              System Health
            </h2>
            <div className="space-y-4">
              {systemHealth.map((item, index) => {
                const Icon = item.icon;
                const isExpanded = expandedActivity === `health-${index}`;
                return (
                  <div key={index}>
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setExpandedActivity(isExpanded ? null : `health-${index}`)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 dark:text-white">{item.component}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">Usage: {item.usage}%</span>
                            <span className="text-xs text-gray-500">Latency: {item.latency}ms</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            parseInt(item.usage) > 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${item.usage}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Expanded metrics */}
                    {isExpanded && (
                      <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg ml-8 animate-fadeIn">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {Object.entries(item.metrics).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-gray-500 dark:text-gray-400 capitalize">{key}</p>
                              <p className="font-medium text-gray-900 dark:text-white">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Roles Distribution with Active Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiUsers className="text-red-600" />
              User Distribution
            </h2>
            <div className="space-y-4">
              {userRoles.map((role, index) => {
                const Icon = role.icon;
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${
                          role.role === 'System Admin' ? 'text-red-500' :
                          role.role === 'Admin' ? 'text-blue-500' :
                          role.role === 'Call Center' ? 'text-green-500' : 'text-gray-500'
                        }`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{role.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{role.count} users</span>
                        <span className="text-xs text-green-600">({role.active} active)</span>
                      </div>
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
                );
              })}

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Users</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">68</span>
                    <span className="text-xs text-green-600 ml-2">56 active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities with Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiActivity className="text-red-600" />
              Recent System Activities
            </h2>
            <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
              <FiEye className="w-4 h-4" />
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Target</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">IP Address</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400"></th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FiUser className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">{activity.user}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{activity.action}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{activity.target}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{activity.time}</td>
                      <td className="py-3 px-4 text-sm font-mono text-gray-500">{activity.ip}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getActivityStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FiMoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    {expandedActivity === activity.id && (
                      <tr className="bg-gray-50 dark:bg-gray-700/30">
                        <td colSpan="7" className="py-3 px-8">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="font-medium mb-1">Details:</p>
                            <p>{activity.details}</p>
                            <p className="text-xs text-gray-500 mt-1">Timestamp: {activity.timestamp}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions with Icons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/systemadmin/users" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-red-500 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-transparent transition-all duration-500" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiUsers className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">User Management</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create, edit, disable users</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <FiUserPlus className="w-3 h-3" />
                <span>3 pending approvals</span>
              </div>
            </div>
          </Link>

          <Link to="/systemadmin/audit-logs" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-all duration-500" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiBarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Audit Logs</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View system activities</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <FiActivity className="w-3 h-3" />
                <span>156 events today</span>
              </div>
            </div>
          </Link>

          <Link to="/systemadmin/backups" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-transparent transition-all duration-500" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiDatabase className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Backups</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Database backups</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <FiCheckCircle className="w-3 h-3 text-green-500" />
                <span>Last backup: 2 hours ago</span>
              </div>
            </div>
          </Link>

          <Link to="/systemadmin/settings" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-all duration-500" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiSettings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">System Settings</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configure parameters</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <FiShield className="w-3 h-3" />
                <span>Security audit pending</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </SystemAdminLayout>
  );
};

export default SystemDashboard;