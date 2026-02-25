import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BranchManagerLayout from './BranchManagerLayout';

// Import React Icons
import { 
  FiUsers, 
  FiPhoneCall, 
  FiStar, 
  FiClock,
  FiTrendingUp,
  FiBarChart2,
  FiEye,
  FiDownload,
  FiRefreshCw,
  FiMapPin,
  FiCalendar,
  FiUserCheck,
  FiAward
} from 'react-icons/fi';

const BranchManagerDashboard = () => {
  const stats = [
    { 
      label: 'Total Agents', 
      value: '12', 
      icon: FiUsers, 
      change: '+2', 
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      label: 'Active Calls', 
      value: '28', 
      icon: FiPhoneCall, 
      change: '+15%', 
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      label: 'Avg Rating', 
      value: '4.7', 
      icon: FiStar, 
      change: '+0.3', 
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    { 
      label: 'Response Time', 
      value: '1.8m', 
      icon: FiClock, 
      change: '-0.4m', 
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const branchInfo = {
    name: 'Downtown Branch',
    address: '123 Main Street, New York, NY 10001',
    phone: '+1 (212) 555-0123',
    email: 'downtown@branch.com',
    manager: 'John Smith',
    agents: 12,
    dailyCalls: 145,
    satisfaction: '94%'
  };

  const topAgents = [
    { id: 1, name: 'Sarah Wilson', email: 'sarah.w@branch.com', calls: 145, rating: 4.9, status: 'online' },
    { id: 2, name: 'Michael Brown', email: 'michael.b@branch.com', calls: 138, rating: 4.8, status: 'online' },
    { id: 3, name: 'Emily Davis', email: 'emily.d@branch.com', calls: 132, rating: 4.7, status: 'busy' },
    { id: 4, name: 'James Miller', email: 'james.m@branch.com', calls: 128, rating: 4.6, status: 'online' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa.a@branch.com', calls: 125, rating: 4.6, status: 'offline' },
  ];

  const performanceData = [
    { day: 'Mon', calls: 42, rating: 4.8 },
    { day: 'Tue', calls: 48, rating: 4.7 },
    { day: 'Wed', calls: 45, rating: 4.9 },
    { day: 'Thu', calls: 52, rating: 4.8 },
    { day: 'Fri', calls: 55, rating: 4.7 },
    { day: 'Sat', calls: 38, rating: 4.6 },
    { day: 'Sun', calls: 28, rating: 4.5 },
  ];

  const scheduleToday = [
    { time: '09:00 AM', agent: 'Sarah Wilson', type: 'Shift Start', status: 'completed' },
    { time: '10:30 AM', agent: 'Michael Brown', type: 'Team Meeting', status: 'ongoing' },
    { time: '12:00 PM', agent: 'All Agents', type: 'Lunch Break', status: 'upcoming' },
    { time: '02:00 PM', agent: 'Emily Davis', type: 'Training Session', status: 'upcoming' },
    { time: '04:00 PM', agent: 'James Miller', type: 'Shift End', status: 'upcoming' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'ongoing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'upcoming': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const quickActions = [
    { 
      path: '/branch-manager/agents', 
      label: 'Manage Agents', 
      description: '12 team members',
      icon: FiUsers, 
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      path: '/branch-manager/schedule', 
      label: 'View Schedule', 
      description: "Today's shifts",
      icon: FiCalendar, 
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      path: '/branch-manager/reports', 
      label: 'Generate Report', 
      description: 'Weekly summary',
      icon: FiBarChart2, 
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <BranchManagerLayout>
      <div className="space-y-6">
        {/* Welcome Section with Branch Info */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, Branch Manager! 👋</h1>
              <p className="text-green-100">Here's your branch performance overview</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{branchInfo.name}</span>
              </div>
              <p className="text-xs text-green-100">{branchInfo.address}</p>
            </div>
          </div>
        </div>

        {/* Branch Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 group">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  } bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full`}>
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Daily Calls</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{branchInfo.dailyCalls}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Satisfaction</p>
            <p className="text-2xl font-bold text-green-600">{branchInfo.satisfaction}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Agents</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{branchInfo.agents}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Branch Rating</p>
            <p className="text-2xl font-bold text-yellow-600">4.7 ★</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.path} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${action.textColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{action.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Agents */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiAward className="text-green-600" />
                Top Performing Agents
              </h2>
              <Link to="/branch-manager/agents" className="text-sm text-green-600 hover:text-green-700">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {topAgents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{agent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{agent.calls}</p>
                      <p className="text-xs text-gray-500">calls</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{agent.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">rating</p>
                    </div>
                    <div className={`w-2 h-2 ${getStatusColor(agent.status)} rounded-full`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiCalendar className="text-green-600" />
                Today's Schedule
              </h2>
              <Link to="/branch-manager/schedule" className="text-sm text-green-600 hover:text-green-700">
                View Full
              </Link>
            </div>
            <div className="space-y-3">
              {scheduleToday.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.time}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.agent}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Performance</h2>
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiDownload className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiRefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4">
            {performanceData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1">
                  <div 
                    className="w-8 bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                    style={{ height: `${(item.calls / 60) * 140}px` }}
                  >
                    <div className="text-xs text-white text-center mt-1 opacity-0 hover:opacity-100 transition-opacity">
                      {item.calls}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.rating}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Daily Calls</span>
            </div>
            <div className="flex items-center gap-2">
              <FiStar className="w-3 h-3 text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <FiUserCheck className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">Sarah Wilson</span> completed 45 calls today
                </p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <FiStar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">Michael Brown</span> received 5-star rating
                </p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <FiClock className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">Emily Davis</span> started training session
                </p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BranchManagerLayout>
  );
};

export default BranchManagerDashboard;