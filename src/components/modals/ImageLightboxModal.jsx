import { useState, useEffect } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiExternalLink } from 'react-icons/fi';

export default function ImageLightboxModal({ isOpen, images = [], title = 'Proof Document', onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && images.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === 'ArrowLeft' && images.length > 1) {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images, onClose]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentUrl = images[currentIndex];

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.92)',
        backdropFilter: 'blur(12px)',
        zIndex: 150,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem' }}>
            {title}
          </span>
          {images.length > 1 && (
            <span
              style={{
                backgroundColor: 'rgba(0, 210, 255, 0.15)',
                color: '#00D2FF',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.76rem',
                fontWeight: 600,
              }}
            >
              {currentIndex + 1} of {images.length}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Full Image"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#f1f5f9',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <FiExternalLink size={18} />
          </a>

          <button
            onClick={onClose}
            title="Close"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#f1f5f9',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      {/* Main Image Viewer */}
      <div
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentUrl}
          alt={`Proof ${currentIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '78vh',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 210, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '-20px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(12, 16, 28, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
              transition: 'all 0.15s',
            }}
          >
            <FiChevronLeft size={22} />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '-20px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(12, 16, 28, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
              transition: 'all 0.15s',
            }}
          >
            <FiChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Thumbnails Row if multiple */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            gap: '10px',
            backgroundColor: 'rgba(12, 16, 28, 0.75)',
            padding: '8px 14px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`thumb-${idx}`}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                objectFit: 'cover',
                cursor: 'pointer',
                border: currentIndex === idx ? '2px solid #00D2FF' : '1px solid rgba(255, 255, 255, 0.2)',
                opacity: currentIndex === idx ? 1 : 0.6,
                transform: currentIndex === idx ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.15s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
