import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const CheckoutModal = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cartItems, subtotal, discountAmount, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : 'Hamza Naeem',
    email: user ? user.email : 'hamza@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97477',
    country: 'United States',
    paymentMethod: 'Credit Card',
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName || !formData.email || !formData.address || !formData.city) {
      setErrorMessage('Please fill in all shipping fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        items: cartItems,
        subtotal,
        discount: discountAmount,
        deliveryFee,
        total,
        paymentMethod: formData.paymentMethod
      };

      const res = await api.createOrder(orderPayload);
      setCompletedOrder(res.order);
      clearCart();
      if (onOrderPlaced) onOrderPlaced(res.order);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {completedOrder ? (
          /* Order Placed Confirmation View */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle size={36} />
            </div>

            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginBottom: '8px'
            }}>
              ORDER CONFIRMED!
            </h3>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
              Thank you for shopping with SHOP.CO. Your order has been placed and saved into our backend system.
            </p>

            <div style={{
              backgroundColor: 'var(--color-bg-light)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Order ID:</span>
                <span style={{ fontWeight: 700 }}>{completedOrder.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Recipient:</span>
                <span style={{ fontWeight: 600 }}>{completedOrder.customer.fullName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Delivery To:</span>
                <span style={{ fontWeight: 600 }}>{completedOrder.customer.city}, {completedOrder.customer.country}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                <span style={{ fontWeight: 700 }}>Total Paid:</span>
                <span style={{ fontWeight: 800 }}>${completedOrder.total}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Checkout Form View */
          <div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.6rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginBottom: '4px'
            }}>
              CHECKOUT
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Enter your shipping & payment info to complete your purchase.
            </p>

            {errorMessage && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#DC2626',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                marginBottom: '16px'
              }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-black)' }}>
                1. Shipping Address
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: '#F0F0F0',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px'
                  }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: '#F0F0F0',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px'
                  }}
                />
              </div>

              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: '#F0F0F0',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px'
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: '#F0F0F0',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px'
                  }}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  style={{
                    backgroundColor: '#F0F0F0',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px'
                  }}
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Zip"
                  value={formData.postalCode}
                  onChange={handleChange}
                  style={{
                    backgroundColor: '#F0F0F0',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px'
                  }}
                />
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '8px 0' }} />

              <div style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-black)' }}>
                2. Payment Method
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {['Credit Card', 'PayPal', 'Cash on Delivery'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: formData.paymentMethod === method ? '2px solid #000000' : '1px solid var(--color-border)',
                      backgroundColor: formData.paymentMethod === method ? '#F0F0F0' : '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {formData.paymentMethod === 'Credit Card' && (
                <div style={{
                  backgroundColor: '#FAFAFA',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} />
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '8px' }}
                    />
                    <input
                      type="text"
                      name="cardCvc"
                      placeholder="CVC"
                      value={formData.cardCvc}
                      onChange={handleChange}
                      style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '8px' }}
                    />
                  </div>
                </div>
              )}

              {/* Order Total Overview */}
              <div style={{
                backgroundColor: 'var(--color-bg-light)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                marginTop: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Total ({cartItems.length} items):</span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>${total}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  <ShieldCheck size={14} color="var(--color-success)" />
                  <span>256-bit encrypted secure checkout. Saved in Express JSON.</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: '100%', marginTop: '6px' }}
              >
                {isSubmitting ? 'Placing Order...' : `Pay $${total}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
