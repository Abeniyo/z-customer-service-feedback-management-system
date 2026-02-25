import React, { useState } from 'react';
import BranchManagerLayout from './BranchManagerLayout';

// Import React Icons
import { 
  FiSettings,
  FiBell,
  FiGlobe,
  FiLock,
  FiUsers,
  FiMail,
  FiSave,
  FiRefreshCw,
  FiToggleLeft,
  FiToggleRight,
  FiChevronRight
} from 'react-icons/fi';

const BranchSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      dailyDigest: false,
      weeklyReport: true,
      criticalAlerts: true
    },
    preferences: {
      language: 'en',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h'
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: '30',
      ipWhitelisting: false,
      loginAlerts: true
    },
    agentSettings: {
      autoAssign: true,
      maxConcurrentCalls: '3',
      breakDuration: '15',
      lunchDuration: '45'
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleNotificationChange = (key) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const handlePreferenceChange = (key, value) => {
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value
      }
    });
  };

  const handleSecurityChange = (key) => {
    if (typeof settings.security[key] === 'boolean') {
      setSettings({
        ...settings,
        security: {
          ...settings.security,
          [key]: !settings.security[key]
        }
      });
    } else {
      // Handle input changes
    }
  };

  const handleAgentSettingChange = (key, value) => {
    setSettings({
      ...settings,
      agentSettings: {
        ...settings.agentSettings,
        [key]: value
      }
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  return (
    <BranchManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
              <FiRefreshCw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
              <nav className="space-y-1">
                {[
                  { id: 'notifications', label: 'Notifications', icon: FiBell },
                  { id: 'preferences', label: 'Preferences', icon: FiGlobe },
                  { id: 'security', label: 'Security', icon: FiLock },
                  { id: 'agents', label: 'Agent Settings', icon: FiUsers },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <FiChevronRight className="w-4 h-4" />
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notifications */}
            <div id="notifications" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiBell className="text-green-600" />
                Notification Settings
              </h2>
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {value ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className="text-2xl text-gray-400 hover:text-green-600"
                    >
                      {value ? <FiToggleRight className="w-8 h-8 text-green-600" /> : <FiToggleLeft className="w-8 h-8" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div id="preferences" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiGlobe className="text-green-600" />
                Preferences
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.preferences.timezone}
                    onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Format
                    </label>
                    <select
                      value={settings.preferences.dateFormat}
                      onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time Format
                    </label>
                    <select
                      value={settings.preferences.timeFormat}
                      onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="12h">12-hour</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div id="security" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiLock className="text-green-600" />
                Security Settings
              </h2>
              <div className="space-y-4">
                {Object.entries(settings.security).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : `${value} minutes`}
                      </p>
                    </div>
                    {typeof value === 'boolean' ? (
                      <button
                        onClick={() => handleSecurityChange(key)}
                        className="text-2xl"
                      >
                        {value ? <FiToggleRight className="w-8 h-8 text-green-600" /> : <FiToggleLeft className="w-8 h-8" />}
                      </button>
                    ) : (
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleSecurityChange(key, e.target.value)}
                        className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Settings */}
            <div id="agents" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiUsers className="text-green-600" />
                Agent Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Auto-assign Calls</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Automatically assign calls to available agents</p>
                  </div>
                  <button
                    onClick={() => handleAgentSettingChange('autoAssign', !settings.agentSettings.autoAssign)}
                    className="text-2xl"
                  >
                    {settings.agentSettings.autoAssign ? 
                      <FiToggleRight className="w-8 h-8 text-green-600" /> : 
                      <FiToggleLeft className="w-8 h-8" />
                    }
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Concurrent Calls
                  </label>
                  <input
                    type="number"
                    value={settings.agentSettings.maxConcurrentCalls}
                    onChange={(e) => handleAgentSettingChange('maxConcurrentCalls', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Break Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.agentSettings.breakDuration}
                      onChange={(e) => handleAgentSettingChange('breakDuration', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lunch Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.agentSettings.lunchDuration}
                      onChange={(e) => handleAgentSettingChange('lunchDuration', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BranchManagerLayout>
  );
};

export default BranchSettings;