import { motion } from 'framer-motion';
import MetricCards from '../components/dashboard/MetricCards';
import CashFlowChart from '../components/dashboard/CashFlowChart';
import RepaymentStatusChart from '../components/dashboard/RepaymentStatusChart';
import ReliabilityBarChart from '../components/dashboard/ReliabilityBarChart';
import DebtsTable from '../components/dashboard/DebtsTable';
import AddLoanModal from '../components/modals/AddLoanModal';
import AICallSimulatorModal from '../components/modals/AICallSimulatorModal';
import ImageLightboxModal from '../components/modals/ImageLightboxModal';
import { usePocketPromise } from '../context/PocketPromiseContext';

export default function DashboardPage() {
  const { activeTab, setActiveTab, lightboxData, closeLightbox } = usePocketPromise();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        paddingBottom: '30px',
      }}
    >
      {/* Tab Filter Banner if user navigated away from full Dashboard */}
      {activeTab !== 'dashboard' && (
        <div
          style={{
            backgroundColor: 'rgba(0, 210, 255, 0.08)',
            border: '1px solid rgba(0, 210, 255, 0.25)',
            borderRadius: '12px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#00D2FF', fontWeight: 600 }}>Viewing:</span>
            <span style={{ color: '#ffffff', textTransform: 'capitalize' }}>
              {activeTab.replace('-', ' ')}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#00D2FF',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.82rem',
              textDecoration: 'underline',
            }}
          >
            ← Back to Full Dashboard
          </button>
        </div>
      )}

      {/* 1. Top 4 Metric Cards */}
      <MetricCards />

      {/* 2. Middle Row: Cash Flow Chart + Right Stack (Repayment Status & Debtor Reliability) */}
      {(activeTab === 'dashboard' || activeTab === 'analytics') && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
            gap: '20px',
          }}
          className="grid-cols-1 lg:grid-cols-[1.6fr_1fr]"
        >
          {/* Left: Cash Flow (Money Lent vs. Recovered) */}
          <div style={{ minHeight: '340px' }}>
            <CashFlowChart />
          </div>

          {/* Right: Stack of 2 analytics cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <RepaymentStatusChart />
            <ReliabilityBarChart />
          </div>
        </div>
      )}

      {/* 3. Settings View (if settings tab clicked) */}
      {activeTab === 'settings' && (
        <div
          style={{
            backgroundColor: '#0e1424',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
            AI Reminder & Gateway Preferences
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#131929', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>AI Voice Synthesis</div>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '10px' }}>
                Select the voice dialect for automated debtor telephone calls.
              </p>
              <select
                style={{
                  width: '100%',
                  backgroundColor: '#0c101d',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  padding: '8px 12px',
                  outline: 'none',
                  fontSize: '0.85rem',
                }}
              >
                <option>English (Indian Accent - Polite & Professional)</option>
                <option>Hindi (Formal Courtesy Call)</option>
                <option>English (Neutral International)</option>
              </select>
            </div>

            <div style={{ backgroundColor: '#131929', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>Call Schedule Frequency</div>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '10px' }}>
                Automated cadence when promise payback date passes.
              </p>
              <select
                style={{
                  width: '100%',
                  backgroundColor: '#0c101d',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  padding: '8px 12px',
                  outline: 'none',
                  fontSize: '0.85rem',
                }}
              >
                <option>Every 24 Hours after Due Date</option>
                <option>Every 3 Hours on Due Date</option>
                <option>Gentle 3-Day Interval</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bottom Table: AI Reminders Status & Recent Debts */}
      {activeTab !== 'settings' && <DebtsTable />}

      {/* Modals */}
      <AddLoanModal />
      <AICallSimulatorModal />
      <ImageLightboxModal
        isOpen={lightboxData.isOpen}
        images={lightboxData.images}
        title={lightboxData.title}
        onClose={closeLightbox}
      />
    </motion.div>
  );
}
