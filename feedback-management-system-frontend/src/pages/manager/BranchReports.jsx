import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BranchManagerLayout from './BranchManagerLayout';

// Import React Icons
import { 
  FiBarChart2, 
  FiDownload,
  FiCalendar,
  FiFileText,
  FiPieChart,
  FiTrendingUp,
  FiUsers,
  FiStar,
  FiClock,
  FiEye,
  FiMoreVertical,
  FiRefreshCw
} from 'react-icons/fi';

const BranchReports = () => {
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  const reports = [
    {
      id: 1,
      name: 'Monthly Performance Report',
      type: 'Performance',
      generated: '2026-02-26',
      period: 'January 2026',
      format: 'PDF',
      size: '2.4 MB',
      downloads: 45,
      icon: FiBarChart2,
      color: 'blue'
    },
    {
      id: 2,
      name: 'Agent Activity Summary',
      type: 'Agent',
      generated: '2026-02-25',
      period: 'Week 8, 2026',
      format: 'Excel',
      size: '1.8 MB',
      downloads: 32,
      icon: FiUsers,
      color: 'green'
    },
    {
      id: 3,
      name: 'Customer Satisfaction Survey',
      type: 'Satisfaction',
      generated: '2026-02-24',
      period: 'February 2026',
      format: 'PDF',
      size: '3.1 MB',
      downloads: 28,
      icon: FiStar,
      color: 'yellow'
    },
    {
      id: 4,
      name: 'Call Volume Analysis',
      type: 'Analytics',
      generated: '2026-02-23',
      period: 'Q1 2026',
      format: 'Excel',
      size: '4.2 MB',
      downloads: 56,
      icon: FiTrendingUp,
      color: 'purple'
    },
    {
      id: 5,
      name: 'Response Time Report',
      type: 'Performance',
      generated: '2026-02-22',
      period: 'February 2026',
      format: 'PDF',
      size: '1.2 MB',
      downloads: 23,
      icon: FiClock,
      color: 'red'
    },
    {
      id: 6,
      name: 'Daily Operations Summary',
      type: 'Operations',
      generated: '2026-02-21',
      period: '2026-02-21',
      format: 'Excel',
      size: '0.8 MB',
      downloads: 67,
      icon: FiFileText,
      color: 'indigo'
    }
  ];

  const reportTemplates = [
    { name: 'Daily Summary Report', description: 'Daily call volume and agent performance', icon: FiFileText },
    { name: 'Weekly Performance Review', description: 'Weekly KPIs and achievements', icon: FiBarChart2 },
    { name: 'Monthly Analytics Report', description: 'Comprehensive monthly analysis', icon: FiPieChart },
    { name: 'Agent Scorecard', description: 'Individual agent performance metrics', icon: FiUsers },
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/20',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20',
      red: 'bg-red-100 text-red-600 dark:bg-red-900/20',
      indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20'
    };
    return colors[color] || colors.blue;
  };

  return (
    <BranchManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <FiBarChart2 className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Report Templates */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Report Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((template, index) => {
              const Icon = template.icon;
              return (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{template.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Report Types</option>
                <option value="Performance">Performance</option>
                <option value="Agent">Agent</option>
                <option value="Satisfaction">Satisfaction</option>
                <option value="Analytics">Analytics</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button className="p-2 text-gray-500 hover:text-green-600 rounded-lg border border-gray-300 dark:border-gray-600">
                <FiRefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${getColorClass(report.color)} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FiMoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{report.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{report.type} • {report.period}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{report.generated}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiEye className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{report.downloads} downloads</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {report.format}
                    </span>
                    <span className="text-xs text-gray-500">{report.size}</span>
                  </div>
                  <button className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg">
                    <FiDownload className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BranchManagerLayout>
  );
};

export default BranchReports;