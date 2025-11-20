import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../App.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Decode token to get user information
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        // If token is invalid, clear it and redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Navigate to login page
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <Link to="/dashboard" style={styles.brandLink}>
            Sistem Presensi
          </Link>
        </div>
        
        <div style={styles.menu}>
          <Link to="/dashboard" style={styles.menuItem}>
            Dashboard
          </Link>
          
          {/* Show "Laporan Admin" only if user role is admin */}
          {user && user.role === 'admin' && (
            <Link to="/admin/reports" style={styles.menuItem}>
              Laporan Admin
            </Link>
          )}
          
          <div style={styles.userInfo}>
            {user && (
              <span style={styles.userName}>
                Halo, {user.nama}
              </span>
            )}
          </div>
          
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  brandLink: {
    color: '#ecf0f1',
    textDecoration: 'none',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  menuItem: {
    color: '#ecf0f1',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  userInfo: {
    color: '#ecf0f1',
    marginLeft: '1rem',
  },
  userName: {
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
};

export default Navbar;
