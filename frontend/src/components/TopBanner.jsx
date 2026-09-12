import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TopBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { openAuthModal } = useAuth();

  if (!isVisible) return null;

  return (
    <div style={{
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '9px 16px',
      fontSize: '0.88rem',
      position: 'relative',
      zIndex: 40
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center' }}>
          <span>Sign up and get 20% off to your first order. </span>
          <button
            onClick={() => openAuthModal('register')}
            style={{
              color: '#ffffff',
              textDecoration: 'underline',
              fontWeight: 600,
              marginLeft: '4px',
              cursor: 'pointer'
            }}
          >
            Sign Up Now
          </button>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss banner"
          style={{
            position: 'absolute',
            right: 0,
            color: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopBanner;
