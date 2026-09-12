import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

const NewsletterBanner = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    try {
      const res = await api.subscribeNewsletter(email);
      setStatus('success');
      setMessage(res.message || 'Thank you for subscribing! Check your inbox.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Subscription failed, please try again.');
    }
  };

  return (
    <section style={{
      position: 'relative',
      marginBottom: '-90px',
      zIndex: 20,
      padding: '0 20px'
    }}>
      <div className="container" style={{
        backgroundColor: '#000000',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '32px'
      }}>
        {/* Left Heading */}
        <div style={{ maxWidth: '540px', flex: '1 1 300px' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase'
          }}>
            STAY UP TO DATE ABOUT OUR LATEST OFFERS
          </h2>
        </div>

        {/* Right Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          flex: '1 1 340px',
          maxWidth: '400px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-pill)',
            padding: '12px 18px',
            gap: '12px'
          }}>
            <Mail size={20} color="rgba(0, 0, 0, 0.4)" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus(null); }}
              style={{
                border: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '0.95rem',
                color: '#000000'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              fontWeight: 600,
              fontSize: '0.95rem',
              padding: '14px 24px',
              borderRadius: 'var(--radius-pill)',
              transition: 'background 0.2s',
              cursor: 'pointer'
            }}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </button>

          {message && (
            <div style={{
              color: status === 'success' ? '#4ADE80' : '#F87171',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {status === 'success' && <CheckCircle2 size={16} />}
              {message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default NewsletterBanner;
