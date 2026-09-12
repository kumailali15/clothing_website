import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import TopBanner from './components/TopBanner';
import Navbar from './components/Navbar';
import NewsletterBanner from './components/NewsletterBanner';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AdminProductModal from './components/AdminProductModal';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Toast Notification Consumer
const GlobalToast = () => {
  const { toastMessage } = useCart();
  if (!toastMessage) return null;
  return (
    <div className="toast-banner">
      <span>{toastMessage}</span>
    </div>
  );
};

function MainApp() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path === '/dashboard' || path.startsWith('/dashboard') || hash === '#dashboard') {
      return 'dashboard';
    }
    return 'home';
  });

  const [pageParams, setPageParams] = useState({});
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Sync URL hash/path
  useEffect(() => {
    const handleLocationCheck = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/dashboard' || path.startsWith('/dashboard') || hash === '#dashboard') {
        setCurrentPage('dashboard');
      }
    };

    window.addEventListener('popstate', handleLocationCheck);
    window.addEventListener('hashchange', handleLocationCheck);
    return () => {
      window.removeEventListener('popstate', handleLocationCheck);
      window.removeEventListener('hashchange', handleLocationCheck);
    };
  }, []);

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    if (page === 'dashboard') {
      window.history.pushState(null, '', '/dashboard');
    } else if (window.location.pathname === '/dashboard') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner */}
      {currentPage !== 'dashboard' && <TopBanner />}

      {/* Main Navbar */}
      <Navbar
        onNavigate={handleNavigate}
        currentPage={currentPage}
        onOpenAdmin={() => handleNavigate('dashboard')}
      />

      {/* Dynamic Page Views */}
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <HomePage key={refreshKey} onNavigate={handleNavigate} />
        )}

        {currentPage === 'shop' && (
          <CategoryPage
            key={refreshKey}
            initialFilter={pageParams.filter || {}}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'product' && (
          <ProductDetailPage
            key={refreshKey}
            productId={pageParams.productId || 'prod-1'}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'dashboard' && (
          <AdminDashboardPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Newsletter Subscription Banner */}
      {currentPage !== 'dashboard' && <NewsletterBanner />}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Quick Admin Product CRUD & Multer Upload Modal */}
      <AdminProductModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onProductChanged={() => setRefreshKey(prev => prev + 1)}
      />

      {/* Toast Notification */}
      <GlobalToast />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
