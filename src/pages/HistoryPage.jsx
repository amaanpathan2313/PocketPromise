import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { useLoans } from '../hooks/useLoans';
import { FiCheckCircle, FiCalendar, FiClock, FiInbox } from 'react-icons/fi';

export default function HistoryPage() {
  const { paidLoans, loading } = useLoans();

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
          }}
        >
          Payment <span className="gradient-text-accent">History</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {paidLoans.length} completed transaction{paidLoans.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Summary Card */}
      {paidLoans.length > 0 && (
        <motion.div
          className="glass-card"
          style={{ padding: '20px', marginBottom: '20px' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--gradient-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiCheckCircle size={22} color="white" />
            </div>
            <div>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                }}
                className="gradient-text-accent"
              >
                ₹{paidLoans.reduce((s, l) => s + l.amount, 0).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total recovered
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* List */}
      {paidLoans.length === 0 ? (
        <motion.div
          className="glass-card"
          style={{
            padding: '48px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FiInbox size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ fontSize: '0.95rem' }}>No completed payments yet</p>
          <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
            Paid loans will appear here
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {paidLoans.map((loan, i) => {
            const paidAt = loan.paidAt?.toDate
              ? loan.paidAt.toDate()
              : loan.paidAt
              ? new Date(loan.paidAt)
              : null;

            return (
              <motion.div
                key={loan.id}
                className="glass-card"
                style={{
                  padding: '16px',
                  borderLeft: '3px solid var(--color-accent-500)',
                }}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                    }}
                  >
                    {loan.borrowerName}
                  </h3>
                  <span className="badge badge-paid">PAID</span>
                </div>

                <div
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-display)',
                    marginBottom: '8px',
                  }}
                  className="gradient-text-accent"
                >
                  ₹{loan.amount.toLocaleString('en-IN')}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCalendar size={11} />
                    Promise: {dayjs(loan.promiseDate?.toDate ? loan.promiseDate.toDate() : loan.promiseDate).format('DD MMM YY')}
                  </div>
                  {paidAt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiClock size={11} />
                      Paid: {dayjs(paidAt).format('DD MMM YY')}
                    </div>
                  )}
                  {loan.reminderCount > 0 && (
                    <div>
                      {loan.reminderCount} reminder{loan.reminderCount > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
