import { motion } from 'framer-motion';
import { FiSend, FiArrowDownLeft, FiAlertTriangle } from 'react-icons/fi';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

function StatCard({ icon: Icon, label, value, gradient, index }) {
  return (
    <motion.div
      className="glass-card"
      style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: gradient,
          opacity: 0.15,
          filter: 'blur(20px)',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={20} color="white" />
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {label}
        </span>
      </div>

      <motion.div
        style={{
          fontSize: '1.6rem',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
      >
        ₹{value.toLocaleString('en-IN')}
      </motion.div>
    </motion.div>
  );
}

export default function StatsCards({ stats }) {
  const cards = [
    {
      icon: FiSend,
      label: 'Total Lent',
      value: stats.totalLent,
      gradient: 'var(--gradient-primary)',
    },
    {
      icon: FiArrowDownLeft,
      label: 'Received Back',
      value: stats.totalReceived,
      gradient: 'var(--gradient-accent)',
    },
    {
      icon: FiAlertTriangle,
      label: 'Outstanding',
      value: stats.outstanding,
      gradient: 'var(--gradient-danger)',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
      {cards.map((card, i) => (
        <StatCard key={card.label} {...card} index={i} />
      ))}
    </div>
  );
}
