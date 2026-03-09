// CallCenterPage.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import CallCenterSidebar from './CallCenterSidebar';

const CallCenterPage = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // 6 cards with emoji icons only
  const stats = [
    { 
      label: 'Total Customers', 
      value: '1,284', 
      icon: '👥', 
      change: '+12%',
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Active Focals', 
      value: '42', 
      icon: '👤', 
      change: '+5',
      color: 'green',
      bgGradient: 'from-green-500 to-green-600'
    },
    { 
      label: 'Pending', 
      value: '16', 
      icon: '⏳', 
      change: '-3',
      color: 'orange',
      bgGradient: 'from-orange-500 to-orange-600'
    },
    { 
      label: 'Branches', 
      value: '8', 
      icon: '🏢', 
      change: '+2',
      color: 'purple',
      bgGradient: 'from-purple-500 to-purple-600'
    },
    { 
      label: "Today's Calls", 
      value: '89', 
      icon: '📞', 
      change: '+15%',
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-indigo-600'
    },
    { 
      label: 'Resolved', 
      value: '234', 
      icon: '✅', 
      change: '+28%',
      color: 'teal',
      bgGradient: 'from-teal-500 to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <CallCenterSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}


        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Greeting */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name || 'Agent'}! 
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Here's what's happening with your platform today
              </p>
            </div>

            {/* 6 Cards Grid - 3x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Card content */}
                  <div className="relative p-6">
                    {/* Top row with icon and change */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icon}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        stat.change.startsWith('+') 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                    </div>

                    {/* Value and label */}
                    <div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                    </div>

                    {/* Mini progress bar */}
                    <div className="mt-4 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.bgGradient} rounded-full transition-all duration-500 group-hover:opacity-80`}
                        style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional: Simple footer note */}
            <p className="text-center text-sm text-gray-400 dark:text-gray-600 mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CallCenterPage;