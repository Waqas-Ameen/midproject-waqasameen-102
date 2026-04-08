import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">AdFlow Pro</Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/explore" className="text-gray-700 hover:text-blue-600">Explore</Link>
            <Link to="/packages" className="text-gray-700 hover:text-blue-600">Packages</Link>
            
            {user ? (
              <>
                {user.role === 'client' && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
                )}
                {(user.role === 'moderator' || user.role === 'admin' || user.role === 'super_admin') && (
                  <Link to="/moderator" className="text-gray-700 hover:text-blue-600">Moderator</Link>
                )}
                {user.role === 'admin' || user.role === 'super_admin' && (
                  <>
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin</Link>
                    <Link to="/analytics" className="text-gray-700 hover:text-blue-600">Analytics</Link>
                  </>
                )}
                <span className="text-gray-700">Welcome, {user.full_name}</span>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;