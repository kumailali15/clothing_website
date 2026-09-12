import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { SlidersHorizontal, ChevronRight, Check, X, ArrowLeft, ArrowRight } from 'lucide-react';

const CategoryPage = ({ initialFilter = {}, onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(initialFilter.category || 'all');
  const [selectedDressStyle, setSelectedDressStyle] = useState(initialFilter.dressStyle || 'Casual');
  const [priceRange, setPriceRange] = useState(350);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'T-Shirts', value: 't-shirts' },
    { label: 'Shorts', value: 'shorts' },
    { label: 'Shirts', value: 'shirts' },
    { label: 'Hoodies', value: 'hoodies' },
    { label: 'Jeans', value: 'jeans' },
    { label: 'Jackets', value: 'jackets' }
  ];

  const dressStyles = ['Casual', 'Formal', 'Party', 'Gym'];

  const colors = [
    { name: 'Green', hex: '#00C12B' },
    { name: 'Red', hex: '#F50606' },
    { name: 'Yellow', hex: '#F5DD06' },
    { name: 'Orange', hex: '#F57906' },
    { name: 'Cyan', hex: '#06CAF5' },
    { name: 'Blue', hex: '#063AF5' },
    { name: 'Purple', hex: '#7D06F5' },
    { name: 'Pink', hex: '#F506A4' },
    { name: 'White', hex: '#FFFFFF', border: true },
    { name: 'Black', hex: '#000000' }
  ];

  const sizes = [
    'XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', '2X-Large', '3X-Large', '4X-Large'
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory !== 'all' ? selectedCategory : '',
        dressStyle: selectedDressStyle !== 'all' ? selectedDressStyle : '',
        maxPrice: priceRange,
        color: selectedColor,
        size: selectedSize,
        sort: sortBy,
        page,
        limit: 9
      };
      const res = await api.getProducts(params);
      setProducts(res.products || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sortBy]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchProducts();
    setMobileFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedDressStyle('all');
    setPriceRange(400);
    setSelectedColor('');
    setSelectedSize('');
    setSortBy('popular');
    setPage(1);
    setTimeout(() => {
      fetchProducts();
    }, 50);
  };

  return (
    <div style={{ padding: '24px 0 60px 0' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
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
          <button onClick={handleClearFilters} style={{ color: 'var(--color-text-secondary)' }}>
            Shop
          </button>
          <ChevronRight size={14} />
          <span style={{ color: '#000000', fontWeight: 600, textTransform: 'capitalize' }}>
            {selectedDressStyle !== 'all' ? selectedDressStyle : selectedCategory !== 'all' ? selectedCategory : 'All Items'}
          </span>
        </div>

        {/* Catalog Main Layout */}
        <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-start' }}>
          {/* Desktop Left Sidebar Filter */}
          <aside className="catalog-sidebar" style={{
            width: '295px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '24px',
            flexShrink: 0
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Filters</h3>
              <SlidersHorizontal size={20} color="rgba(0,0,0,0.5)" />
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '16px 0' }} />

            {/* Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    fontSize: '0.95rem',
                    fontWeight: selectedCategory === cat.value ? 700 : 500,
                    color: selectedCategory === cat.value ? '#000000' : 'var(--color-text-secondary)',
                    padding: '4px 0'
                  }}
                >
                  <span>{cat.label}</span>
                  <ChevronRight size={16} color="rgba(0,0,0,0.3)" />
                </button>
              ))}
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '20px 0' }} />

            {/* Price Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Price</span>
                <span style={{ fontWeight: 700, color: '#000000' }}>Up to ${priceRange}</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#000000', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                <span>$50</span>
                <span>$400</span>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '20px 0' }} />

            {/* Colors Swatches */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '14px' }}>Colors</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      border: c.border ? '1px solid #ccc' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: selectedColor === c.name ? '0 0 0 2px #000000' : 'none'
                    }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <Check size={16} color={c.name === 'White' || c.name === 'Yellow' ? '#000000' : '#ffffff'} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '20px 0' }} />

            {/* Sizes */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '14px' }}>Size</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                    className={`badge-tag ${selectedSize === s ? 'active' : ''}`}
                    style={{ fontSize: '0.85rem', padding: '6px 14px' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '20px 0' }} />

            {/* Dress Style */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '12px' }}>Dress Style</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dressStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedDressStyle(selectedDressStyle === style ? 'all' : style)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontSize: '0.92rem',
                      fontWeight: selectedDressStyle === style ? 700 : 500,
                      color: selectedDressStyle === style ? '#000000' : 'var(--color-text-secondary)',
                      padding: '4px 0'
                    }}
                  >
                    <span>{style}</span>
                    <ChevronRight size={16} color="rgba(0,0,0,0.3)" />
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleApplyFilters}
                className="btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                Apply Filter
              </button>
              <button
                onClick={handleClearFilters}
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'underline',
                  textAlign: 'center',
                  padding: '4px'
                }}
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <main style={{ flex: 1, width: '100%' }}>
            {/* Header / Stats & Sort Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 2.5vw, 2.2rem)',
                  fontWeight: 900,
                  textTransform: 'capitalize'
                }}>
                  {selectedDressStyle !== 'all' ? selectedDressStyle : selectedCategory !== 'all' ? selectedCategory : 'All Items'}
                </h1>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Showing {products.length > 0 ? (page - 1) * 9 + 1 : 0}-{Math.min(page * 9, total)} of {total} Products
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Mobile Filter Button */}
                <button
                  className="mobile-filter-trigger"
                  onClick={() => setMobileFilterOpen(true)}
                  style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#F0F0F0',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <SlidersHorizontal size={16} /> Filters
                </button>

                {/* Sort Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  <span>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontWeight: 700,
                      color: '#000000',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-secondary)' }}>
                Loading clothing catalog...
              </div>
            ) : products.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'var(--color-bg-light)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No garments found</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  Try adjusting your price range, dress style, or selected color filters.
                </p>
                <button onClick={handleClearFilters} className="btn-secondary" style={{ padding: '10px 28px' }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
              }}>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => onNavigate('product', { productId: product.id })}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '20px'
              }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    opacity: page === 1 ? 0.4 : 1,
                    cursor: page === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ArrowLeft size={16} /> Previous
                </button>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        backgroundColor: page === i + 1 ? '#000000' : 'transparent',
                        color: page === i + 1 ? '#ffffff' : 'var(--color-text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    opacity: page === totalPages ? 0.4 : 1,
                    cursor: page === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-in Modal Drawer */}
      {mobileFilterOpen && (
        <div className="modal-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div
            className="modal-content"
            style={{ maxHeight: '85vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Price slider */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                <span>Max Price:</span>
                <span>${priceRange}</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#000' }}
              />
            </div>

            {/* Dress styles */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, marginBottom: '8px' }}>Dress Style</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {dressStyles.map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedDressStyle(selectedDressStyle === st ? 'all' : st)}
                    className={`badge-tag ${selectedDressStyle === st ? 'active' : ''}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, marginBottom: '8px' }}>Colors</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      border: c.border ? '1px solid #ccc' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleApplyFilters}
              className="btn-primary"
              style={{ width: '100%', marginTop: '16px' }}
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .catalog-sidebar {
            display: none !important;
          }
          .mobile-filter-trigger {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;
