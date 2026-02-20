// components/callcenter/RecentComplaints.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiFlag, FiClock } from 'react-icons/fi';

const RecentComplaints = () => {
  const complaints = [
    { 
      id: 1, 
      customer: 'Robert Brown', 
      issue: 'Billing discrepancy - Charged twice',
      priority: 'High',
      priorityColor: 'red',
      status: 'Open',
      statusColor: 'red',
      date: '2024-01-15'
    },
    { 
      id: 2, 
      customer: 'Lisa Anderson', 
      issue: 'Technical support unresponsive',
      priority: 'Urgent',
      priorityColor: 'red',
      status: 'In Progress',
      statusColor: 'yellow',
      date: '2024-01-15'
    },
    { 
      id: 3, 
      customer: 'David Martinez', 
      issue: 'Product delivery delayed',
      priority: 'Medium',
      priorityColor: 'yellow',
      status: 'Assigned',
      statusColor: 'blue',
      date: '2024-01-14'
    },
    { 
      id: 4, 
      customer: 'Jennifer Lee', 
      issue: 'Account access issue',
      priority: 'Low',
      priorityColor: 'green',
      status: 'Pending',
      statusColor: 'purple',
      date: '2024-01-14'
    },
  ];

  const getPriorityColor = (color) => {
    switch(color) {
      case 'red': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'yellow': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'green': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (color) => {
    switch(color) {
      case 'red': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'yellow': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'blue': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'purple': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Complaints</h2>
        <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {complaints.map((complaint, index) => (
          <motion.div
            key={complaint.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                     hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2">
                <FiFlag className={`w-4 h-4 mt-1 ${
                  complaint.priority === 'High' ? 'text-red-500' : 
                  complaint.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                }`} />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{complaint.customer}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{complaint.issue}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pl-6">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(complaint.priorityColor)}`}>
                  {complaint.priority}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(complaint.statusColor)}`}>
                  {complaint.status}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                {complaint.date}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentComplaints;