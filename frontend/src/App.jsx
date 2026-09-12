import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import TopBanner from './components/TopBanner';
import Navbar from './components/Navbar';
import NewsletterBanner from './components/NewsletterBanner';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';

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
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner */}
      <TopBanner />

      {/* Main Navbar */}
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Dynamic Page Views */}
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'shop' && (
          <CategoryPage
            initialFilter={pageParams.filter || {}}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'product' && (
          <ProductDetailPage
            productId={pageParams.productId || 'prod-1'}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Newsletter Subscription Banner */}
      <NewsletterBanner />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Authentication Modal */}
      <AuthModal />

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
