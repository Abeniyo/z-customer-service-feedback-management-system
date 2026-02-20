import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMoreHorizontal } from 'react-icons/fi';

const RecentFeedbacks = () => {
  const feedbacks = [
    { 
      id: 1, 
      customer: 'John Smith', 
      feedback: 'Excellent service provided by the support team. They resolved my issue quickly.',
      rating: 5, 
      status: 'Resolved',
      statusColor: 'green',
      date: '2024-01-15',
      time: '10:30 AM'
    },
    { 
      id: 2, 
      customer: 'Sarah Johnson', 
      feedback: 'Need faster response time for technical issues. Took too long to get back.',
      rating: 3, 
      status: 'In Progress',
      statusColor: 'yellow',
      date: '2024-01-15',
      time: '09:15 AM'
    },
    { 
      id: 3, 
      customer: 'Mike Wilson', 
      feedback: 'Very helpful support team. They went above and beyond to help me.',
      rating: 4, 
      status: 'Resolved',
      statusColor: 'green',
      date: '2024-01-14',
      time: '04:45 PM'
    },
    { 
      id: 4, 
      customer: 'Emma Davis', 
      feedback: 'Still waiting for callback regarding my account issue.',
      rating: 2, 
      status: 'Pending',
      statusColor: 'red',
      date: '2024-01-14',
      time: '02:30 PM'
    },
  ];

  const getStatusColor = (color) => {
    switch(color) {
      case 'green': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'yellow': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'red': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Feedbacks</h2>
        <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {feedbacks.map((feedback, index) => (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 
                     dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{feedback.customer}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {feedback.feedback}
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <FiMoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {renderStars(feedback.rating)}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {feedback.date} • {feedback.time}
                </span>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(feedback.statusColor)}`}>
                {feedback.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentFeedbacks;