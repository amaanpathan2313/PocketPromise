import { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { useLoans } from '../hooks/useLoans';
import { useStats } from '../hooks/useStats';
import StatsCards from '../components/dashboard/StatsCards';
import LoanList from '../components/dashboard/LoanList';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { sendReminderEmail } from '../lib/reminderEngine';
import { FiLoader } from 'react-icons/fi';

const Scene3D = lazy(() => import('../components/dashboard/Scene3D'));

export default function DashboardPage() {
  const { user } = useUser();
  const { activeLoans, paidLoans, loading, markAsPaid } = useLoans();
  const stats = useStats(activeLoans, paidLoans);

  const [confirmLoanId, setConfirmLoanId] = useState(null);

  const handleMarkPaid = async () => {
    if (!confirmLoanId) return;
    try {
      await markAsPaid(confirmLoanId);
      toast.success('Marked as paid! Reminders stopped.', {
        icon: '✅',
        style: {
          background: '#1a1a3e',
          color: '#f1f5f9',
          border: '1px solid rgba(16,185,129,0.3)',
        },
      });
    } catch (err) {
      toast.error('Failed to update. Try again.');
      console.error(err);
    }
    setConfirmLoanId(null);
  };

  const handleSendReminder = async (loan) => {
    const t = toast.loading('Sending reminder...', {
      style: {
        background: '#1a1a3e',
        color: '#f1f5f9',
        border: '1px solid rgba(99,102,241,0.3)',
      },
    });
    try {
      const result = await sendReminderEmail(loan, user?.fullName || user?.firstName || 'Lender');
      if (result.success) {
        toast.success(`Reminder sent in ${result.lang}!`, { id: t, icon: '📩' });
      } else {
        toast.error('Failed to send. Check your EmailJS config.', { id: t });
      }
    } catch (err) {
      toast.error('Failed to send reminder.', { id: t });
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <FiLoader size={32} color="var(--color-primary-400)" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '20px' }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            marginBottom: '4px',
          }}
        >
          Welcome, <span className="gradient-text">{user?.firstName || 'User'}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {stats.overdueCount > 0
            ? `${stats.overdueCount} overdue loan${stats.overdueCount > 1 ? 's' : ''} need attention`
            : 'All loans are on track!'}
        </p>
      </motion.div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* 3D Widget */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ margin: '8px 0' }}
      >
        <Suspense fallback={<div style={{ height: '180px' }} />}>
          <Scene3D height="180px" coinScale={0.9} />
        </Suspense>
      </motion.div>

      {/* Active Loans */}
      <LoanList
        loans={activeLoans}
        onMarkPaid={(id) => setConfirmLoanId(id)}
        onSendReminder={handleSendReminder}
        title="Active Loans"
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmLoanId}
        onConfirm={handleMarkPaid}
        onCancel={() => setConfirmLoanId(null)}
        title="Confirm Payment Received"
        message="Are you sure the borrower has returned the money? This will permanently stop all reminders for this loan."
      />
    </div>
  );
}
