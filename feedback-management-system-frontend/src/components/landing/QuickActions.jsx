import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiUserPlus, 
  FiEdit, 
  FiFlag, 
  FiCheckSquare,
  FiPlus
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { 
      label: 'Add New Customer', 
      icon: FiUserPlus, 
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      hoverColor: 'hover:bg-blue-200 dark:hover:bg-blue-900/40',
      path: '/callcenter/customers/new'
    },
    { 
      label: 'Submit Feedback', 
      icon: FiEdit, 
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
      hoverColor: 'hover:bg-purple-200 dark:hover:bg-purple-900/40',
      path: '/callcenter/new-feedback'
    },
    { 
      label: 'Log Complaint', 
      icon: FiFlag, 
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
      hoverColor: 'hover:bg-orange-200 dark:hover:bg-orange-900/40',
      path: '/callcenter/complaints/new'
    },
    { 
      label: 'Assign Action', 
      icon: FiCheckSquare, 
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
      hoverColor: 'hover:bg-green-200 dark:hover:bg-green-900/40',
      path: '/callcenter/actions/assign'
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
        <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 
                         font-medium flex items-center gap-1">
          <FiPlus className="w-4 h-4" />
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(action.path)}
            className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200
                       ${action.color} ${action.hoverColor} cursor-pointer`}
          >
            <action.icon className="w-6 h-6 mb-2" />
            <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;