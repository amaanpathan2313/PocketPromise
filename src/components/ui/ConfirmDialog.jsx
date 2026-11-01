import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 2000,
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(90vw, 380px)',
              background: '#1a1a3e',
              border: '1px solid var(--surface-glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              zIndex: 2001,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <FiAlertCircle size={28} color="var(--color-accent-400)" />
            </div>

            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                marginBottom: '8px',
              }}
            >
              {title || 'Confirm Payment'}
            </h3>

            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginBottom: '24px',
                lineHeight: 1.5,
              }}
            >
              {message || 'Are you sure the money has been received? This will stop all reminders.'}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <motion.button
                className="btn btn-ghost"
                onClick={onCancel}
                whileTap={{ scale: 0.97 }}
                style={{ flex: 1 }}
              >
                <FiX size={16} />
                Cancel
              </motion.button>
              <motion.button
                className="btn btn-accent"
                onClick={onConfirm}
                whileTap={{ scale: 0.97 }}
                style={{ flex: 1 }}
              >
                <FiCheck size={16} />
                Yes, Received
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
