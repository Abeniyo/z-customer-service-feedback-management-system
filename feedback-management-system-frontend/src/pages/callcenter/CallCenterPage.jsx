import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import CallCenterSidebar from './CallCenterSidebar';

import FeedbackForm from '../../components/callcenter/FeedbackForm';
import CustomerDetails from '../../components/callcenter/CustomerDetails';
import DailyReports from '../../components/callcenter/DailyReports';

// Import React Icons
import { 
  FiEdit, 
  FiUsers, 
  FiBarChart2, 
  FiPhoneCall, 
  FiStar, 
  FiCheckCircle, 
  FiClock,
  FiTrendingUp,
  FiSearch,
  FiFilter,
  FiDownload,
  FiCalendar,
  FiBell,
  FiUser
} from 'react-icons/fi';

const CallCenterPage = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('new-feedback');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const tabs = [
    { id: 'new-feedback', label: 'New Feedback', icon: FiEdit, color: 'purple' },
    { id: 'customers', label: 'Customer Details', icon: FiUsers, color: 'blue' },
    { id: 'reports', label: 'Daily Reports', icon: FiBarChart2, color: 'green' }
  ];

  const stats = [
    { 
      label: "Today's Calls", 
      value: '12', 
      icon: FiPhoneCall, 
      change: '+8%', 
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      changeColor: 'text-green-600'
    },
    { 
      label: 'Avg Rating', 
      value: '4.8', 
      icon: FiStar, 
      change: '+0.3', 
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      changeColor: 'text-green-600'
    },
    { 
      label: 'Resolved', 
      value: '8', 
      icon: FiCheckCircle, 
      change: '+5%', 
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      changeColor: 'text-green-600'
    },
    { 
      label: 'Pending', 
      value: '4', 
      icon: FiClock, 
      change: '-2%', 
      color: 'orange',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      changeColor: 'text-red-600'
    }
  ];

  const getTabStyles = (tabId) => {
    const isActive = activeTab === tabId;
    const colorMap = {
      'new-feedback': {
        active: 'bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/30 border-l-4 border-purple-700',
        inactive: 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
      },
      'customers': {
        active: 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30 border-l-4 border-blue-700',
        inactive: 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
      },
      'reports': {
        active: 'bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-green-900/30 border-l-4 border-green-700',
        inactive: 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
      }
    };
    return isActive ? colorMap[tabId].active : colorMap[tabId].inactive;
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'new-feedback':
        return <FeedbackForm />;
      case 'customers':
        return <CustomerDetails onSelectFeedback={setSelectedFeedback} />;
      case 'reports':
        return <DailyReports />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex overflow-hidden">
      <CallCenterSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header - Fixed at top */}


        {/* Main Content - Scrollable area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                      <span className={`text-sm font-medium ${stat.changeColor} bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full`}>
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

            {/* Tabs Navigation - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${getTabStyles(tab.id)}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tabs Navigation - Mobile */}
            <div className="md:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {tabs.map(tab => (
                  <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
              </select>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CallCenterPage;