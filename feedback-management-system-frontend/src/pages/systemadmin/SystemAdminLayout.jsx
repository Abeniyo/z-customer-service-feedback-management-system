import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import SystemAdminSidebar from './SystemAdminSidebar';

// Import React Icons
import { 
  FiSun,
  FiMoon,
  FiBell,
  FiSearch,
  FiUser,
  FiChevronDown
} from 'react-icons/fi';

const SystemAdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      <SystemAdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">


        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemAdminLayout;