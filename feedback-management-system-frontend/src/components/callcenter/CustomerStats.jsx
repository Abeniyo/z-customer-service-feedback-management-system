import React from 'react';
import { FiUsers, FiCheckCircle, FiStar, FiPhone, FiAlertCircle } from 'react-icons/fi';

const CustomerStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Customers',
      value: stats.totalCustomers,
      icon: FiUsers,
      color: 'from-purple-500 to-pink-600',
      bg: 'purple'
    },
    {
      label: 'Active Customers',
      value: stats.activeCustomers,
      icon: FiCheckCircle,
      color: 'from-green-500 to-emerald-600',
      bg: 'green'
    },
    {
      label: 'Avg Rating',
      value: stats.averageRating,
      icon: FiStar,
      color: 'from-yellow-500 to-amber-600',
      bg: 'yellow'
    },
    {
      label: 'Total Calls',
      value: stats.totalCalls,
      icon: FiPhone,
      color: 'from-blue-500 to-cyan-600',
      bg: 'blue'
    },
    {
      label: 'Complaints',
      value: `${stats.pendingComplaints}/${stats.totalComplaints}`,
      subtext: `${stats.pendingComplaints} pending`,
      icon: FiAlertCircle,
      color: 'from-orange-500 to-red-600',
      bg: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                {stat.subtext && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.subtext}</p>
                )}
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerStats;