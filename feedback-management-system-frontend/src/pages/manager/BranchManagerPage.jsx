import React from 'react';
import BranchManagerLayout from './BranchManagerLayout';

const BranchManagerPage = () => {
  return (
    <BranchManagerLayout>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Branch Manager Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to the Branch Manager Portal</p>
      </div>
    </BranchManagerLayout>
  );
};

export default BranchManagerPage;