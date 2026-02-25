import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BranchManagerLayout from './BranchManagerLayout';

// Import React Icons
import { 
  FiCalendar, 
  FiClock, 
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

const BranchSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const scheduleData = [
    { 
      day: 'Mon',
      date: '26',
      shifts: [
        { time: '09:00 - 17:00', agents: ['Sarah Wilson', 'Michael Brown', 'James Miller'], type: 'morning', status: 'ongoing' },
        { time: '13:00 - 21:00', agents: ['Emily Davis', 'Robert Taylor'], type: 'afternoon', status: 'upcoming' },
      ]
    },
    { 
      day: 'Tue',
      date: '27',
      shifts: [
        { time: '09:00 - 17:00', agents: ['Sarah Wilson', 'Michael Brown', 'Lisa Anderson'], type: 'morning', status: 'upcoming' },
        { time: '13:00 - 21:00', agents: ['Emily Davis', 'Robert Taylor'], type: 'afternoon', status: 'upcoming' },
      ]
    },
    { 
      day: 'Wed',
      date: '28',
      shifts: [
        { time: '09:00 - 17:00', agents: ['Sarah Wilson', 'James Miller', 'Lisa Anderson'], type: 'morning', status: 'upcoming' },
        { time: '13:00 - 21:00', agents: ['Emily Davis', 'Michael Brown'], type: 'afternoon', status: 'upcoming' },
      ]
    },
    { 
      day: 'Thu',
      date: '29',
      shifts: [
        { time: '09:00 - 17:00', agents: ['Sarah Wilson', 'Michael Brown', 'James Miller'], type: 'morning', status: 'upcoming' },
        { time: '13:00 - 21:00', agents: ['Emily Davis', 'Robert Taylor'], type: 'afternoon', status: 'upcoming' },
      ]
    },
    { 
      day: 'Fri',
      date: '01',
      shifts: [
        { time: '09:00 - 17:00', agents: ['Sarah Wilson', 'Michael Brown', 'Lisa Anderson'], type: 'morning', status: 'upcoming' },
        { time: '13:00 - 21:00', agents: ['Emily Davis', 'James Miller'], type: 'afternoon', status: 'upcoming' },
      ]
    },
    { 
      day: 'Sat',
      date: '02',
      shifts: [
        { time: '10:00 - 16:00', agents: ['Robert Taylor', 'Lisa Anderson'], type: 'weekend', status: 'upcoming' },
      ]
    },
    { 
      day: 'Sun',
      date: '03',
      shifts: [
        { time: '10:00 - 16:00', agents: ['Emily Davis', 'James Miller'], type: 'weekend', status: 'upcoming' },
      ]
    },
  ];

  const agentAvailability = [
    { name: 'Sarah Wilson', status: 'available', nextShift: 'Today 09:00' },
    { name: 'Michael Brown', status: 'available', nextShift: 'Today 09:00' },
    { name: 'Emily Davis', status: 'on-shift', nextShift: 'Now - 21:00' },
    { name: 'James Miller', status: 'available', nextShift: 'Today 09:00' },
    { name: 'Lisa Anderson', status: 'off', nextShift: 'Tomorrow 09:00' },
    { name: 'Robert Taylor', status: 'on-shift', nextShift: 'Now - 21:00' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'ongoing': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-l-4 border-green-500';
      case 'upcoming': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-l-4 border-blue-500';
      case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400 border-l-4 border-gray-500';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getAgentStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-500';
      case 'on-shift': return 'bg-blue-500';
      case 'off': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <BranchManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule Management</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <FiPlus className="w-4 h-4" />
              Create Schedule
            </button>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-1">
                <button className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setView('day')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'day' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                Day
              </button>
              <button 
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'week' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                Week
              </button>
              <button 
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'month' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {days.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {scheduleData.map((item, index) => (
                <div key={index} className="min-h-[200px] bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.date}</span>
                  </div>
                  <div className="space-y-2">
                    {item.shifts.map((shift, shiftIndex) => (
                      <div 
                        key={shiftIndex} 
                        className={`text-xs p-2 rounded cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(shift.status)}`}
                      >
                        <p className="font-medium">{shift.time}</p>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{shift.agents.length} agents</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Availability */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiUsers className="text-green-600" />
              Agent Availability
            </h2>
            <div className="space-y-3">
              {agentAvailability.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 ${getAgentStatusColor(agent.status)} rounded-full`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{agent.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{agent.nextShift}</p>
                    </div>
                  </div>
                  <span className="text-xs capitalize text-gray-600 dark:text-gray-400">{agent.status}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">On Shift Now</span>
                <span className="font-medium text-green-600">2 agents</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500 dark:text-gray-400">Available</span>
                <span className="font-medium text-blue-600">3 agents</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500 dark:text-gray-400">Off Duty</span>
                <span className="font-medium text-gray-600">1 agent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Shifts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Shifts</h2>
          <div className="space-y-3">
            {scheduleData.slice(0, 3).map((item, index) => (
              item.shifts.map((shift, shiftIndex) => (
                <div key={`${index}-${shiftIndex}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.day}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                    </div>
                    <FiClock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{shift.time}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{shift.agents.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(shift.status)}`}>
                      {shift.status}
                    </span>
                    <button className="p-1 text-green-600 hover:text-green-700">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </BranchManagerLayout>
  );
};

export default BranchSchedule;