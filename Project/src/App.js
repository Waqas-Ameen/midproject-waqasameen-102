import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ExploreAds from './pages/ExploreAds';
import AdDetail from './pages/AdDetail';
import ClientDashboard from './pages/ClientDashboard';
import ModeratorDashboard from './pages/ModeratorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Packages from './pages/Packages';
import CategoryPage from './pages/CategoryPage';
import CityPage from './pages/CityPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={<ExploreAds />} />
              <Route path="/ad/:id" element={<AdDetail />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/city/:city" element={<CityPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/moderator" element={
                <ProtectedRoute allowedRoles={['moderator', 'admin', 'super_admin']}>
                  <ModeratorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AnalyticsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;