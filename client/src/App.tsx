import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { CreateAdPage } from './pages/CreateAdPage';
import { ModeratorDashboard } from './pages/ModeratorDashboard';
import { BrowseAdsPage } from './pages/BrowseAdsPage';
import { AdDetailPage } from './pages/AdDetailPage';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            user?.role === 'client' ? <Navigate to="/dashboard" /> : <Navigate to={`/${user?.role}-dashboard`} />
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-ad" 
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <CreateAdPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/explore" element={<BrowseAdsPage />} />
      <Route path="/ads/:slug" element={<AdDetailPage />} />
      <Route 
        path="/moderator-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['moderator', 'admin']}>
            <ModeratorDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
