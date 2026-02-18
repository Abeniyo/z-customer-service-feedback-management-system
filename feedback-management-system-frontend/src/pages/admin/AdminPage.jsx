import React from 'react';
import AdminLayout from './AdminLayout';

const AdminPage = () => {
  return (
    <AdminLayout>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to the Admin Panel</p>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;