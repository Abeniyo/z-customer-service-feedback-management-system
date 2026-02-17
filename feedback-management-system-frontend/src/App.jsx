import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';


// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));

// Call Center Pages
const CallCenterDashboard = lazy(() => import('./pages/callcenter/CallCenterPage'));
const NewFeedback = lazy(() => import('./pages/callcenter/NewFeedback'));
const Customers = lazy(() => import('./pages/callcenter/Customers'));
const MyReports = lazy(() => import('./pages/callcenter/MyReports'));

// Admin Pages (create these similarly)
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminAgents = lazy(() => import('./pages/admin/Agents'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));

// System Admin Pages (create these similarly)
const SystemDashboard = lazy(() => import('./pages/systemadmin/Dashboard'));
const SystemUsers = lazy(() => import('./pages/systemadmin/Users'));
const SystemAuditLogs = lazy(() => import('./pages/systemadmin/AuditLogs'));
const SystemSettings = lazy(() => import('./pages/systemadmin/Settings'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

// Private Route Component
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <PageLoader />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <PageLoader />;
  
  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Call Center Routes */}
        <Route 
          path="/callcenter" 
          element={
            <PrivateRoute allowedRoles={['callcenter', 'admin', 'systemadmin']}>
              <CallCenterDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/callcenter/new-feedback" 
          element={
            <PrivateRoute allowedRoles={['callcenter', 'admin', 'systemadmin']}>
              <NewFeedback />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/callcenter/customers" 
          element={
            <PrivateRoute allowedRoles={['callcenter', 'admin', 'systemadmin']}>
              <Customers />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/callcenter/my-reports" 
          element={
            <PrivateRoute allowedRoles={['callcenter', 'admin', 'systemadmin']}>
              <MyReports />
            </PrivateRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <PrivateRoute allowedRoles={['admin', 'systemadmin']}>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/agents" 
          element={
            <PrivateRoute allowedRoles={['admin', 'systemadmin']}>
              <AdminAgents />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/reports" 
          element={
            <PrivateRoute allowedRoles={['admin', 'systemadmin']}>
              <AdminReports />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/analytics" 
          element={
            <PrivateRoute allowedRoles={['admin', 'systemadmin']}>
              <AdminAnalytics />
            </PrivateRoute>
          } 
        />
        
        {/* System Admin Routes */}
        <Route 
          path="/systemadmin" 
          element={
            <PrivateRoute allowedRoles={['systemadmin']}>
              <SystemDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/systemadmin/users" 
          element={
            <PrivateRoute allowedRoles={['systemadmin']}>
              <SystemUsers />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/systemadmin/audit-logs" 
          element={
            <PrivateRoute allowedRoles={['systemadmin']}>
              <SystemAuditLogs />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/systemadmin/settings" 
          element={
            <PrivateRoute allowedRoles={['systemadmin']}>
              <SystemSettings />
            </PrivateRoute>
          } 
        />
        
        {/* Default Routes */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={`/${user.role}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Catch all - 404 */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          } 
        />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;