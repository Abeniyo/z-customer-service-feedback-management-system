import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/landing/Header';
// import CallCenterSidebar from '../../components/landing/CallCenterSidebar';
import DashboardOverview from '../../components/landing/DashboardOverview';
import QuickActions from '../../components/landing/QuickActions';
import RecentFeedbacks from '../../components/landing/RecentFeedbacks';
import RecentComplaints from '../../components/landing/RecentComplaints';
import BranchSummary from '../../components/landing/BranchSummary';
import AnalyticsCharts from '../../components/landing/AnalyticsCharts';
import NotificationsAlerts from '../../components/landing/NotificationsAlerts';
import Footer from '../../components/landing/Footer';

const Landing = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      {/* <CallCenterSidebar 
        mobileOpen={mobileSidebarOpen} 
        setMobileOpen={setMobileSidebarOpen} 
      /> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleMobileSidebar={toggleMobileSidebar} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, John! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here's what's happening with your call center today.
              </p>
            </motion.div>

            {/* Dashboard Overview Stats */}
            <section className="mb-8">
              <DashboardOverview />
            </section>

            {/* Quick Actions and Notifications Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <QuickActions />
              </div>
              <div className="lg:col-span-1">
                <NotificationsAlerts />
              </div>
            </div>

            {/* Recent Feedbacks and Complaints Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <RecentFeedbacks />
              <RecentComplaints />
            </div>

            {/* Analytics Charts */}
            <section className="mb-8">
              <AnalyticsCharts />
            </section>

            {/* Branch Summary */}
            <section className="mb-8">
              <BranchSummary />
            </section>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Landing;