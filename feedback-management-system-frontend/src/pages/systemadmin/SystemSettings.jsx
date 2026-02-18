import React, { useState } from 'react';
import SystemAdminLayout from './SystemAdminLayout';

// Import React Icons
import { 
  FiSettings, 
  FiShield, 
  FiLock, 
  FiDatabase,
  FiMail,
  FiGlobe,
  FiSave,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiSun,
  FiMoon
} from 'react-icons/fi';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState({});

  const tabs = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'authentication', label: 'Authentication', icon: FiLock },
    { id: 'database', label: 'Database', icon: FiDatabase },
    { id: 'email', label: 'Email', icon: FiMail },
    { id: 'api', label: 'API', icon: FiGlobe },
  ];

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'FeedbackFlow',
    siteUrl: 'https://feedbackflow.com',
    adminEmail: 'admin@feedbackflow.com',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    maintenanceMode: false,
    debugMode: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    lockoutDuration: '15',
    passwordExpiry: '90',
    mfaRequired: true,
    ipWhitelisting: false,
    rateLimiting: true,
    bruteForceProtection: true
  });

  const [authSettings, setAuthSettings] = useState({
    allowRegistration: false,
    emailVerification: true,
    passwordMinLength: '8',
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: true,
    socialLogin: false,
    ssoEnabled: false
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    dbHost: 'localhost',
    dbPort: '5432',
    dbName: 'feedbackflow_db',
    dbUser: 'postgres',
    dbPassword: '********',
    backupEnabled: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: '30'
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'noreply@feedbackflow.com',
    smtpPassword: '********',
    encryption: 'tls',
    fromEmail: 'noreply@feedbackflow.com',
    fromName: 'FeedbackFlow',
    emailVerification: true
  });

  const [apiSettings, setApiSettings] = useState({
    apiEnabled: true,
    apiVersion: 'v1',
    rateLimit: '1000',
    rateLimitPeriod: 'hour',
    jwtExpiry: '60',
    refreshTokenExpiry: '7',
    corsEnabled: true,
    allowedOrigins: 'http://localhost:5173,https://app.feedbackflow.com'
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={generalSettings.siteName}
            onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Site URL
          </label>
          <input
            type="url"
            value={generalSettings.siteUrl}
            onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Admin Email
          </label>
          <input
            type="email"
            value={generalSettings.adminEmail}
            onChange={(e) => setGeneralSettings({...generalSettings, adminEmail: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timezone
          </label>
          <select
            value={generalSettings.timezone}
            onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="CST">Central Time</option>
            <option value="MST">Mountain Time</option>
            <option value="PST">Pacific Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Format
          </label>
          <select
            value={generalSettings.dateFormat}
            onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time Format
          </label>
          <select
            value={generalSettings.timeFormat}
            onChange={(e) => setGeneralSettings({...generalSettings, timeFormat: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="24h">24 Hour</option>
            <option value="12h">12 Hour</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Maintenance Mode</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Put the site in maintenance mode</p>
          </div>
          <button
            onClick={() => setGeneralSettings({...generalSettings, maintenanceMode: !generalSettings.maintenanceMode})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              generalSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                generalSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Debug Mode</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enable debug mode for development</p>
          </div>
          <button
            onClick={() => setGeneralSettings({...generalSettings, debugMode: !generalSettings.debugMode})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              generalSettings.debugMode ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                generalSettings.debugMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={securitySettings.sessionTimeout}
            onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={securitySettings.maxLoginAttempts}
            onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lockout Duration (minutes)
          </label>
          <input
            type="number"
            value={securitySettings.lockoutDuration}
            onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password Expiry (days)
          </label>
          <input
            type="number"
            value={securitySettings.passwordExpiry}
            onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">MFA Required</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Require multi-factor authentication</p>
          </div>
          <button
            onClick={() => setSecuritySettings({...securitySettings, mfaRequired: !securitySettings.mfaRequired})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              securitySettings.mfaRequired ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                securitySettings.mfaRequired ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Rate Limiting</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enable API rate limiting</p>
          </div>
          <button
            onClick={() => setSecuritySettings({...securitySettings, rateLimiting: !securitySettings.rateLimiting})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              securitySettings.rateLimiting ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                securitySettings.rateLimiting ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Brute Force Protection</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Block repeated failed attempts</p>
          </div>
          <button
            onClick={() => setSecuritySettings({...securitySettings, bruteForceProtection: !securitySettings.bruteForceProtection})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              securitySettings.bruteForceProtection ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                securitySettings.bruteForceProtection ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Database Host
          </label>
          <input
            type="text"
            value={databaseSettings.dbHost}
            onChange={(e) => setDatabaseSettings({...databaseSettings, dbHost: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Database Port
          </label>
          <input
            type="text"
            value={databaseSettings.dbPort}
            onChange={(e) => setDatabaseSettings({...databaseSettings, dbPort: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Database Name
          </label>
          <input
            type="text"
            value={databaseSettings.dbName}
            onChange={(e) => setDatabaseSettings({...databaseSettings, dbName: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Database User
          </label>
          <input
            type="text"
            value={databaseSettings.dbUser}
            onChange={(e) => setDatabaseSettings({...databaseSettings, dbUser: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Database Password
        </label>
        <div className="relative">
          <input
            type={showPassword.dbPassword ? 'text' : 'password'}
            value={databaseSettings.dbPassword}
            onChange={(e) => setDatabaseSettings({...databaseSettings, dbPassword: e.target.value})}
            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('dbPassword')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword.dbPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Backup Frequency
          </label>
          <select
            value={databaseSettings.backupFrequency}
            onChange={(e) => setDatabaseSettings({...databaseSettings, backupFrequency: e.target.value})}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Backup Time
          </label>
          <input
            type="time"
            value={databaseSettings.backupTime}
            onChange={(e) => setDatabaseSettings({...databaseSettings, backupTime: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">Automatic Backups</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enable automated database backups</p>
        </div>
        <button
          onClick={() => setDatabaseSettings({...databaseSettings, backupEnabled: !databaseSettings.backupEnabled})}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            databaseSettings.backupEnabled ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              databaseSettings.backupEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTP Host
          </label>
          <input
            type="text"
            value={emailSettings.smtpHost}
            onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTP Port
          </label>
          <input
            type="text"
            value={emailSettings.smtpPort}
            onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTP User
          </label>
          <input
            type="text"
            value={emailSettings.smtpUser}
            onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SMTP Password
          </label>
          <div className="relative">
            <input
              type={showPassword.smtpPassword ? 'text' : 'password'}
              value={emailSettings.smtpPassword}
              onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('smtpPassword')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword.smtpPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From Email
          </label>
          <input
            type="email"
            value={emailSettings.fromEmail}
            onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From Name
          </label>
          <input
            type="text"
            value={emailSettings.fromName}
            onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API Version
          </label>
          <input
            type="text"
            value={apiSettings.apiVersion}
            onChange={(e) => setApiSettings({...apiSettings, apiVersion: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rate Limit (per hour)
          </label>
          <input
            type="number"
            value={apiSettings.rateLimit}
            onChange={(e) => setApiSettings({...apiSettings, rateLimit: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            JWT Expiry (minutes)
          </label>
          <input
            type="number"
            value={apiSettings.jwtExpiry}
            onChange={(e) => setApiSettings({...apiSettings, jwtExpiry: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Refresh Token Expiry (days)
          </label>
          <input
            type="number"
            value={apiSettings.refreshTokenExpiry}
            onChange={(e) => setApiSettings({...apiSettings, refreshTokenExpiry: e.target.value})}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Allowed Origins (comma separated)
        </label>
        <textarea
          value={apiSettings.allowedOrigins}
          onChange={(e) => setApiSettings({...apiSettings, allowedOrigins: e.target.value})}
          rows="3"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">API Enabled</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enable/disable API access</p>
          </div>
          <button
            onClick={() => setApiSettings({...apiSettings, apiEnabled: !apiSettings.apiEnabled})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              apiSettings.apiEnabled ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                apiSettings.apiEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">CORS Enabled</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Allow cross-origin requests</p>
          </div>
          <button
            onClick={() => setApiSettings({...apiSettings, corsEnabled: !apiSettings.corsEnabled})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              apiSettings.corsEnabled ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                apiSettings.corsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAuthSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password Minimum Length
        </label>
        <input
          type="number"
          value={authSettings.passwordMinLength}
          onChange={(e) => setAuthSettings({...authSettings, passwordMinLength: e.target.value})}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Allow Registration</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Allow new user registration</p>
          </div>
          <button
            onClick={() => setAuthSettings({...authSettings, allowRegistration: !authSettings.allowRegistration})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              authSettings.allowRegistration ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                authSettings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Email Verification</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Require email verification</p>
          </div>
          <button
            onClick={() => setAuthSettings({...authSettings, emailVerification: !authSettings.emailVerification})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              authSettings.emailVerification ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                authSettings.emailVerification ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Require Uppercase</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Password must contain uppercase</p>
          </div>
          <button
            onClick={() => setAuthSettings({...authSettings, passwordRequireUppercase: !authSettings.passwordRequireUppercase})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              authSettings.passwordRequireUppercase ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                authSettings.passwordRequireUppercase ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Require Numbers</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Password must contain numbers</p>
          </div>
          <button
            onClick={() => setAuthSettings({...authSettings, passwordRequireNumbers: !authSettings.passwordRequireNumbers})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              authSettings.passwordRequireNumbers ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                authSettings.passwordRequireNumbers ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Require Special Characters</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Password must contain special chars</p>
          </div>
          <button
            onClick={() => setAuthSettings({...authSettings, passwordRequireSpecial: !authSettings.passwordRequireSpecial})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              authSettings.passwordRequireSpecial ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                authSettings.passwordRequireSpecial ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'authentication': return renderAuthSettings();
      case 'database': return renderDatabaseSettings();
      case 'email': return renderEmailSettings();
      case 'api': return renderApiSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <SystemAdminLayout>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Settings Header with Save Button */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Configuration</h2>
            <div className="flex items-center gap-3">
              {saveSuccess && (
                <div className="flex items-center gap-2 text-green-600 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                  <FiCheckCircle className="w-4 h-4" />
                  <span className="text-sm">Settings saved!</span>
                </div>
              )}
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Save Changes
              </button>
              <button className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiRefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <div className="flex px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600 dark:text-red-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </SystemAdminLayout>
  );
};

export default SystemSettings;