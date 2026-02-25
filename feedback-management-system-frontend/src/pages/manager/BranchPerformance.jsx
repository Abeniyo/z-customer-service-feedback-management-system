import React, { useState } from 'react';
import BranchManagerLayout from './BranchManagerLayout';

// Import React Icons
import { 
  FiTrendingUp, 
  FiBarChart2, 
  FiStar,
  FiClock,
  FiUsers,
  FiAward,
  FiDownload,
  FiCalendar,
  FiRefreshCw,
  FiCheckCircle,
  FiTarget
} from 'react-icons/fi';

const BranchPerformance = () => {
  const [timeRange, setTimeRange] = useState('week');

  const performanceMetrics = [
    { label: 'Total Calls', value: '1,245', target: '1,500', progress: 83, icon: FiBarChart2, color: 'blue' },
    { label: 'Avg Rating', value: '4.7', target: '4.5', progress: 104, icon: FiStar, color: 'yellow' },
    { label: 'Response Time', value: '1.8m', target: '2.0m', progress: 110, icon: FiClock, color: 'green' },
    { label: 'Agent Utilization', value: '87%', target: '85%', progress: 102, icon: FiUsers, color: 'purple' },
  ];

  const agentPerformance = [
    { name: 'Sarah Wilson', calls: 145, rating: 4.9, avgTime: '2.1m', satisfaction: '98%', trend: '+5%' },
    { name: 'Michael Brown', calls: 138, rating: 4.8, avgTime: '2.3m', satisfaction: '96%', trend: '+3%' },
    { name: 'Emily Davis', calls: 132, rating: 4.7, avgTime: '1.9m', satisfaction: '95%', trend: '+2%' },
    { name: 'James Miller', calls: 128, rating: 4.6, avgTime: '2.2m', satisfaction: '94%', trend: '+1%' },
    { name: 'Lisa Anderson', calls: 125, rating: 4.6, avgTime: '2.4m', satisfaction: '93%', trend: '-1%' },
    { name: 'Robert Taylor', calls: 118, rating: 4.5, avgTime: '2.5m', satisfaction: '92%', trend: '0%' },
  ];

  const dailyData = [
    { day: 'Mon', calls: 42, rating: 4.8, response: 1.7 },
    { day: 'Tue', calls: 48, rating: 4.7, response: 1.8 },
    { day: 'Wed', calls: 45, rating: 4.9, response: 1.6 },
    { day: 'Thu', calls: 52, rating: 4.8, response: 1.7 },
    { day: 'Fri', calls: 55, rating: 4.7, response: 1.9 },
    { day: 'Sat', calls: 38, rating: 4.6, response: 2.1 },
    { day: 'Sun', calls: 28, rating: 4.5, response: 2.3 },
  ];

  const achievements = [
    { title: 'Team Goal', description: '85% satisfaction rate', progress: 94, achieved: true },
    { title: 'Response Time', description: 'Under 2 minutes', progress: 110, achieved: true },
    { title: 'Call Quality', description: '4.5+ rating average', progress: 104, achieved: true },
    { title: 'Training Hours', description: '20 hours/month', progress: 75, achieved: false },
  ];

  return (
    <BranchManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <button className="p-2 text-gray-500 hover:text-green-600 rounded-lg border border-gray-300 dark:border-gray-600">
              <FiDownload className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-green-600 rounded-lg border border-gray-300 dark:border-gray-600">
              <FiRefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const colors = {
              blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
              yellow: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
              green: 'text-green-600 bg-green-100 dark:bg-green-900/20',
              purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
            };
            const progressColor = metric.progress >= 100 ? 'text-green-600' : 'text-yellow-600';
            
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${colors[metric.color]} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium ${progressColor}`}>
                    {metric.progress}% of target
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                  <p className="text-xs text-gray-400 mt-1">Target: {metric.target}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Daily Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Performance</h2>
          <div className="h-80 flex items-end justify-between gap-2">
            {dailyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full space-y-1">
                  <div 
                    className="w-full bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600 relative group"
                    style={{ height: `${(item.calls / 60) * 180}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Calls: {item.calls}
                    </div>
                  </div>
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-gray-500">{item.response}m</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Call Volume</span>
            </div>
            <div className="flex items-center gap-2">
              <FiStar className="w-3 h-3 text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="w-3 h-3 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Response Time (min)</span>
            </div>
          </div>
        </div>

        {/* Agent Performance Table and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Performance Table */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Agent Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Agent</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Calls</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Rating</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Avg Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Satisfaction</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {agentPerformance.map((agent, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900 dark:text-white">{agent.name}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{agent.calls}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{agent.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{agent.avgTime}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{agent.satisfaction}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm ${agent.trend.startsWith('+') ? 'text-green-600' : agent.trend === '0%' ? 'text-gray-500' : 'text-red-600'}`}>
                          {agent.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiAward className="text-green-600" />
              Team Achievements
            </h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{achievement.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                    </div>
                    {achievement.achieved ? (
                      <FiCheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <FiTarget className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${achievement.achieved ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{achievement.progress}% complete</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BranchManagerLayout>
  );
};

export default BranchPerformance;