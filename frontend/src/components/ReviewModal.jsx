import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { api } from '../services/api';

const ReviewModal = ({ isOpen, onClose, productId, onReviewSubmitted }) => {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      setError('Please provide your name and review details.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const newReview = await api.addReview({
        productId,
        author,
        rating,
        content
      });
      if (onReviewSubmitted) onReviewSubmitted(newReview);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.5rem',
          fontWeight: 900,
          marginBottom: '6px'
        }}>
          Write a Review
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
          Share your feedback with the SHOP.CO community.
        </p>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#DC2626',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Star Rating Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Your Overall Rating
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ padding: '4px' }}
                >
                  <Star
                    size={28}
                    color="#FFC633"
                    fill={(hoverRating || rating) >= star ? '#FFC633' : '#E5E7EB'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. Samantha Davis"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#F0F0F0',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '12px 18px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Review Description
            </label>
            <textarea
              rows={4}
              placeholder="What did you like or dislike about this product? How did it fit?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#F0F0F0',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '12px 18px',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Submitting...' : 'Post Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
