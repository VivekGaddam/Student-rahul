import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800); // Slightly shorter than the parent timeout to allow for animation
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`toast ${type} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="toast-icon">
        {type === 'success' ? '✓' : '✕'}
      </div>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;