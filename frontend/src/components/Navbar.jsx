import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, Check, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Navbar = ({ onNavigate, currentPage, onOpenAdmin }) => {
  const { totalItemCount } = useCart();
  const { user, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef(null);

  // Live search debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await api.getProducts({ search: searchQuery, limit: 5 });
        setSearchResults(data.products || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search and dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (product) => {
    setSearchQuery('');
    setSearchResults([]);
    setMobileSearchOpen(false);
    onNavigate('product', { productId: product.id });
  };

  const handleCategoryClick = (categoryOrStyle) => {
    setShopDropdownOpen(false);
    setMobileMenuOpen(false);
    onNavigate('shop', { filter: categoryOrStyle });
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container" style={{
        height: '75px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        {/* Mobile Hamburger & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.85rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#000000',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            SHOP.CO
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Shop Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '1rem',
                fontWeight: 500,
                color: '#000000',
                padding: '8px 0'
              }}
            >
              Shop <ChevronDown size={16} />
            </button>

            {shopDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: '#ffffff',
                boxShadow: 'var(--shadow-md)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                minWidth: '220px',
                zIndex: 60,
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Dress Styles
                </div>
                {['Casual', 'Formal', 'Party', 'Gym'].map(style => (
                  <button
                    key={style}
                    onClick={() => handleCategoryClick({ dressStyle: style })}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.92rem',
                      fontWeight: 500,
                      color: 'var(--color-text-primary)'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-bg-light)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {style}
                  </button>
                ))}
                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '8px 0' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Categories
                </div>
                {['t-shirts', 'jeans', 'shirts', 'hoodies', 'shorts'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick({ category: cat })}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.92rem',
                      textTransform: 'capitalize',
                      fontWeight: 500,
                      color: 'var(--color-text-primary)'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-bg-light)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="#sale"
            onClick={(e) => { e.preventDefault(); onNavigate('shop', { onSale: true }); }}
            style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-primary)' }}
          >
            On Sale
          </a>
          <a
            href="#new-arrivals"
            onClick={(e) => { e.preventDefault(); onNavigate('shop', { newArrivals: true }); }}
            style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-primary)' }}
          >
            New Arrivals
          </a>
          <a
            href="#brands"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage !== 'home') onNavigate('home');
              setTimeout(() => {
                const el = document.getElementById('brands-banner');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-primary)' }}
          >
            Brands
          </a>
        </nav>

        {/* Search Bar with live autocomplete */}
        <div ref={searchRef} className="search-bar-container" style={{
          position: 'relative',
          flex: 1,
          maxWidth: '560px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F0F0F0',
            borderRadius: 'var(--radius-pill)',
            padding: '12px 18px',
            gap: '12px'
          }}>
            <Search size={20} color="rgba(0, 0, 0, 0.4)" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '0.95rem',
                color: '#000000'
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ color: 'rgba(0,0,0,0.4)' }}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Autocomplete Results Dropdown */}
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              maxHeight: '380px',
              overflowY: 'auto',
              zIndex: 70
            }}>
              {searchResults.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{prod.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                      {prod.category} • {prod.dressStyle}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    ${prod.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Admin CRUD Dashboard Trigger */}
          <button
            onClick={onOpenAdmin}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
            title="Manage Products (CRUD & Uploads)"
          >
            <Settings size={14} /> Admin
          </button>

          {/* Mobile search trigger */}
          <button
            className="mobile-search-btn"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            style={{ display: 'none', padding: '6px' }}
            aria-label="Search"
          >
            <Search size={22} />
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => onNavigate('cart')}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px'
            }}
            aria-label="View shopping cart"
          >
            <ShoppingCart size={22} color="#000000" />
            {totalItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-4px',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {totalItemCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                if (user) {
                  setUserDropdownOpen(!userDropdownOpen);
                } else {
                  openAuthModal('login');
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                cursor: 'pointer'
              }}
              aria-label="User profile"
            >
              <User size={22} color="#000000" />
            </button>

            {/* User Dropdown */}
            {user && userDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                right: 0,
                backgroundColor: '#ffffff',
                boxShadow: 'var(--shadow-md)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                minWidth: '220px',
                zIndex: 60,
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{user.email}</div>
                </div>
                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '8px 0' }} />
                <button
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 4px',
                    color: 'var(--color-badge-red)',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Input Strip */}
      {mobileSearchOpen && (
        <div style={{
          padding: '10px 16px',
          backgroundColor: '#F9FAFB',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F0F0F0',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 14px',
            gap: '8px',
            flex: 1
          }}>
            <Search size={18} color="rgba(0,0,0,0.4)" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 100,
          display: 'flex'
        }}>
          <div style={{
            width: '280px',
            backgroundColor: '#ffffff',
            height: '100%',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900 }}>SHOP.CO</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('shop'); }}
                style={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: 600 }}
              >
                All Products
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('shop', { onSale: true }); }}
                style={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: 600 }}
              >
                On Sale
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('shop', { newArrivals: true }); }}
                style={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: 600 }}
              >
                New Arrivals
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('shop', { filter: { dressStyle: 'Casual' } }); }}
                style={{ textAlign: 'left', fontSize: '1rem', color: 'var(--color-text-secondary)' }}
              >
                Casual Wear
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('shop', { filter: { dressStyle: 'Formal' } }); }}
                style={{ textAlign: 'left', fontSize: '1rem', color: 'var(--color-text-secondary)' }}
              >
                Formal Wear
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('shop', { filter: { dressStyle: 'Party' } }); }}
                style={{ textAlign: 'left', fontSize: '1rem', color: 'var(--color-text-secondary)' }}
              >
                Party Wear
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('shop', { filter: { dressStyle: 'Gym' } }); }}
                style={{ textAlign: 'left', fontSize: '1rem', color: 'var(--color-text-secondary)' }}
              >
                Gym & Activewear
              </button>
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              {user ? (
                <div>
                  <div style={{ fontWeight: 600 }}>{user.name}</div>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ color: 'var(--color-badge-red)', marginTop: '8px', fontWeight: 600 }}>
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive CSS for Navbar */}
      <style>{`
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .search-bar-container {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .mobile-search-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
