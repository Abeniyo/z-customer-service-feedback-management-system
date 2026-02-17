import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminPage from './pages/admin/AdminPage';
import CallCenterPage from './pages/callcenter/CallCenterPage';
import SystemAdminPage from './pages/systemadmin/SystemAdminPage';
import './styles/global.css';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route 
        path="/admin" 
        element={
          <PrivateRoute allowedRoles={['admin', 'systemadmin']}>
            <AdminPage />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/callcenter" 
        element={
          <PrivateRoute allowedRoles={['callcenter', 'admin', 'systemadmin']}>
            <CallCenterPage />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/systemadmin" 
        element={
          <PrivateRoute allowedRoles={['systemadmin']}>
            <SystemAdminPage />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={`/${user.role}`} />
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
    </Routes>
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