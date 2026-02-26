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

  // State for dynamic data
  const [systemStats, setSystemStats] = useState({
    cpu: { usage: 0, cores: 0, temperature: null, loadAverage: [0, 0, 0], status: 'healthy' },
    memory: { total: 0, used: 0, free: 0, percentage: 0, status: 'healthy' },
    disk: { total: 0, used: 0, free: 0, percentage: 0, status: 'healthy', warning: null },
    network: { incoming: 0, outgoing: 0, connections: 0, latency: 0, status: 'healthy' },
    database: { connections: 0, activeQueries: 0, slowQueries: 0, replicationLag: 0, status: 'healthy' },
    security: { active: 0, brute_force: 0, rate_limited: 0, blocked_ips: 0, critical: 0 }
  });

  const [securityEvents, setSecurityEvents] = useState([]);
  const [systemErrors, setSystemErrors] = useState([]);
  const [rateLimitStats, setRateLimitStats] = useState({
    total: 0,
    blocked: 0,
    limited: 0,
    current: 0,
    topEndpoints: [],
    topIPs: []
  });
  
  const [bruteForceStats, setBruteForceStats] = useState({
    total: 0,
    blocked: 0,
    monitored: 0,
    averageAttempts: 0,
    topTargets: [],
    byCountry: []
  });

  const [axesAttempts, setAxesAttempts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [honeypotLogs, setHoneypotLogs] = useState([]);

  // Base API URL - Update this to match your Django server
  const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

  // Helper function to handle API responses
  const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    
    // Check if response is JSON
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || `API request failed with status ${response.status}`);
      }
      return data;
    } else {
      // If not JSON, get the text for debugging
      const text = await response.text();
      if (text.includes('<!doctype html>')) {
        console.error('Received HTML instead of JSON. Endpoint:', response.url);
        throw new Error(`API endpoint not found: ${response.url}. Check if the server is running and the URL is correct.`);
      }
      throw new Error(`Unexpected response type: ${contentType}`);
    }
  };

  // Fetch dashboard overview data
  const fetchDashboardData = async () => {
    try {
      const url = `${API_BASE_URL}/system-health/dashboard/?range=${timeRange}`;
      console.log('Fetching dashboard data from:', url);
      
      const response = await fetch(url);
      const data = await handleResponse(response);
      
      setSystemStats(data);
      return data;
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      throw err;
    }
  };

  // Fetch security events
  const fetchSecurityEvents = async () => {
    try {
      const url = `${API_BASE_URL}/system-health/security-events/?ordering=-timestamp`;
      console.log('Fetching security events from:', url);
      
      const response = await fetch(url);
      const data = await handleResponse(response);
      
      setSecurityEvents(data.results || []);
      return data;
    } catch (err) {
      console.error('Error fetching security events:', err);
      throw err;
    }
  };

  // Fetch system errors
  const fetchSystemErrors = async () => {
    try {
      const url = `${API_BASE_URL}/system-health/system-errors/?ordering=-timestamp`;
      console.log('Fetching system errors from:', url);
      
      const response = await fetch(url);
      const data = await handleResponse(response);
      
      setSystemErrors(data.results || []);
      return data;
    } catch (err) {
      console.error('Error fetching system errors:', err);
      throw err;
    }
  };

  // Fetch security statistics
  const fetchSecurityStats = async () => {
    try {
      const url = `${API_BASE_URL}/system-health/security-events/stats/?range=${timeRange}`;
      console.log('Fetching security stats from:', url);
      
      const response = await fetch(url);
      const data = await handleResponse(response);
      
      setRateLimitStats(data.rate_limit || {
        total: 0, blocked: 0, limited: 0, current: 0, topEndpoints: [], topIPs: []
      });
      setBruteForceStats(data.brute_force || {
        total: 0, blocked: 0, monitored: 0, averageAttempts: 0, topTargets: [], byCountry: []
      });
      return data;
    } catch (err) {
      console.error('Error fetching security stats:', err);
      throw err;
    }
  };

  // Fetch axes attempts
  const fetchAxesAttempts = async () => {
    try {
      const url = `${API_BASE_URL}/system-health/axes-attempts/?ordering=-attempt_time`;
      console.log('Fetching axes attempts from:', url);
      
      const response = await fetch(url);
      const data = await handleResponse(response);
      
      setAxesAttempts(data.results || []);
      return data;
    } catch (err) {
      console.error('Error fetching axes attempts:', err);
      // Don't throw for optional data
      return null;
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    try {
      const url = `${API_BASE_URL}/system-health/audit-logs/?ordering=-timestamp`;
      console.log('Fetching audit logs from:', url);
      
      const response = await fetch(url);
      const data = await handleResponse(response);
      
      setAuditLogs(data.results || []);
      return data;
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      // Don't throw for optional data
      return null;
    }
  };

  // Fetch honeypot logs
  const fetchHoneypotLogs = async () => {
    try {
      const url = `${API_BASE_URL}/system-health/honeypot-logs/?ordering=-timestamp`;
      console.log('Fetching honeypot logs from:', url);
      
      const response = await fetch(url);
      const data = await handleResponse(response);
      
      setHoneypotLogs(data.results || []);
      return data;
    } catch (err) {
      console.error('Error fetching honeypot logs:', err);
      // Don't throw for optional data
      return null;
    }
  };

  // Fetch real-time stats
  const fetchRealtimeStats = async () => {
    try {
      const url = `${API_BASE_URL}/system-health/realtime/`;
      console.log('Fetching realtime stats from:', url);
      
      const response = await fetch(url);
      const data = await handleResponse(response);
      
      // Update events and errors with real-time data
      if (data.events && data.events.length > 0) {
        setSecurityEvents(prev => [...data.events, ...prev].slice(0, 50));
      }
      if (data.errors && data.errors.length > 0) {
        setSystemErrors(prev => [...data.errors, ...prev].slice(0, 30));
      }
      return data;
    } catch (err) {
      console.error('Error fetching realtime stats:', err);
      return null;
    }
  };

  // Block IP
  const blockIP = async (eventId) => {
    try {
      const url = `${API_BASE_URL}/system-health/security-events/${eventId}/block_ip/`;
      console.log('Blocking IP at:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      await handleResponse(response);
      
      setSuccess('IP blocked successfully');
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh data
      fetchSecurityEvents();
      fetchSecurityStats();
    } catch (err) {
      setError('Failed to block IP: ' + err.message);
    }
  };

  // Clear blocked attempts
  const clearBlockedAttempts = async () => {
    try {
      const url = `${API_BASE_URL}/system-health/axes-attempts/clear_blocked/`;
      console.log('Clearing blocked attempts at:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      await handleResponse(response);
      
      setSuccess('Blocked attempts cleared');
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh data
      fetchAxesAttempts();
    } catch (err) {
      setError('Failed to clear blocked attempts: ' + err.message);
    }
  };

  // Fetch all data with better error handling
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test if API is reachable first
      const testUrl = `${API_BASE_URL}/system-health/`;
      console.log('Testing API connection at:', testUrl);
      
      const testResponse = await fetch(testUrl);
      if (!testResponse.ok) {
        throw new Error(`API not reachable. Status: ${testResponse.status}`);
      }
      
      console.log('✅ API connection successful');
      
      // Fetch all data in parallel
      const results = await Promise.allSettled([
        fetchDashboardData(),
        fetchSecurityEvents(),
        fetchSystemErrors(),
        fetchSecurityStats(),
        fetchAxesAttempts(),
        fetchAuditLogs(),
        fetchHoneypotLogs()
      ]);
      
      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length > 0) {
        console.warn(`${failed.length} fetches failed:`, failed);
        if (failed.length === results.length) {
          setError('Failed to fetch any data. Check console for details.');
        } else {
          setSuccess('Some data loaded successfully');
          setTimeout(() => setSuccess(null), 3000);
        }
      } else {
        setSuccess('System health data refreshed');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('❌ API connection failed:', err);
      setError(`Cannot connect to API at ${API_BASE_URL}. Make sure Django server is running on port 8000.`);
    } finally {
      setLoading(false);
    }
  };

  // Test API connection on mount
  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  // Auto-refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchRealtimeStats();
      }, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refreshData = () => {
    fetchAllData();
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'healthy': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'blocked': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'limited': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'monitoring': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'success': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  // Get progress bar color
  const getProgressColor = (percentage) => {
    if (percentage < 60) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
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
              title={autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStats.cpu?.usage || 0}%</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStats.cpu?.status)}`}>
                <FiCheckCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Temperature</span>
                <span className="text-gray-900 dark:text-white">{systemStats.cpu?.temperature || 'N/A'}°C</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Load Average</span>
                <span className="text-gray-900 dark:text-white">
                  {systemStats.cpu?.loadAverage?.join(' / ') || '0 / 0 / 0'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(systemStats.cpu?.usage || 0)}`}
                  style={{ width: `${systemStats.cpu?.usage || 0}%` }}
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemStats.memory?.used?.toFixed(1) || 0} / {systemStats.memory?.total?.toFixed(1) || 0} GB
                  </p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStats.memory?.status)}`}>
                <FiCheckCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Free</span>
                <span className="text-gray-900 dark:text-white">{systemStats.memory?.free?.toFixed(1) || 0} GB</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Usage</span>
                <span className="text-gray-900 dark:text-white">{systemStats.memory?.percentage?.toFixed(1) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(systemStats.memory?.percentage || 0)}`}
                  style={{ width: `${systemStats.memory?.percentage || 0}%` }}
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemStats.disk?.used?.toFixed(1) || 0} / {systemStats.disk?.total?.toFixed(1) || 0} GB
                  </p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStats.disk?.status)}`}>
                <FiAlertCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Free Space</span>
                <span className="text-gray-900 dark:text-white">{systemStats.disk?.free?.toFixed(1) || 0} GB</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Usage</span>
                <span className="text-gray-900 dark:text-white">{systemStats.disk?.percentage?.toFixed(1) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(systemStats.disk?.percentage || 0)}`}
                  style={{ width: `${systemStats.disk?.percentage || 0}%` }}
                ></div>
              </div>
              {systemStats.disk?.warning && (
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStats.network?.connections || 0} connections</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStats.network?.status)}`}>
                <FiCheckCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Incoming</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.network?.incoming?.toFixed(1) || 0} Mbps</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Outgoing</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.network?.outgoing?.toFixed(1) || 0} Mbps</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Latency</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.network?.latency || 0} ms</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Active</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.network?.connections || 0}</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStats.database?.connections || 0} connections</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStats.database?.status)}`}>
                <FiCheckCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Active Queries</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.database?.activeQueries || 0}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Slow Queries</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.database?.slowQueries || 0}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Replication Lag</p>
                <p className="font-medium text-gray-900 dark:text-white">{systemStats.database?.replicationLag || 0}s</p>
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
                  {securityEvents.filter(e => e.event_type === 'brute_force').length}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Rate Limited</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {securityEvents.filter(e => e.event_type === 'rate_limit').length}
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
                {rateLimitStats.topEndpoints?.map((endpoint, index) => (
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
                {rateLimitStats.topEndpoints?.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No rate limit data available</p>
                )}
              </div>

              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Offending IPs</h3>
              <div className="space-y-2">
                {rateLimitStats.topIPs?.map((ip, index) => (
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
                {rateLimitStats.topIPs?.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No IP data available</p>
                )}
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
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{bruteForceStats.averageAttempts?.toFixed(1) || 0}</p>
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Targeted Accounts</h3>
              <div className="space-y-3 mb-6">
                {bruteForceStats.topTargets?.map((target, index) => (
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
                {bruteForceStats.topTargets?.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No brute force data available</p>
                )}
              </div>

              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">By Country</h3>
              <div className="space-y-2">
                {bruteForceStats.byCountry?.map((country, index) => (
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
                {bruteForceStats.byCountry?.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No country data available</p>
                )}
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
                        <span className="text-sm text-gray-600 dark:text-gray-400">{formatTimestamp(event.timestamp)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        event.event_type === 'brute_force' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {event.event_type === 'brute_force' ? <FiLock className="w-3 h-3" /> : <FiZap className="w-3 h-3" />}
                        {event.event_type === 'brute_force' ? 'Brute Force' : 'Rate Limit'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-mono text-gray-900 dark:text-white">{event.source_ip}</p>
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
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {securityEvents.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No security events found
                    </td>
                  </tr>
                )}
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
                        <span className="text-sm text-gray-600 dark:text-gray-400">{formatTimestamp(error.timestamp)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{error.error_type}</span>
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
                {systemErrors.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No system errors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Axes Attempts (Optional Section) */}
        {axesAttempts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiLock className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Failed Login Attempts</h2>
                </div>
                <button
                  onClick={clearBlockedAttempts}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                >
                  Clear Blocked
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Username</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">IP Address</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Attempt Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Failures</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Path</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {axesAttempts.slice(0, 5).map((attempt) => (
                    <tr key={attempt.id}>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{attempt.username}</td>
                      <td className="py-3 px-4 text-sm font-mono text-gray-600 dark:text-gray-400">{attempt.ip_address}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{formatTimestamp(attempt.attempt_time)}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                          {attempt.failures_since_start}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{attempt.path_info}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
                      {selectedEvent.event_type === 'brute_force' ? (
                        <FiLock className="w-4 h-4 text-red-600" />
                      ) : (
                        <FiZap className="w-4 h-4 text-yellow-600" />
                      )}
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedEvent.event_type === 'brute_force' ? 'Brute Force Attack' : 'Rate Limit Exceeded'}
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
                  <p className="font-medium text-gray-900 dark:text-white">{formatTimestamp(selectedEvent.timestamp)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Source IP</p>
                    <p className="font-mono font-medium text-gray-900 dark:text-white">{selectedEvent.source_ip}</p>
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
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-all">{selectedEvent.user_agent}</p>
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
                    <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.action_taken}</p>
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
                <button
                  onClick={() => blockIP(selectedEvent.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FiLock className="w-4 h-4" />
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