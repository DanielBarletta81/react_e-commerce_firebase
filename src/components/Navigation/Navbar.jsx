import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../services/authService';
import '../../styles/navbar.css';

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Daniel's E-Commerce
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/debug" className="nav-link" style={{ background: '#ff4444', padding: '4px 8px', borderRadius: '4px' }}>🐛 Debug</Link>
          
          {currentUser ? (
            <>
              <Link to="/profile" className="nav-link">Profile</Link>
              <Link to="/cart" className="nav-link">Cart</Link>
              <Link to="/orders" className="nav-link">Orders</Link>
              <Link to="/manage-products" className="nav-link">Manage Products</Link>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
