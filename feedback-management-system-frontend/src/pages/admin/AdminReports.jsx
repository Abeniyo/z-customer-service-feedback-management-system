import React, { useState } from 'react';
import AdminLayout from './AdminLayout';

// Import React Icons
import { 
  FiBarChart2, 
  FiStar, 
  FiUsers, 
  FiClock,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiEye,
  FiX,
  FiTrendingUp,
  FiTrendingDown,
  FiPhoneCall,
  FiCheckCircle
} from 'react-icons/fi';

const AdminReports = () => {
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const dailyReports = [
    { 
      id: 1,
      date: '2026-02-17',
      totalCalls: 245,
      resolved: 218,
      averageRating: 4.7,
      satisfactionRate: 94,
      averageTime: '4.2 min',
      agentPerformance: [
        { name: 'Jane Smith', calls: 45, rating: 4.9 },
        { name: 'John Doe', calls: 38, rating: 4.7 },
        { name: 'Mike Johnson', calls: 42, rating: 4.8 }
      ]
    },
    { 
      id: 2,
      date: '2026-02-16',
      totalCalls: 232,
      resolved: 205,
      averageRating: 4.6,
      satisfactionRate: 92,
      averageTime: '4.5 min',
      agentPerformance: [
        { name: 'Jane Smith', calls: 42, rating: 4.8 },
        { name: 'John Doe', calls: 36, rating: 4.6 },
        { name: 'Sarah Wilson', calls: 40, rating: 4.9 }
      ]
    }
  ];

  const weeklyReports = [
    { 
      id: 1,
      week: 'Week 7, 2026',
      startDate: '2026-02-10',
      endDate: '2026-02-16',
      totalCalls: 1650,
      resolved: 1480,
      averageRating: 4.7,
      satisfactionRate: 94,
      trend: '+5%'
    }
  ];

  const monthlyReports = [
    { 
      id: 1,
      month: 'February 2026',
      totalCalls: 6850,
      resolved: 6230,
      averageRating: 4.7,
      satisfactionRate: 94,
      trend: '+8%'
    }
  ];

  const stats = [
    { label: 'Total Reports', value: '156', icon: FiBarChart2, change: '+12', color: 'blue' },
    { label: 'Avg Satisfaction', value: '94%', icon: FiStar, change: '+2%', color: 'green' },
    { label: 'Active Agents', value: '24', icon: FiUsers, change: '+3', color: 'purple' },
    { label: 'Response Time', value: '4.2m', icon: FiClock, change: '-0.3m', color: 'yellow' }
  ];

  const getReports = () => {
    switch(reportType) {
      case 'daily': return dailyReports;
      case 'weekly': return weeklyReports;
      case 'monthly': return monthlyReports;
      default: return [];
    }
  };

  const reports = getReports();

  const getSatisfactionColor = (rate) => {
    if (rate >= 95) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    if (rate >= 90) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
  };

  const getTrendIcon = (trend) => {
    if (trend?.startsWith('+')) return <FiTrendingUp className="text-green-600" />;
    return <FiTrendingDown className="text-red-600" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = {
              blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
              green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
              purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
              yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
            };
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${colors[stat.color]} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} vs last period
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Report Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2">
              {['daily', 'weekly', 'monthly'].map(type => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    reportType === type 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiFilter className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiDownload className="w-5 h-5" />
              </button>
            </div>
          </div>

          {reportType === 'daily' && (
            <div className="mt-4 flex items-center gap-2">
              <FiCalendar className="text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map(report => (
            <div 
              key={report.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 cursor-pointer"
              onClick={() => {
                setSelectedReport(report);
                setViewModal(true);
              }}
            >
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {report.date ? new Date(report.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : report.week || report.month}
                  </h3>
                  {report.startDate && report.endDate && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {report.startDate} - {report.endDate}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {report.trend && (
                    <span className="flex items-center gap-1 text-sm font-medium">
                      {getTrendIcon(report.trend)}
                      {report.trend}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSatisfactionColor(report.satisfactionRate)}`}>
                    {report.satisfactionRate}% Satisfaction
                  </span>
                  <FiEye className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{report.totalCalls}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Calls</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{report.resolved}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Resolved</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{report.averageRating}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{report.averageTime || 'N/A'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Time</p>
                </div>
              </div>

              {/* Agent Performance Preview */}
              {report.agentPerformance && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Top Agents Today:</p>
                  <div className="flex flex-wrap gap-2">
                    {report.agentPerformance.slice(0, 3).map((agent, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                        {agent.name}: {agent.calls} calls
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Report Detail Modal */}
      {viewModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedReport.date ? new Date(selectedReport.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : selectedReport.week || selectedReport.month}
                </h2>
                <button
                  onClick={() => setViewModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FiPhoneCall className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.totalCalls}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Calls</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.resolved}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Resolved</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FiStar className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.averageRating}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FiClock className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedReport.averageTime || 'N/A'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Time</p>
                </div>
              </div>

              {/* Agent Performance */}
              {selectedReport.agentPerformance && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Agent Performance</h3>
                  <div className="space-y-3">
                    {selectedReport.agentPerformance.map((agent, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs">
                            {agent.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{agent.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{agent.calls} calls</span>
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{agent.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <FiDownload className="w-4 h-4" />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReports;