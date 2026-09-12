import React, { useState } from 'react';
import { Trash2, Minus, Plus, Tag, ArrowRight, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutModal from '../components/CheckoutModal';

const CartPage = ({ onNavigate }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    deliveryFee,
    total
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = await applyCoupon(promoInput);
    if (success) {
      setPromoInput('');
    }
  };

  return (
    <div style={{ padding: '24px 0 80px 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '28px'
        }}>
          <button onClick={() => onNavigate('home')} style={{ color: 'var(--color-text-secondary)' }}>
            Home
          </button>
          <ChevronRight size={14} />
          <span style={{ color: '#000000', fontWeight: 600 }}>Cart</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          marginBottom: '32px'
        }}>
          YOUR CART
        </h1>

        {cartItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'var(--color-bg-light)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <ShoppingBag size={56} color="rgba(0,0,0,0.3)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Your cart is empty</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
              Looks like you haven't added any garments to your cart yet.
            </p>
            <button onClick={() => onNavigate('shop')} className="btn-primary">
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* Left: Cart Items List */}
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              backgroundColor: '#ffffff'
            }}>
              {cartItems.map((item, idx) => (
                <div key={item.id}>
                  <div style={{
                    display: 'flex',
                    gap: '18px',
                    alignItems: 'center',
                    padding: '12px 0'
                  }}>
                    {/* Item Thumbnail */}
                    <div style={{
                      width: '105px',
                      height: '115px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#F0EEED',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Item Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4
                          onClick={() => onNavigate('product', { productId: item.productId })}
                          style={{
                            fontSize: '1.1rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            lineHeight: 1.2
                          }}
                        >
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ color: '#FF3333', padding: '4px', cursor: 'pointer' }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        Size: <span style={{ color: '#000000', fontWeight: 600 }}>{item.size}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        Color: <span style={{ color: '#000000', fontWeight: 600 }}>{item.color}</span>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '6px'
                      }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                          ${item.price}
                        </span>

                        {/* Quantity Modifier */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#F0F0F0',
                          borderRadius: 'var(--radius-pill)',
                          padding: '6px 14px',
                          gap: '14px'
                        }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ display: 'flex', alignItems: 'center' }}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', minWidth: '16px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ display: 'flex', alignItems: 'center' }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {idx < cartItems.length - 1 && (
                    <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '12px 0' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Right: Order Summary Card */}
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '24px'
              }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                  <span style={{ fontWeight: 700 }}>${subtotal}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Discount {coupon ? `(${coupon.code})` : '(-20%)'}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--color-badge-red)' }}>
                    -${discountAmount}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Delivery Fee</span>
                  <span style={{ fontWeight: 700 }}>
                    {deliveryFee === 0 ? (
                      <span style={{ color: 'var(--color-success)' }}>Free</span>
                    ) : (
                      `$${deliveryFee}`
                    )}
                  </span>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem' }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontWeight: 900 }}>${total}</span>
                </div>
              </div>

              {/* Promo Code Input Form */}
              <form onSubmit={handleApplyPromo} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F0F0F0',
                    borderRadius: 'var(--radius-pill)',
                    padding: '12px 18px',
                    gap: '10px',
                    flex: 1
                  }}>
                    <Tag size={18} color="rgba(0,0,0,0.4)" />
                    <input
                      type="text"
                      placeholder="Add promo code (e.g. SHOP20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      style={{ border: 'none', background: 'transparent', width: '100%', textTransform: 'uppercase' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '12px 26px', borderRadius: 'var(--radius-pill)' }}
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <div style={{ color: 'var(--color-badge-red)', fontSize: '0.82rem', marginTop: '6px' }}>
                    {couponError}
                  </div>
                )}
                {coupon && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    fontSize: '0.85rem',
                    color: 'var(--color-success)'
                  }}>
                    <span>Applied: <strong>{coupon.code}</strong> ({coupon.description || 'Active'})</span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      style={{ color: 'var(--color-badge-red)', textDecoration: 'underline' }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Go to Checkout Button */}
              <button
                onClick={() => setCheckoutOpen(true)}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  fontSize: '1rem'
                }}
              >
                <span>Go to Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderPlaced={() => {
          // Keep modal open on confirmation view
        }}
      />
    </div>
  );
};

export default CartPage;
