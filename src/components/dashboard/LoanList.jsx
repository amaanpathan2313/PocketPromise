import { AnimatePresence, motion } from 'framer-motion';
import LoanCard from './LoanCard';
import { FiInbox } from 'react-icons/fi';

export default function LoanList({ loans, onMarkPaid, onSendReminder, title = 'Active Loans' }) {
  return (
    <div style={{ marginTop: '24px' }}>
      <h2
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          marginBottom: '16px',
          color: 'var(--text-primary)',
        }}
      >
        {title}
        {loans.length > 0 && (
          <span
            style={{
              marginLeft: '8px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}
          >
            ({loans.length})
          </span>
        )}
      </h2>

      {loans.length === 0 ? (
        <motion.div
          className="glass-card"
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FiInbox size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ fontSize: '0.95rem' }}>No loans yet</p>
          <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
            Tap the + button to add your first loan record
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence mode="popLayout">
            {loans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onMarkPaid={onMarkPaid}
                onSendReminder={onSendReminder}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
