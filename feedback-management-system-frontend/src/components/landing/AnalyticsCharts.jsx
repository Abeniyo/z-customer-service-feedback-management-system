// components/callcenter/AnalyticsCharts.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiPieChart, FiBarChart2, FiCalendar } from 'react-icons/fi';

const AnalyticsCharts = () => {
  const feedbackTrends = [65, 75, 85, 70, 90, 95, 88];
  const complaintTrends = [12, 8, 15, 10, 7, 9, 11];
  const completionRates = [78, 82, 79, 85, 88, 92, 87];

  const maxValue = Math.max(...feedbackTrends);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Overview</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <FiCalendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <select className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg 
                           px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Trends */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-gray-900 dark:text-white">Feedback Trends</h3>
          </div>
          <div className="h-40 flex items-end gap-2">
            {feedbackTrends.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / maxValue) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full bg-purple-500 rounded-t-lg"
                  style={{ height: `${(value / maxValue) * 100}%` }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Day {index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Complaint Trends */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="w-5 h-5 text-orange-600" />
            <h3 className="font-medium text-gray-900 dark:text-white">Complaint Trends</h3>
          </div>
          <div className="h-40 flex items-end gap-2">
            {complaintTrends.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / 15) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full bg-orange-500 rounded-t-lg"
                  style={{ height: `${(value / 15) * 100}%` }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Day {index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Statistics */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <FiPieChart className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-gray-900 dark:text-white">Action Completion Rate</h3>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {completionRates.map((rate, index) => (
              <div key={index} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative w-full pt-[100%]"
                >
                  <svg className="absolute inset-0" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                    <motion.path
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${rate}, 100` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">{rate}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Day {index + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;