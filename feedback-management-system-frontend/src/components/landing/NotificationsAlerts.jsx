import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAlertCircle, 
  FiClock, 
  FiBell, 
  FiCheckCircle,
  FiXCircle,
  FiInfo
} from 'react-icons/fi';

const NotificationsAlerts = () => {
  const [alerts, setAlerts] = React.useState([
    {
      id: 1,
      type: 'warning',
      title: 'Unassigned Complaints',
      message: '5 new complaints waiting for assignment',
      time: '10 minutes ago',
      icon: FiAlertCircle,
      color: 'orange'
    },
    {
      id: 2,
      type: 'error',
      title: 'Overdue Actions',
      message: '3 actions are past their due date',
      time: '1 hour ago',
      icon: FiClock,
      color: 'red'
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'New feedback system features available',
      time: '2 hours ago',
      icon: FiInfo,
      color: 'blue'
    },
    {
      id: 4,
      type: 'success',
      title: 'Performance Report',
      message: 'Weekly report is ready for review',
      time: '5 hours ago',
      icon: FiCheckCircle,
      color: 'green'
    },
  ]);

  const getAlertStyles = (color) => {
    switch(color) {
      case 'orange':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'red':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'green':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getIconColor = (color) => {
    switch(color) {
      case 'orange': return 'text-orange-600 dark:text-orange-400';
      case 'red': return 'text-red-600 dark:text-red-400';
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'green': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const removeAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiBell className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications & Alerts</h2>
        </div>
        <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-4 rounded-lg border ${getAlertStyles(alert.color)} relative`}
            >
              <button
                onClick={() => removeAlert(alert.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 
                         dark:hover:text-gray-300"
              >
                <FiXCircle className="w-4 h-4" />
              </button>

              <div className="flex gap-3">
                <div className={`mt-1 ${getIconColor(alert.color)}`}>
                  <alert.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{alert.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">
                    {alert.time}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {alerts.length === 0 && (
          <div className="text-center py-8">
            <FiCheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No new notifications</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">5</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Unassigned</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">3</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Overdue</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">8</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Updates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsAlerts;