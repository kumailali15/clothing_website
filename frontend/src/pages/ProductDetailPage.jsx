import React, { useState, useEffect } from 'react';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import ReviewModal from '../components/ReviewModal';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { Check, ChevronRight, Minus, Plus, CheckCircle, SlidersHorizontal } from 'lucide-react';

const ProductDetailPage = ({ productId = 'prod-1', onNavigate }) => {
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('Large');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('reviews'); // 'details', 'reviews', 'faqs'
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewSort, setReviewSort] = useState('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        const [prodData, revData] = await Promise.all([
          api.getProductById(productId),
          api.getReviews(productId)
        ]);
        setProduct(prodData.product);
        setRelated(prodData.related || []);
        setReviews(revData || []);
        setActiveImage(0);

        if (prodData.product?.colors?.length > 0) {
          setSelectedColor(prodData.product.colors[0].name);
        }
        if (prodData.product?.sizes?.length > 0) {
          setSelectedSize(prodData.product.sizes[0]);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Loading garment details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button onClick={() => onNavigate('shop')} className="btn-primary" style={{ marginTop: '20px' }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'];

  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === 'highest') return b.rating - a.rating;
    if (reviewSort === 'lowest') return a.rating - b.rating;
    return new Date(b.date || 0) - new Date(a.date || 0);
  });

  return (
    <div style={{ padding: '24px 0 80px 0' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '32px'
        }}>
          <button onClick={() => onNavigate('home')} style={{ color: 'var(--color-text-secondary)' }}>
            Home
          </button>
          <ChevronRight size={14} />
          <button onClick={() => onNavigate('shop')} style={{ color: 'var(--color-text-secondary)' }}>
            Shop
          </button>
          <ChevronRight size={14} />
          <span style={{ textTransform: 'capitalize', color: 'var(--color-text-secondary)' }}>
            {product.gender || 'Men'}
          </span>
          <ChevronRight size={14} />
          <span style={{ textTransform: 'capitalize', color: 'var(--color-text-secondary)' }}>
            {product.category}
          </span>
          <ChevronRight size={14} />
          <span style={{ color: '#000000', fontWeight: 600 }}>
            {product.title}
          </span>
        </div>

        {/* Product Details Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          marginBottom: '72px',
          alignItems: 'start'
        }}>
          {/* Left Column: Multi-Thumbnail Gallery */}
          <div className="product-gallery" style={{ display: 'flex', gap: '16px' }}>
            {/* Thumbnails list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '130px' }}>
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: activeImage === idx ? '2px solid #000000' : '1px solid transparent',
                    backgroundColor: '#F0EEED',
                    aspectRatio: '1 / 1.1',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>

            {/* Main Big Image Preview */}
            <div style={{
              flex: 1,
              backgroundColor: '#F0EEED',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              aspectRatio: '1 / 1.15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={images[activeImage] || images[0]}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Right Column: Title, Rating, Price, Options & CTA */}
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              marginBottom: '14px'
            }}>
              {product.title}
            </h1>

            {/* Star Rating */}
            <div style={{ marginBottom: '14px' }}>
              <StarRating rating={product.rating || 4.5} size={20} />
            </div>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-black)' }}>
                ${product.price}
              </span>
              {product.originalPrice && (
                <span style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'rgba(0, 0, 0, 0.3)',
                  textDecoration: 'line-through'
                }}>
                  ${product.originalPrice}
                </span>
              )}
              {product.discount && (
                <span className="badge-discount" style={{ fontSize: '0.95rem', padding: '6px 14px' }}>
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.98rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              marginBottom: '24px'
            }}>
              {product.description}
            </p>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '24px 0' }} />

            {/* Select Colors */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                Select Colors
              </div>
              <div style={{ display: 'flex', gap: '14px' }}>
                {product.colors && product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: c.hex || '#333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: selectedColor === c.name ? '0 0 0 2px #000000' : 'none'
                    }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <Check size={18} color="#ffffff" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '24px 0' }} />

            {/* Choose Size */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                Choose Size
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {['Small', 'Medium', 'Large', 'X-Large'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`badge-tag ${selectedSize === sz ? 'active' : ''}`}
                    style={{
                      padding: '12px 24px',
                      fontSize: '0.95rem',
                      fontWeight: 600
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '24px 0' }} />

            {/* Quantity Selector + Add To Cart CTA */}
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
              {/* Quantity Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F0F0F0',
                borderRadius: 'var(--radius-pill)',
                padding: '12px 20px',
                gap: '24px'
              }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ display: 'flex', alignItems: 'center' }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '20px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ display: 'flex', alignItems: 'center' }}
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Large Add to Cart Button */}
              <button
                onClick={() => addToCart(product, quantity, selectedSize, selectedColor)}
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '16px 36px',
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <section style={{ marginBottom: '80px' }}>
          {/* Tab navigation headers */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '36px'
          }}>
            {[
              { id: 'details', label: 'Product Details' },
              { id: 'reviews', label: `Rating & Reviews (${reviews.length})` },
              { id: 'faqs', label: 'FAQs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '16px',
                  fontSize: '1.05rem',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? '#000000' : 'var(--color-text-secondary)',
                  borderBottom: activeTab === tab.id ? '2px solid #000000' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: PRODUCT DETAILS */}
          {activeTab === 'details' && (
            <div style={{ maxWidth: '720px', lineHeight: 1.8 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>Garment Specifications</h3>
              <ul style={{ paddingLeft: '20px', marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
                {product.details ? (
                  product.details.map((d, idx) => <li key={idx} style={{ marginBottom: '6px' }}>{d}</li>)
                ) : (
                  <>
                    <li>100% Premium Cotton fabric</li>
                    <li>Reinforced stitching along hems and collar</li>
                    <li>Pre-shrunk fabric to retain shape after washes</li>
                    <li>Designed in modern urban streetwear fit</li>
                  </>
                )}
              </ul>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Stock availability: <strong>{product.stock || 25} items</strong> currently in warehouse.
              </p>
            </div>
          )}

          {/* TAB 2: RATINGS & REVIEWS */}
          {activeTab === 'reviews' && (
            <div>
              {/* Review Controls Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '28px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>All Reviews</h3>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                    ({reviews.length})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F0F0F0', padding: '8px 16px', borderRadius: 'var(--radius-pill)', fontSize: '0.88rem' }}>
                    <SlidersHorizontal size={16} />
                    <select
                      value={reviewSort}
                      onChange={(e) => setReviewSort(e.target.value)}
                      style={{ border: 'none', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}
                    >
                      <option value="latest">Latest</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="btn-primary"
                    style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Reviews Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '20px'
              }}>
                {sortedReviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <StarRating rating={rev.rating} showScore={false} size={18} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{rev.author}</span>
                      {rev.verified && (
                        <CheckCircle size={16} fill="#01AB31" color="#ffffff" />
                      )}
                    </div>
                    <p style={{
                      fontSize: '0.92rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.55
                    }}>
                      "{rev.content}"
                    </p>
                    <div style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)',
                      marginTop: 'auto',
                      paddingTop: '8px'
                    }}>
                      Posted on {rev.date || 'Recent'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FAQS */}
          {activeTab === 'faqs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '720px' }}>
              <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-light)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>What is the shipping time?</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  Standard delivery takes 3-5 business days. Express next-day shipping is available at checkout.
                </p>
              </div>
              <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-light)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>What is your return policy?</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  We offer a 30-day money-back guarantee for unworn items with original tags attached.
                </p>
              </div>
              <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-light)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>How do I choose the correct size?</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  Our fits are standard streetwear proportions. For an oversized look, we recommend sizing up by one size.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* YOU MIGHT ALSO LIKE SECTION */}
        {related.length > 0 && (
          <section>
            <h2 className="heading-section" style={{ marginBottom: '48px' }}>
              YOU MIGHT ALSO LIKE
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px'
            }}>
              {related.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onClick={() => onNavigate('product', { productId: prod.id })}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productId={product.id}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default ProductDetailPage;
