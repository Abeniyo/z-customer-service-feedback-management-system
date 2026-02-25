import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';


// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Landing = lazy(() => import('./pages/landing/Landing'));

// Call Center Pages
const CallCenterDashboard = lazy(() => import('./pages/callcenter/CallCenterPage'));
const NewFeedback = lazy(() => import('./pages/callcenter/NewFeedback'));
const Complain = lazy(() => import('./pages/callcenter/ComplainManagement'));
const Customers = lazy(() => import('./pages/callcenter/Customers'));
const MyReports = lazy(() => import('./pages/callcenter/MyReports'));
const FocalManagement = lazy(() => import('./pages/callcenter/FocalManagement'));

// Admin Pages (create these similarly)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminAgents = lazy(() => import('./pages/admin/AdminAgents'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));

// System Admin Pages (create these similarly)
const SystemDashboard = lazy(() => import('./pages/systemadmin/SystemAdminDashboard'));
const CompanyBranchManagement = lazy(() => import('./pages/systemadmin/CompanyBranchManagement'));
const SystemUsers = lazy(() => import('./pages/systemadmin/SystemUsers'));
const DatabaseBackup = lazy(() => import('./pages/systemadmin/DatabaseBackup'));
const SystemHealth = lazy(() => import('./pages/systemadmin/SystemHealth'));



const BranchManagerDashboard = lazy(() => import('./pages/manager/BranchManagerDashboard'));
const BranchAgents = lazy(() => import('./pages/manager/BranchAgents'));
const BranchCalls = lazy(() => import('./pages/manager/BranchCalls'));
const BranchPerformance = lazy(() => import('./pages/manager/BranchPerformance'));
const BranchSchedule = lazy(() => import('./pages/manager/BranchSchedule'));
const BranchReports = lazy(() => import('./pages/manager/BranchReports'));
const BranchInfo = lazy(() => import('./pages/manager/BranchInfo'));
const BranchSettings = lazy(() => import('./pages/manager/BranchSettings'));
const BranchProfile = lazy(() => import('./pages/manager/BranchProfile'));
const BranchHelp = lazy(() => import('./pages/manager/BranchHelp'));



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
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
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
          path="/callcenter/focal" 
          element={
            <PrivateRoute allowedRoles={['callcenter', 'admin', 'systemadmin']}>
              <FocalManagement />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/callcenter/complain" 
          element={
            <PrivateRoute allowedRoles={['callcenter', 'admin', 'systemadmin']}>
              <Complain />
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
        path="/admin/dashboard" 
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

      {/* Optional: Keep the simple page if needed */}
      <Route 
        path="/admin/simple" 
        element={
          <PrivateRoute allowedRoles={['admin', 'systemadmin']}>
            <AdminPage />
          </PrivateRoute>
        } 
      />
        
<Route 
                path="/systemadmin" 
                element={
                  <PrivateRoute allowedRoles={['systemadmin']}>
                    <SystemDashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/systemadmin/dashboard" 
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
                path="/systemadmin/company" 
                element={
                  <PrivateRoute allowedRoles={['systemadmin']}>
                    <CompanyBranchManagement />
                  </PrivateRoute>
                } 
              />              
              <Route 
                path="/systemadmin/backup" 
                element={
                  <PrivateRoute allowedRoles={['systemadmin']}>
                    <DatabaseBackup />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/systemadmin/system-health" 
                element={
                  <PrivateRoute allowedRoles={['systemadmin']}>
                    <SystemHealth />
                  </PrivateRoute>
                } 
              />





{/* Branch Manager Routes */}
<Route 
  path="/manager" 
  element={
    <PrivateRoute allowedRoles={['manager', 'admin', 'systemadmin']}>
      <BranchManagerDashboard />
    </PrivateRoute>
  } 
/>

<Route 
  path="/manager/dashboard" 
  element={
    <PrivateRoute allowedRoles={['manager', 'admin', 'systemadmin']}>
      <BranchManagerDashboard />
    </PrivateRoute>
  } 
/>

<Route 
  path="/manager/agents" 
  element={
    <PrivateRoute allowedRoles={['manager', 'admin', 'systemadmin']}>
      <BranchAgents />
    </PrivateRoute>
  } 
/>

<Route 
  path="/manager/calls" 
  element={
    <PrivateRoute allowedRoles={['manager', 'admin', 'systemadmin']}>
      <BranchCalls />
    </PrivateRoute>
  } 
/>

    <Route 
      path="/manager/performance" 
      element={
        <PrivateRoute allowedRoles={['manager', 'admin', 'systemadmin']}>
          <BranchPerformance />
        </PrivateRoute>
      } 
    />

    <Route 
      path="/manager/schedule" 
      element={
        <PrivateRoute allowedRoles={['manager', 'admin', 'systemadmin']}>
          <BranchSchedule />
        </PrivateRoute>
      } 
    />

    <Route 
      path="/manager/reports" 
      element={
        <PrivateRoute allowedRoles={['manager', 'admin', 'systemadmin']}>
          <BranchReports />
        </PrivateRoute>
      } 
    />

    <Route 
      path="/manager/branch-info" 
      element={
        <PrivateRoute allowedRoles={['manager', 'admin', 'systemadmin']}>
          <BranchInfo />
        </PrivateRoute>
      } 
    />

    <Route 
      path="/manager/settings" 
      element={
        <PrivateRoute allowedRoles={['manager', 'admin', 'systemadmin']}>
          <BranchSettings />
        </PrivateRoute>
      } 
    />

    <Route 
      path="/manager/profile" 
      element={
        <PrivateRoute allowedRoles={['manager', 'admin', 'systemadmin']}>
          <BranchProfile />
        </PrivateRoute>
      } 
    />

    <Route 
      path="/manager/help" 
      element={
        <PrivateRoute allowedRoles={['manager', 'admin', 'systemadmin']}>
          <BranchHelp />
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