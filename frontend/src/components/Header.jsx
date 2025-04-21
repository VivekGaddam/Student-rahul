import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">📋</span>
        <h1>Student Management System </h1>
      </div>
      <div className="header-actions">
        <button className="refresh-btn">
          <span className="refresh-icon">🔄</span>
          Refresh
        </button>
      </div>
    </header>
  );
};

export default Header;