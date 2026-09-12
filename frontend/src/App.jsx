import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'admin' || user.email === 'admin@shop.co');

  // Default entrance is 'dashboard' (Password Gate)
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageParams, setPageParams] = useState({});
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Router & Protection Logic:
  // If not logged in as Admin, lock everything behind 'dashboard' (Login Gate)
  useEffect(() => {
    if (!isAdmin) {
      setCurrentPage('dashboard');
    }
  }, [isAdmin]);

  const handleNavigate = (page, params = {}) => {
    // Force admin gate if not authenticated
    if (!isAdmin && page !== 'dashboard') {
      setCurrentPage('dashboard');
      return;
    }
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Show Top Banner only when browsing Storefront as Admin */}
      {currentPage !== 'dashboard' && <TopBanner />}

      {/* Show Main Navbar only when browsing Storefront */}
      {currentPage !== 'dashboard' && (
        <Navbar
          onNavigate={handleNavigate}
          currentPage={currentPage}
          onOpenAdmin={() => handleNavigate('dashboard')}
        />
      )}

      {/* Dynamic Page Views */}
      <main style={{ flex: 1 }}>
        {currentPage === 'dashboard' && (
          <AdminDashboardPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'home' && isAdmin && (
          <HomePage key={refreshKey} onNavigate={handleNavigate} />
        )}

        {currentPage === 'shop' && isAdmin && (
          <CategoryPage
            key={refreshKey}
            initialFilter={pageParams.filter || {}}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'product' && isAdmin && (
          <ProductDetailPage
            key={refreshKey}
            productId={pageParams.productId || 'prod-1'}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'cart' && isAdmin && (
          <CartPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Storefront Footer & Newsletter (Hidden on Dashboard View) */}
      {currentPage !== 'dashboard' && <NewsletterBanner />}
      {currentPage !== 'dashboard' && <Footer onNavigate={handleNavigate} />}

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
