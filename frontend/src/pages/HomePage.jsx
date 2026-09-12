import React, { useState, useEffect } from 'react';
import BrandsBanner from '../components/BrandsBanner';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import { api } from '../services/api';
import { CheckCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const HomePage = ({ onNavigate }) => {
  const [featured, setFeatured] = useState({ newArrivals: [], topSelling: [] });
  const [reviews, setReviews] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featData, revData] = await Promise.all([
          api.getFeaturedProducts(),
          api.getReviews()
        ]);
        setFeatured(featData);
        setReviews(revData);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dressStyles = [
    {
      name: 'Casual',
      styleKey: 'Casual',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      span: 'col-span-1'
    },
    {
      name: 'Formal',
      styleKey: 'Formal',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      span: 'col-span-2'
    },
    {
      name: 'Party',
      styleKey: 'Party',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
      span: 'col-span-2'
    },
    {
      name: 'Gym',
      styleKey: 'Gym',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
      span: 'col-span-1'
    }
  ];

  const handleNextReview = () => {
    if (reviews.length > 0) {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }
  };

  const handlePrevReview = () => {
    if (reviews.length > 0) {
      setReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        backgroundColor: '#F2F0F1',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          minHeight: '660px',
          paddingTop: '40px',
          paddingBottom: '20px',
          gap: '40px'
        }}>
          {/* Left Text Column */}
          <div style={{ zIndex: 10, maxWidth: '600px' }}>
            <h1 className="heading-hero" style={{ marginBottom: '24px' }}>
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>

            <p style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--color-text-secondary)',
              marginBottom: '32px'
            }}>
              Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
            </p>

            <button
              onClick={() => onNavigate('shop')}
              className="btn-primary"
              style={{
                fontSize: '1.05rem',
                padding: '16px 54px',
                marginBottom: '48px',
                display: 'inline-flex'
              }}
            >
              Shop Now
            </button>

            {/* Statistics Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '32px'
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800 }}>200+</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>International Brands</div>
              </div>
              <div style={{ width: '1px', height: '52px', backgroundColor: 'var(--color-border)' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800 }}>2,000+</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>High-Quality Products</div>
              </div>
              <div style={{ width: '1px', height: '52px', backgroundColor: 'var(--color-border)' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800 }}>30,000+</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Right Fashion Models Visual with Star Accents */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            height: '100%',
            minHeight: '480px'
          }}>
            {/* Decorative Vector Stars */}
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '20px',
              zIndex: 2,
              animation: 'spin 12s linear infinite'
            }}>
              <svg width="76" height="76" viewBox="0 0 100 100" fill="none">
                <path d="M50 0C50 27.6142 72.3858 50 100 50C72.3858 50 50 72.3858 50 100C50 72.3858 27.6142 50 0 50C27.6142 50 50 27.6142 50 0Z" fill="#000000" />
              </svg>
            </div>

            <div style={{
              position: 'absolute',
              top: '180px',
              left: '10px',
              zIndex: 2,
              animation: 'spin 16s linear infinite'
            }}>
              <svg width="46" height="46" viewBox="0 0 100 100" fill="none">
                <path d="M50 0C50 27.6142 72.3858 50 100 50C72.3858 50 50 72.3858 50 100C50 72.3858 27.6142 50 0 50C27.6142 50 50 27.6142 50 0Z" fill="#000000" />
              </svg>
            </div>

            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=85"
              alt="Fashion Couple SHOP.CO"
              style={{
                maxHeight: '620px',
                width: 'auto',
                objectFit: 'contain',
                zIndex: 1,
                filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15))'
              }}
            />
          </div>
        </div>
      </section>

      {/* LUXURY BRANDS BANNER */}
      <BrandsBanner />

      {/* NEW ARRIVALS SECTION */}
      <section style={{ padding: '72px 0' }}>
        <div className="container">
          <h2 className="heading-section" style={{ marginBottom: '48px' }}>
            NEW ARRIVALS
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
              Loading latest arrivals...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px',
              marginBottom: '36px'
            }}>
              {featured.newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate('product', { productId: product.id })}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => onNavigate('shop', { newArrivals: true })}
              className="btn-secondary"
            >
              View All
            </button>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="container">
        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', width: '100%' }} />
      </div>

      {/* TOP SELLING SECTION */}
      <section style={{ padding: '72px 0' }}>
        <div className="container">
          <h2 className="heading-section" style={{ marginBottom: '48px' }}>
            TOP SELLING
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
              Loading top sellers...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px',
              marginBottom: '36px'
            }}>
              {featured.topSelling.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate('product', { productId: product.id })}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => onNavigate('shop', { onSale: true })}
              className="btn-secondary"
            >
              View All
            </button>
          </div>
        </div>
      </section>

      {/* BROWSE BY DRESS STYLE (BENTO GRID) */}
      <section style={{ padding: '40px 0 80px 0' }}>
        <div className="container">
          <div style={{
            backgroundColor: '#F0F0F0',
            borderRadius: 'var(--radius-xl)',
            padding: '60px 48px'
          }}>
            <h2 className="heading-section" style={{ marginBottom: '48px' }}>
              BROWSE BY DRESS STYLE
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '20px'
            }}>
              {dressStyles.map((item, idx) => {
                const isLarge = idx === 1 || idx === 2; // Formal & Party are wide
                const colSpan = isLarge ? 'span 7' : 'span 5';

                return (
                  <div
                    key={item.name}
                    className="dress-card"
                    onClick={() => onNavigate('shop', { filter: { dressStyle: item.styleKey } })}
                    style={{
                      gridColumn: colSpan,
                      height: '270px',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '24px',
                      left: '32px',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.9rem',
                      fontWeight: 800,
                      color: '#000000',
                      textShadow: '0 2px 10px rgba(255, 255, 255, 0.8)'
                    }}>
                      {item.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* OUR HAPPY CUSTOMERS CAROUSEL */}
      <section style={{ padding: '40px 0 90px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '36px'
          }}>
            <h2 className="heading-section" style={{ textAlign: 'left', margin: 0 }}>
              OUR HAPPY CUSTOMERS
            </h2>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePrevReview}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer'
                }}
                aria-label="Previous review"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextReview}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer'
                }}
                aria-label="Next review"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {reviews.slice(reviewIndex, reviewIndex + 3).concat(
              reviews.slice(0, Math.max(0, (reviewIndex + 3) - reviews.length))
            ).map((rev, idx) => (
              <div
                key={rev.id || idx}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backgroundColor: '#ffffff'
                }}
              >
                <StarRating rating={rev.rating || 5} showScore={false} size={20} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{rev.author}</span>
                  <CheckCircle size={18} fill="#01AB31" color="#ffffff" />
                </div>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5
                }}>
                  "{rev.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile styles for bento grid */}
      <style>{`
        @media (max-width: 768px) {
          .dress-card {
            grid-column: span 12 !important;
            height: 200px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
