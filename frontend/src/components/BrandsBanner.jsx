import React from 'react';

const BrandsBanner = () => {
  const brands = [
    { name: 'VERSACE', style: { fontFamily: 'Georgia, serif', letterSpacing: '0.15em', fontWeight: 900 } },
    { name: 'ZARA', style: { fontFamily: 'Didot, "Bodoni MT", serif', letterSpacing: '0.2em', fontWeight: 900 } },
    { name: 'GUCCI', style: { fontFamily: 'Futura, "Trebuchet MS", sans-serif', letterSpacing: '0.25em', fontWeight: 700 } },
    { name: 'PRADA', style: { fontFamily: 'Didot, serif', letterSpacing: '0.18em', fontWeight: 800 } },
    { name: 'Calvin Klein', style: { fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.05em', fontWeight: 400 } }
  ];

  return (
    <section
      id="brands-banner"
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '38px 0',
        width: '100%'
      }}
    >
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '28px'
      }}>
        {brands.map((brand, idx) => (
          <div
            key={idx}
            style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
              color: '#ffffff',
              opacity: 0.95,
              textTransform: 'uppercase',
              ...brand.style
            }}
          >
            {brand.name}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandsBanner;
