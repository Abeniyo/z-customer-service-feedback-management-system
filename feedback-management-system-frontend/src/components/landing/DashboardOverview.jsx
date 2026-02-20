// components/callcenter/DashboardOverview.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiMessageSquare, 
  FiAlertCircle, 
  FiClock,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown 
} from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, trend, color, bgColor }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`${bgColor} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend.isPositive ? (
              <FiArrowUp className="w-3 h-3 text-green-500" />
            ) : (
              <FiArrowDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-xs font-medium ${
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend.value}% vs last month
            </span>
          </div>
        )}
      </div>
      
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);

const DashboardOverview = () => {
  const stats = [
    { 
      title: 'Total Customers', 
      value: '1,234', 
      icon: FiUsers, 
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      bgColor: 'bg-white dark:bg-gray-800',
      trend: { isPositive: true, value: 12 }
    },
    { 
      title: 'Total Feedbacks', 
      value: '3,567', 
      icon: FiMessageSquare, 
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
      bgColor: 'bg-white dark:bg-gray-800',
      trend: { isPositive: true, value: 8 }
    },
    { 
      title: 'Total Complaints', 
      value: '89', 
      icon: FiAlertCircle, 
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
      bgColor: 'bg-white dark:bg-gray-800',
      trend: { isPositive: false, value: 5 }
    },
    { 
      title: 'Pending Actions', 
      value: '23', 
      icon: FiClock, 
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
      bgColor: 'bg-white dark:bg-gray-800',
      trend: { isPositive: true, value: 3 }
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardOverview;