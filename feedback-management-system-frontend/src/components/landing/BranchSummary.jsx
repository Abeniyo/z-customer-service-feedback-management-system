import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiUsers, FiTrendingUp, FiAward, FiStar } from 'react-icons/fi';

const BranchSummary = () => {
  const branches = [
    {
      id: 1,
      name: 'Downtown Branch',
      manager: 'Alice Cooper',
      customers: 456,
      feedbacks: 234,
      complaints: 12,
      rating: 4.8,
      performance: '+15%'
    },
    {
      id: 2,
      name: 'Westside Branch',
      manager: 'Bob Miller',
      customers: 389,
      feedbacks: 198,
      complaints: 8,
      rating: 4.9,
      performance: '+22%'
    },
    {
      id: 3,
      name: 'Eastside Branch',
      manager: 'Carol White',
      customers: 412,
      feedbacks: 212,
      complaints: 15,
      rating: 4.6,
      performance: '+8%'
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Branch Performance</h2>
        <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium">
          View Details
        </button>
      </div>

      <div className="space-y-4">
        {branches.map((branch, index) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">{branch.name}</h3>
              </div>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 
                           dark:text-green-400 text-xs font-medium rounded-full">
                {branch.performance}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
              <FiAward className="w-3 h-3" />
              Manager: {branch.manager}
            </p>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Customers</p>
                <p className="font-semibold text-gray-900 dark:text-white">{branch.customers}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Feedbacks</p>
                <p className="font-semibold text-gray-900 dark:text-white">{branch.feedbacks}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Complaints</p>
                <p className="font-semibold text-gray-900 dark:text-white">{branch.complaints}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                <p className="font-semibold text-yellow-600 flex items-center justify-center gap-1">
                  <FiStar className="w-3 h-3 fill-yellow-400" />
                  {branch.rating}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BranchSummary;