import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FiCalendar, FiMail, FiPhone, FiCheck, FiBell } from 'react-icons/fi';

dayjs.extend(relativeTime);

export default function LoanCard({ loan, onMarkPaid, onSendReminder }) {
  const promiseDate = loan.promiseDate?.toDate
    ? loan.promiseDate.toDate()
    : new Date(loan.promiseDate);
  const isOverdue = loan.status === 'overdue';
  const isPaid = loan.status === 'paid';

  const statusBadgeClass = isPaid
    ? 'badge badge-paid'
    : isOverdue
    ? 'badge badge-overdue'
    : 'badge badge-active';

  const statusText = isPaid ? 'PAID' : isOverdue ? 'OVERDUE' : 'ACTIVE';

  return (
    <motion.div
      className="glass-card"
      style={{
        padding: '18px',
        borderLeft: isOverdue
          ? '3px solid var(--color-danger-500)'
          : isPaid
          ? '3px solid var(--color-accent-500)'
          : '3px solid var(--color-primary-500)',
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '2px' }}>
            {loan.borrowerName}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <FiCalendar size={12} />
            <span>{dayjs(promiseDate).format('DD MMM YYYY')}</span>
            {isOverdue && (
              <span style={{ color: 'var(--color-danger-400)' }}>
                ({dayjs(promiseDate).fromNow()})
              </span>
            )}
          </div>
        </div>
        <span className={statusBadgeClass}>{statusText}</span>
      </div>

      {/* Amount */}
      <div
        style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
        }}
        className={isOverdue ? '' : isPaid ? 'gradient-text-accent' : 'gradient-text'}
      >
        ₹{loan.amount.toLocaleString('en-IN')}
      </div>

      {/* Contact Info */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FiMail size={12} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px', whiteSpace: 'nowrap' }}>
            {loan.borrowerEmail}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FiPhone size={12} />
          <span>{loan.borrowerPhone}</span>
        </div>
      </div>

      {/* Reminder info for overdue */}
      {isOverdue && loan.reminderCount > 0 && (
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <FiBell size={11} />
          {loan.reminderCount} reminders sent
        </div>
      )}

      {/* Actions */}
      {!isPaid && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button
            className="btn btn-accent btn-sm"
            onClick={() => onMarkPaid(loan.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ flex: 1 }}
          >
            <FiCheck size={16} />
            Money Received
          </motion.button>
          {isOverdue && (
            <motion.button
              className="btn btn-ghost btn-sm"
              onClick={() => onSendReminder(loan)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiBell size={16} />
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}
