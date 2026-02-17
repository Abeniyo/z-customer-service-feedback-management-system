import React, { useState } from 'react';
import { 
  FiBarChart2, 
  FiCalendar, 
  FiTrendingUp, 
  FiTrendingDown,
  FiCheckCircle,
  FiClock,
  FiStar,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';
import { mockDailyReports, mockWeeklyReports, mockMonthlyReports, mockYearlyReports } from '../../data/mockData';

const DailyReports = () => {
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getReports = () => {
    switch(reportType) {
      case 'daily': return mockDailyReports;
      case 'weekly': return mockWeeklyReports;
      case 'monthly': return mockMonthlyReports;
      case 'yearly': return mockYearlyReports;
      default: return [];
    }
  };

  const reports = getReports();

  const getSatisfactionColor = (rate) => {
    if (rate >= 90) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    if (rate >= 80) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
  };

  const getTrendIcon = (trend) => {
    if (trend?.startsWith('+')) return <FiTrendingUp className="text-green-600" />;
    return <FiTrendingDown className="text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiBarChart2 className="text-purple-600" />
            Performance Reports
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your call center performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
            <FiDownload className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
            <FiRefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex flex-wrap gap-2">
        {['daily', 'weekly', 'monthly', 'yearly'].map(type => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              reportType === type 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Date Picker for Daily Reports */}
      {reportType === 'daily' && (
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-6">
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6"
            >
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {report.date ? new Date(report.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : report.week || report.month || report.year}
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
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FiPhone className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                  <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                    {report.totalCalls}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Calls</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                    {report.resolved}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Resolved</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FiClock className="w-5 h-5 text-orange-600 mx-auto mb-2" />
                  <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                    {report.pending || 0}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Pending</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FiStar className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
                  <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                    {report.averageRating}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Avg Rating</span>
                </div>
              </div>

              {/* Categories Section for Daily Reports */}
              {report.topCategories && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Top Categories
                  </h4>
                  <div className="space-y-3">
                    {report.topCategories.map((cat, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-32">
                          {cat.name}
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${(cat.count / report.totalCalls) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {cat.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Performers for Monthly Reports */}
              {report.topPerformers && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Top Performers
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {report.topPerformers.map((performer, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                      >
                        {performer}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quarterly Breakdown for Yearly Reports */}
              {report.quarterlyBreakdown && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Quarterly Breakdown
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {report.quarterlyBreakdown.map((quarter, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                          {quarter.quarter}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {quarter.calls} calls
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          Rating: {quarter.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FiBarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No reports available for this period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReports;