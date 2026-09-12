import React, { useState } from 'react';
import { X, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login, register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (authMode === 'register') {
      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeAuthModal} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem',
            fontWeight: 900,
            letterSpacing: '-0.03em'
          }}>
            SHOP.CO
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {authMode === 'login' ? 'Welcome back! Sign in to continue' : 'Create an account to get 20% off your first order'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: '#F0F0F0',
          borderRadius: 'var(--radius-pill)',
          padding: '4px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: authMode === 'login' ? '#ffffff' : 'transparent',
              color: authMode === 'login' ? '#000000' : 'var(--color-text-secondary)',
              boxShadow: authMode === 'login' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: authMode === 'register' ? '#ffffff' : 'transparent',
              color: authMode === 'register' ? '#000000' : 'var(--color-text-secondary)',
              boxShadow: authMode === 'register' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {authMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F0F0F0',
                borderRadius: 'var(--radius-pill)',
                padding: '12px 18px',
                gap: '10px'
              }}>
                <User size={18} color="rgba(0,0,0,0.4)" />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ border: 'none', background: 'transparent', width: '100%' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F0F0F0',
              borderRadius: 'var(--radius-pill)',
              padding: '12px 18px',
              gap: '10px'
            }}>
              <Mail size={18} color="rgba(0,0,0,0.4)" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{ border: 'none', background: 'transparent', width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F0F0F0',
              borderRadius: 'var(--radius-pill)',
              padding: '12px 18px',
              gap: '10px'
            }}>
              <Lock size={18} color="rgba(0,0,0,0.4)" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ border: 'none', background: 'transparent', width: '100%' }}
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Confirm Password
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F0F0F0',
                borderRadius: 'var(--radius-pill)',
                padding: '12px 18px',
                gap: '10px'
              }}>
                <Lock size={18} color="rgba(0,0,0,0.4)" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ border: 'none', background: 'transparent', width: '100%' }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '10px', width: '100%' }}
          >
            {loading
              ? 'Processing...'
              : authMode === 'login'
              ? 'Sign In to Your Account'
              : 'Create My Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          {authMode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                style={{ color: '#000000', fontWeight: 700, textDecoration: 'underline' }}
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                style={{ color: '#000000', fontWeight: 700, textDecoration: 'underline' }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
