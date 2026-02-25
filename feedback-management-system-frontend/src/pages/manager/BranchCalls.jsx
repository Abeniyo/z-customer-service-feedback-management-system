import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BranchManagerLayout from './BranchManagerLayout';

// Import React Icons
import { 
  FiPhoneCall, 
  FiClock, 
  FiUser, 
  FiStar,
  FiSearch,
  FiFilter,
  FiEye,
  FiDownload,
  FiRefreshCw,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle
} from 'react-icons/fi';

const BranchCalls = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const calls = [
    {
      id: 'CL-001',
      agent: 'Sarah Wilson',
      customer: 'John Smith',
      duration: '5:23',
      time: '09:45 AM',
      date: '2026-02-26',
      rating: 5,
      status: 'completed',
      type: 'inbound',
      feedback: 'Positive',
      notes: 'Customer satisfied with service'
    },
    {
      id: 'CL-002',
      agent: 'Michael Brown',
      customer: 'Emma Johnson',
      duration: '8:12',
      time: '10:15 AM',
      date: '2026-02-26',
      rating: 4,
      status: 'completed',
      type: 'inbound',
      feedback: 'Neutral',
      notes: 'Follow-up required in 2 weeks'
    },
    {
      id: 'CL-003',
      agent: 'Emily Davis',
      customer: 'Robert Wilson',
      duration: '12:45',
      time: '11:30 AM',
      date: '2026-02-26',
      rating: 5,
      status: 'completed',
      type: 'outbound',
      feedback: 'Positive',
      notes: 'New product inquiry'
    },
    {
      id: 'CL-004',
      agent: 'James Miller',
      customer: 'Lisa Brown',
      duration: '3:18',
      time: '01:20 PM',
      date: '2026-02-26',
      rating: 3,
      status: 'completed',
      type: 'inbound',
      feedback: 'Negative',
      notes: 'Technical issue unresolved'
    },
    {
      id: 'CL-005',
      agent: 'Sarah Wilson',
      customer: 'David Lee',
      duration: '15:42',
      time: '02:45 PM',
      date: '2026-02-26',
      rating: 5,
      status: 'ongoing',
      type: 'inbound',
      feedback: null,
      notes: 'Complex issue - escalated'
    },
    {
      id: 'CL-006',
      agent: 'Robert Taylor',
      customer: 'Maria Garcia',
      duration: '6:30',
      time: '03:10 PM',
      date: '2026-02-26',
      rating: 4,
      status: 'completed',
      type: 'outbound',
      feedback: 'Positive',
      notes: 'Follow-up call completed'
    }
  ];

  const stats = [
    { label: 'Total Calls', value: '156', change: '+12%', icon: FiPhoneCall, color: 'green' },
    { label: 'Avg Duration', value: '7.2 min', change: '-0.5 min', icon: FiClock, color: 'blue' },
    { label: 'Avg Rating', value: '4.5', change: '+0.2', icon: FiStar, color: 'yellow' },
    { label: 'Ongoing', value: '3', change: 'calls', icon: FiAlertCircle, color: 'purple' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'ongoing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'missed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getTypeColor = (type) => {
    return type === 'inbound' 
      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && call.status === filter;
  });

  return (
    <BranchManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Call Logs</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = {
              green: 'bg-green-100 text-green-600 dark:bg-green-900/20',
              blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20',
              yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20',
              purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20'
            };
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${colors[stat.color]} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search calls by agent, customer, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="missed">Missed</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button className="p-2 text-gray-500 hover:text-green-600 rounded-lg border border-gray-300 dark:border-gray-600">
                <FiRefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calls Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Call ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Agent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Rating</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono text-gray-900 dark:text-white">{call.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FiUser className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">{call.agent}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{call.customer}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FiClock className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{call.time}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{call.duration}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(call.type)}`}>
                        {call.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {call.rating ? (
                        <div className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{call.rating}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(call.status)}`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="p-1 text-green-600 hover:text-green-700">
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing 1 to {filteredCalls.length} of {calls.length} calls
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm">Previous</button>
              <button className="px-3 py-1 rounded bg-green-600 text-white text-sm">1</button>
              <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm">2</button>
              <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm">3</button>
              <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm">Next</button>
            </div>
          </div>
        </div>
      </div>
    </BranchManagerLayout>
  );
};

export default BranchCalls;