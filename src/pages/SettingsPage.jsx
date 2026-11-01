import { motion } from 'framer-motion';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useLoans } from '../hooks/useLoans';
import { useStats } from '../hooks/useStats';
import { FiLogOut, FiUser, FiMail, FiActivity, FiGlobe } from 'react-icons/fi';

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { activeLoans, paidLoans } = useLoans();
  const stats = useStats(activeLoans, paidLoans);

  const settingsItems = [
    {
      icon: FiUser,
      label: 'Name',
      value: user?.fullName || user?.firstName || 'Not set',
    },
    {
      icon: FiMail,
      label: 'Email',
      value: user?.primaryEmailAddress?.emailAddress || 'Not set',
    },
    {
      icon: FiActivity,
      label: 'Active Loans',
      value: `${stats.activeCount} (${stats.overdueCount} overdue)`,
    },
    {
      icon: FiGlobe,
      label: 'Total Borrowers',
      value: `${stats.totalBorrowers} people`,
    },
  ];

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
          <span className="gradient-text">Settings</span>
        </h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        className="glass-card"
        style={{ padding: '24px', textAlign: 'center', marginBottom: '20px' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <img
          src={user?.imageUrl}
          alt={user?.fullName || 'User'}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: '3px solid var(--color-primary-500)',
            marginBottom: '12px',
          }}
        />
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.2rem',
            marginBottom: '4px',
          }}
        >
          {user?.fullName || user?.firstName || 'User'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {user?.primaryEmailAddress?.emailAddress}
        </p>
      </motion.div>

      {/* Info Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        {settingsItems.map((item, i) => (
          <motion.div
            key={item.label}
            className="glass-card"
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99,102,241,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <item.icon size={16} color="var(--color-primary-400)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                {item.label}
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* App Info */}
      <motion.div
        className="glass-card"
        style={{ padding: '16px', textAlign: 'center', marginBottom: '20px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          LendReminder v1.0 — Built with React + Firebase
        </p>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Auto-reminders: English → Hindi → Marathi (every 3 hours)
        </p>
      </motion.div>

      {/* Sign Out */}
      <motion.button
        className="btn btn-danger"
        onClick={() => signOut()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ width: '100%' }}
      >
        <FiLogOut size={18} />
        Sign Out
      </motion.button>
    </div>
  );
}
