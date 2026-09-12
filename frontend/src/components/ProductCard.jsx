import React from 'react';
import StarRating from './StarRating';

const ProductCard = ({ product, onClick }) => {
  if (!product) return null;

  return (
    <div
      onClick={() => onClick && onClick(product)}
      className="product-card"
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'transform 0.25s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Product Image Container */}
      <div style={{
        backgroundColor: '#F0EEED',
        borderRadius: 'var(--radius-lg)',
        aspectRatio: '1 / 1.05',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        {product.discount && (
          <span
            className="badge-discount"
            style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}
          >
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--color-black)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {product.title}
        </h3>

        {/* Rating */}
        <StarRating rating={product.rating || 4.5} size={16} />

        {/* Price Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-black)' }}>
            ${product.price}
          </span>
          {product.originalPrice && (
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'rgba(0, 0, 0, 0.4)',
              textDecoration: 'line-through'
            }}>
              ${product.originalPrice}
            </span>
          )}
          {product.discount && (
            <span className="badge-discount">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
