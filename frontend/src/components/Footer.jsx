import React from 'react';

const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const Footer = ({ onNavigate }) => {
  return (
    <footer style={{
      backgroundColor: '#F0F0F0',
      paddingTop: '140px',
      paddingBottom: '40px',
      marginTop: '60px',
      borderTop: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      <div className="container">
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand & About */}
          <div style={{ maxWidth: '280px' }}>
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('home'); }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#000000',
                letterSpacing: '-0.04em',
                display: 'block',
                marginBottom: '16px'
              }}
            >
              SHOP.CO
            </a>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              marginBottom: '24px'
            }}>
              We have clothes that suits your style and which you're proud to wear. From women to men, curated for modern streetwear.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: TwitterIcon, href: '#' },
                { icon: FacebookIcon, href: '#' },
                { icon: InstagramIcon, href: '#' },
                { icon: GithubIcon, href: '#' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000000',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#000000';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#000000';
                    }}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h4 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-black)',
              marginBottom: '20px'
            }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['About', 'Features', 'Works', 'Career'].map((link) => (
                <li key={link}>
                  <a href="#" style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h4 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-black)',
              marginBottom: '20px'
            }}>
              Help
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a href="#" style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h4 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-black)',
              marginBottom: '20px'
            }}>
              FAQ
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Account', 'Manage Deliveries', 'Orders', 'Payments'].map((link) => (
                <li key={link}>
                  <a href="#" style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-black)',
              marginBottom: '20px'
            }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Free eBooks', 'Development Tutorial', 'How to - Blog', 'Youtube Playlist'].map((link) => (
                <li key={link}>
                  <a href="#" style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', marginBottom: '24px' }} />

        {/* Bottom Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            Shop.co © 2000-2026, All Rights Reserved
          </p>

          {/* Payment Badges */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'].map((badge) => (
              <span
                key={badge}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#1E293B'
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
