import { FiFolder, FiShield, FiAlertCircle, FiBell, FiMoreVertical } from 'react-icons/fi';
import { usePocketPromise } from '../../context/PocketPromiseContext';

export default function MetricCards() {
  const { totalLent, totalRecovered, outstandingDebt, activeRemindersCount } = usePocketPromise();

  const formatINR = (val) => {
    return `₹${Number(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const CARDS = [
    {
      id: 'total-lent',
      title: 'Total Lent',
      value: formatINR(totalLent),
      trend: '▲ 5% this month',
      trendColor: '#10b981',
      icon: FiFolder,
      iconBg: 'rgba(0, 210, 255, 0.15)',
      iconColor: '#00D2FF',
      borderColor: 'rgba(0, 210, 255, 0.25)',
      cardBg: 'linear-gradient(145deg, rgba(14, 27, 49, 0.8) 0%, rgba(10, 18, 33, 0.8) 100%)',
    },
    {
      id: 'total-recovered',
      title: 'Total Recovered',
      value: formatINR(totalRecovered),
      trend: '▲ 12% this month',
      trendColor: '#10b981',
      icon: FiShield,
      iconBg: 'rgba(16, 185, 129, 0.15)',
      iconColor: '#10b981',
      borderColor: 'rgba(16, 185, 129, 0.25)',
      cardBg: 'linear-gradient(145deg, rgba(10, 36, 30, 0.8) 0%, rgba(8, 25, 21, 0.8) 100%)',
    },
    {
      id: 'outstanding-debt',
      title: 'Outstanding Debt',
      value: formatINR(outstandingDebt),
      trend: '▼ 8%',
      trendColor: '#f97316',
      icon: FiAlertCircle,
      iconBg: 'rgba(245, 158, 11, 0.15)',
      iconColor: '#f59e0b',
      borderColor: 'rgba(245, 158, 11, 0.25)',
      cardBg: 'linear-gradient(145deg, rgba(44, 26, 16, 0.8) 0%, rgba(28, 17, 11, 0.8) 100%)',
    },
    {
      id: 'active-reminders',
      title: 'Active Reminders',
      value: `${activeRemindersCount} Alerts`,
      trend: 'SMS, Email, and AI Call',
      trendColor: '#94a3b8',
      icon: FiBell,
      iconBg: 'rgba(249, 115, 22, 0.15)',
      iconColor: '#f97316',
      borderColor: 'rgba(249, 115, 22, 0.25)',
      cardBg: 'linear-gradient(145deg, rgba(36, 25, 20, 0.8) 0%, rgba(24, 16, 13, 0.8) 100%)',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
        marginBottom: '20px',
      }}
    >
      {CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            style={{
              background: card.cardBg,
              border: `1px solid ${card.borderColor}`,
              borderRadius: '14px',
              padding: '18px 20px',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '135px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${card.borderColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Top row: Icon + Title + Menu dots */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.iconColor,
                  }}
                >
                  <Icon size={17} />
                </div>
                <span
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    color: '#cbd5e1',
                  }}
                >
                  {card.title}
                </span>
              </div>

              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FiMoreVertical size={14} />
              </button>
            </div>

            {/* Bottom: Big Value + Trend/Subtitle */}
            <div>
              <div
                style={{
                  fontSize: '1.55rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  marginBottom: '4px',
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: card.trendColor,
                }}
              >
                {card.trend}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

