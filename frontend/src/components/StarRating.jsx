import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 5, showScore = true, size = 18 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const totalStars = 5;

  return (
    <div className="star-rating">
      <div style={{ display: 'flex', gap: '2px' }}>
        {[...Array(totalStars)].map((_, i) => {
          const isFilled = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;

          return (
            <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
              {isHalf ? (
                <div style={{ position: 'relative', width: size, height: size }}>
                  <Star size={size} color="#E5E7EB" fill="#E5E7EB" />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
                    <Star size={size} color="#FFC633" fill="#FFC633" />
                  </div>
                </div>
              ) : (
                <Star
                  size={size}
                  color={isFilled ? '#FFC633' : '#E5E7EB'}
                  fill={isFilled ? '#FFC633' : '#E5E7EB'}
                />
              )}
            </div>
          );
        })}
      </div>
      {showScore && (
        <span className="star-score">
          {rating}
          <span className="star-max">/5</span>
        </span>
      )}
    </div>
  );
};

export default StarRating;
