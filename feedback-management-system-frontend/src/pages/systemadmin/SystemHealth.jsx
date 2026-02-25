import React, { useState, useEffect } from 'react';
import SystemAdminLayout from './SystemAdminLayout';

// Import React Icons
import { 
  FiActivity,
  FiServer,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiHardDrive,
  FiWifi,
  FiDatabase,
  FiUsers,
  FiLock,
  FiUnlock,
  FiX,
  FiRefreshCw,
  FiBarChart2,
  FiTrendingUp,
  FiTrendingDown,
  FiEye,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  
  FiZap,
  FiGlobe,
  FiKey,
  FiUserX,
  FiUserCheck,
  FiUserPlus,
} from 'react-icons/fi';

const SystemHealth = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // System Health Stats
  const systemStats = {
    cpu: {
      usage: 42,
      cores: 8,
      temperature: 52,
      loadAverage: [2.5, 3.1, 2.8],
      status: 'healthy'
    },
    memory: {
      total: 32,
      used: 18.5,
      free: 13.5,
      percentage: 58,
      status: 'healthy'
    },
    disk: {
      total: 500,
      used: 312,
      free: 188,
      percentage: 62,
      status: 'warning',
      warning: 'Disk usage above 60%'
    },
    network: {
      incoming: 245,
      outgoing: 189,
      connections: 1245,
      latency: 23,
      status: 'healthy'
    },
    database: {
      connections: 42,
      activeQueries: 12,
      slowQueries: 3,
      replicationLag: 0.5,
      status: 'healthy'
    }
  };

  // Security Events (Brute Force Attempts, Rate Limiting)
  const securityEvents = [
    {
      id: 1,
      type: 'brute_force',
      severity: 'critical',
      timestamp: '2026-02-26 14:23:15',
      source: '203.45.67.89',
      target: 'admin@system.com',
      attempts: 15,
      endpoint: '/api/login/',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'blocked',
      action: 'IP Blocked',
      details: 'Multiple failed login attempts detected - 15 attempts in 2 minutes',
      country: 'RU',
      isp: 'Unknown ISP',
      rateLimit: true
    },
    {
      id: 2,
      type: 'rate_limit',
      severity: 'high',
      timestamp: '2026-02-26 13:45:22',
      source: '156.67.218.154',
      target: '/api/data/',
      attempts: 245,
      endpoint: '/api/data/',
      userAgent: 'Python/3.9 aiohttp',
      status: 'limited',
      action: 'Rate Limited',
      details: 'Exceeded rate limit: 245 requests in 1 minute (limit: 100/min)',
      country: 'NL',
      isp: 'DigitalOcean',
      rateLimit: true
    },
    {
      id: 3,
      type: 'brute_force',
      severity: 'high',
      timestamp: '2026-02-26 12:15:08',
      source: '45.227.253.84',
      target: 'root@system.com',
      attempts: 8,
      endpoint: '/api/admin/login/',
      userAgent: 'Mozilla/5.0 (compatible; Nmap Scripting Engine)',
      status: 'blocked',
      action: 'IP Blocked',
      details: 'Suspicious admin login attempts detected',
      country: 'CN',
      isp: 'Unknown ISP',
      rateLimit: false
    },
    {
      id: 4,
      type: 'rate_limit',
      severity: 'medium',
      timestamp: '2026-02-26 11:30:45',
      source: '192.168.1.105',
      target: '/api/search/',
      attempts: 78,
      endpoint: '/api/search/',
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1)',
      status: 'monitoring',
      action: 'Monitoring',
      details: 'High request rate from legitimate crawler - under monitoring',
      country: 'US',
      isp: 'Google Cloud',
      rateLimit: true
    },
    {
      id: 5,
      type: 'brute_force',
      severity: 'critical',
      timestamp: '2026-02-26 10:05:33',
      source: '103.152.36.78',
      target: 'multiple',
      attempts: 342,
      endpoint: '/api/login/',
      userAgent: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
      status: 'blocked',
      action: 'IP Blocked - Permanent',
      details: 'Distributed brute force attack detected across multiple accounts',
      country: 'VN',
      isp: 'Viettel',
      rateLimit: true
    },
    {
      id: 6,
      type: 'rate_limit',
      severity: 'critical',
      timestamp: '2026-02-26 09:20:19',
      source: '185.191.171.45',
      target: '/api/auth/',
      attempts: 567,
      endpoint: '/api/auth/',
      userAgent: 'Go-http-client/1.1',
      status: 'blocked',
      action: 'IP Blocked',
      details: 'DDoS attempt - 567 requests per minute targeting auth endpoint',
      country: 'UA',
      isp: 'Hostinger',
      rateLimit: true
    }
  ];

  // System Errors
  const systemErrors = [
    {
      id: 1,
      type: 'database',
      severity: 'high',
      timestamp: '2026-02-26 14:15:23',
      source: 'PostgreSQL',
      message: 'Connection pool exhausted',
      details: 'Maximum connections reached (100/100)',
      status: 'resolved',
      resolvedAt: '2026-02-26 14:18:45',
      duration: '3m 22s'
    },
    {
      id: 2,
      type: 'api',
      severity: 'medium',
      timestamp: '2026-02-26 13:22:10',
      source: 'Redis Cache',
      message: 'Cache miss rate > 90%',
      details: 'Cache efficiency dropping - 92% miss rate in last 5 minutes',
      status: 'monitoring',
      resolvedAt: null
    },
    {
      id: 3,
      type: 'network',
      severity: 'low',
      timestamp: '2026-02-26 12:05:47',
      source: 'Load Balancer',
      message: 'High latency detected',
      details: 'Response time > 500ms for 2% of requests',
      status: 'resolved',
      resolvedAt: '2026-02-26 12:15:30',
      duration: '9m 43s'
    },
    {
      id: 4,
      type: 'security',
      severity: 'critical',
      timestamp: '2026-02-26 11:30:00',
      source: 'WAF',
      message: 'SQL injection attempt blocked',
      details: 'Blocked 15 SQL injection attempts from IP 45.227.253.84',
      status: 'resolved',
      resolvedAt: '2026-02-26 11:30:05',
      duration: '5s'
    },
    {
      id: 5,
      type: 'application',
      severity: 'medium',
      timestamp: '2026-02-26 10:45:12',
      source: 'Celery Worker',
      message: 'Task queue backlog',
      details: '12,345 pending tasks - worker scaling triggered',
      status: 'monitoring',
      resolvedAt: null
    }
  ];

  // Rate Limit Stats
  const rateLimitStats = {
    total: 1567,
    blocked: 234,
    limited: 1245,
    current: 88,
    topEndpoints: [
      { endpoint: '/api/login/', count: 456, blocked: 89 },
      { endpoint: '/api/auth/', count: 345, blocked: 67 },
      { endpoint: '/api/data/', count: 234, blocked: 34 },
      { endpoint: '/api/search/', count: 189, blocked: 23 },
      { endpoint: '/api/export/', count: 156, blocked: 21 }
    ],
    topIPs: [
      { ip: '203.45.67.89', count: 567, blocked: true },
      { ip: '185.191.171.45', count: 456, blocked: true },
      { ip: '45.227.253.84', count: 345, blocked: true },
      { ip: '103.152.36.78', count: 234, blocked: true },
      { ip: '156.67.218.154', count: 189, blocked: false }
    ]
  };

  // Brute Force Stats
  const bruteForceStats = {
    total: 892,
    blocked: 567,
    monitored: 325,
    averageAttempts: 12.4,
    topTargets: [
      { target: 'admin@system.com', attempts: 234, blocked: true },
      { target: 'root@system.com', attempts: 156, blocked: true },
      { target: 'multiple', attempts: 342, blocked: true },
      { target: 'user@company.com', attempts: 89, blocked: false },
      { target: 'support@system.com', attempts: 71, blocked: false }
    ],
    byCountry: [
      { country: 'RU', count: 342 },
      { country: 'CN', count: 234 },
      { country: 'VN', count: 156 },
      { country: 'UA', count: 89 },
      { country: 'NL', count: 71 }
    ]
  };

  // Auto-refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshData();
      }, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refreshData = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
      setSuccess('System health data refreshed');
      setTimeout(() => setSuccess(null), 3000);
    }, 1500);
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'blocked': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'limited': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'monitoring': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  // Get progress bar color
  const getProgressColor = (percentage) => {
    if (percentage < 60) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <SystemAdminLayout>
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Health</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Real-time system monitoring and security events</p>
          </div>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
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
              onClick={refreshData}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <FiActivity className="w-4 h-4" />
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

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

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CPU Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <FiCpu className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CPU Usage</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStats.cpu.usage}%</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStats.cpu.status)}`}>
                <FiCheckCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Temperature</span>
                <span className="text-gray-900 dark:text-white">{systemStats.cpu.temperature}°C</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Load Average</span>
                <span className="text-gray-900 dark:text-white">
                  {systemStats.cpu.loadAverage.join(' / ')}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(systemStats.cpu.usage)}`}
                  style={{ width: `${systemStats.cpu.usage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Memory Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FiServer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Memory</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStats.memory.used} / {systemStats.memory.total} GB</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStats.memory.status)}`}>
                <FiCheckCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Free</span>
                <span className="text-gray-900 dark:text-white">{systemStats.memory.free} GB</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Usage</span>
                <span className="text-gray-900 dark:text-white">{systemStats.memory.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(systemStats.memory.percentage)}`}
                  style={{ width: `${systemStats.memory.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Disk Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <FiHardDrive className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Disk Usage</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStats.disk.used} / {systemStats.disk.total} GB</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStats.disk.status)}`}>
                <FiAlertCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Free Space</span>
                <span className="text-gray-900 dark:text-white">{systemStats.disk.free} GB</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Usage</span>
                <span className="text-gray-900 dark:text-white">{systemStats.disk.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(systemStats.disk.percentage)}`}
                  style={{ width: `${systemStats.disk.percentage}%` }}
                ></div>
              </div>
              {systemStats.disk.warning && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  ⚠️ {systemStats.disk.warning}
                </p>
              )}
            </div>
          </div>

          {/* Network Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FiWifi className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Network</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStats.network.connections} connections</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStats.network.status)}`}>
                <FiCheckCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Incoming</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.network.incoming} Mbps</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Outgoing</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.network.outgoing} Mbps</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Latency</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.network.latency} ms</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Active</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.network.connections}</p>
              </div>
            </div>
          </div>

          {/* Database Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <FiDatabase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Database</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStats.database.connections} connections</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStats.database.status)}`}>
                <FiCheckCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Active Queries</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.database.activeQueries}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Slow Queries</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.database.slowQueries}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Replication Lag</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.database.replicationLag}s</p>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <FiShield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Security Events</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityEvents.length} active</p>
                </div>
              </div>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                <FiAlertCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Brute Force</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {securityEvents.filter(e => e.type === 'brute_force').length}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Rate Limited</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {securityEvents.filter(e => e.type === 'rate_limit').length}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Blocked IPs</p>
                <p className="font-medium text-gray-900 dark:text-white">{rateLimitStats.blocked}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Critical</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {securityEvents.filter(e => e.severity === 'critical').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limit & Brute Force Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rate Limit Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiZap className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Rate Limiting Statistics</h2>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Last {timeRange}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Limited</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{rateLimitStats.total}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Currently Limited</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{rateLimitStats.current}</p>
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Targeted Endpoints</h3>
              <div className="space-y-3 mb-6">
                {rateLimitStats.topEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{endpoint.endpoint}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div 
                            className="h-1.5 bg-yellow-500 rounded-full"
                            style={{ width: `${(endpoint.count / 500) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{endpoint.count}</p>
                      <p className="text-xs text-red-600">{endpoint.blocked} blocked</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Offending IPs</h3>
              <div className="space-y-2">
                {rateLimitStats.topIPs.map((ip, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FiGlobe className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{ip.ip}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 dark:text-gray-400">{ip.count}</span>
                      {ip.blocked ? (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs">
                          Blocked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs">
                          Limited
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Brute Force Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiLock className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Brute Force Attempts</h2>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Last {timeRange}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{bruteForceStats.total}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Blocked</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">{bruteForceStats.blocked}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Attempts</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{bruteForceStats.averageAttempts}</p>
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Targeted Accounts</h3>
              <div className="space-y-3 mb-6">
                {bruteForceStats.topTargets.map((target, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{target.target}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{target.attempts} attempts</p>
                    </div>
                    {target.blocked ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs">
                        Blocked
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs">
                        Monitoring
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">By Country</h3>
              <div className="space-y-2">
                {bruteForceStats.byCountry.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 dark:text-white">{country.country}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{country.count}</span>
                      <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className="h-1.5 bg-red-500 rounded-full"
                          style={{ width: `${(country.count / 400) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security Events Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiShield className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security Events</h2>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiFilter className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiDownload className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Severity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Source IP</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Target</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Attempts</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {securityEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FiClock className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{event.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        event.type === 'brute_force' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {event.type === 'brute_force' ? <FiLock className="w-3 h-3" /> : <FiZap className="w-3 h-3" />}
                        {event.type === 'brute_force' ? 'Brute Force' : 'Rate Limit'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-mono text-gray-900 dark:text-white">{event.source}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{event.country}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{event.target}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{event.attempts}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
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
        </div>

        {/* System Errors */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Errors & Warnings</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Severity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Source</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Message</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {systemErrors.map((error) => (
                  <tr key={error.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FiClock className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{error.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{error.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(error.severity)}`}>
                        {error.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-900 dark:text-white">{error.source}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{error.message}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(error.status)}`}>
                        {error.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{error.duration || '-'}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {viewModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Event Details</h2>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Event Type</p>
                    <div className="flex items-center gap-2">
                      {selectedEvent.type === 'brute_force' ? (
                        <FiLock className="w-4 h-4 text-red-600" />
                      ) : (
                        <FiZap className="w-4 h-4 text-yellow-600" />
                      )}
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedEvent.type === 'brute_force' ? 'Brute Force Attack' : 'Rate Limit Exceeded'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Severity</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedEvent.severity)}`}>
                      {selectedEvent.severity}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Timestamp</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.timestamp}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Source IP</p>
                    <p className="font-mono font-medium text-gray-900 dark:text-white">{selectedEvent.source}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedEvent.country} • {selectedEvent.isp}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Target</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.target}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedEvent.endpoint}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">User Agent</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-all">{selectedEvent.userAgent}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Details</p>
                  <p className="text-gray-700 dark:text-gray-300">{selectedEvent.details}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Attempts</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedEvent.attempts}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Action</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.action}</p>
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
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Block IP Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SystemAdminLayout>
  );
};

export default SystemHealth;