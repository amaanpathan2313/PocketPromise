import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: '85dvh',
              background: 'var(--surface-bg)',
              borderTop: '1px solid var(--surface-glass-border)',
              borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
              padding: '24px',
              paddingBottom: '40px',
              zIndex: 1001,
              overflowY: 'auto',
            }}
          >
            {/* Drag handle */}
            <div
              style={{
                width: '36px',
                height: '4px',
                background: 'var(--text-muted)',
                borderRadius: 'var(--radius-full)',
                margin: '0 auto 20px',
                opacity: 0.4,
              }}
            />

            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-icon"
                style={{ width: '36px', height: '36px' }}
              >
                <FiX size={18} />
              </button>
            </div>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
