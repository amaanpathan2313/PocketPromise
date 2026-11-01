import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { FiMoreVertical, FiTrendingUp } from 'react-icons/fi';
import { usePocketPromise } from '../../context/PocketPromiseContext';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#0c101d',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '10px',
          padding: '10px 14px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '6px', fontWeight: 600 }}>
          {label}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00D2FF' }} />
            <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>Lent:</span>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem' }}>
              ₹{Number(payload[0]?.value || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>Recovered:</span>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem' }}>
              ₹{Number(payload[1]?.value || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function CashFlowChart() {
  const { allLoans } = usePocketPromise();

  // Generate dynamic 6-month timeline based on real data
  const chartData = useMemo(() => {
    const today = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        month: MONTH_NAMES[d.getMonth()],
        lent: 0,
        recovered: 0,
      });
    }

    if (!allLoans || allLoans.length === 0) {
      return months;
    }

    allLoans.forEach((loan) => {
      const loanDate = loan.createdAt ? new Date(loan.createdAt) : loan.dueDate ? new Date(loan.dueDate) : today;
      const mIdx = loanDate.getMonth();
      const matchMonth = months.find((m) => m.monthIndex === mIdx);
      if (matchMonth) {
        matchMonth.lent += Number(loan.amount || 0);
        if (loan.status === 'Repaid' || loan.statusType === 'repaid') {
          matchMonth.recovered += Number(loan.amount || 0);
        }
      }
    });

    return months;
  }, [allLoans]);

  const hasData = allLoans && allLoans.length > 0;

  return (
    <div
      style={{
        backgroundColor: '#0e1424',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '340px',
      }}
    >
      {/* Header with Title + Legend dots + Menu */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#f8fafc',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Cash Flow: Money Lent vs. Recovered
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#00D2FF',
                  boxShadow: '0 0 8px rgba(0, 210, 255, 0.6)',
                }}
              />
              <span style={{ color: '#94a3b8', fontWeight: 500 }}>Lent</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                }}
              />
              <span style={{ color: '#94a3b8', fontWeight: 500 }}>Recovered</span>
            </div>
          </div>

          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
          >
            <FiMoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Area Chart Container / Empty State */}
      <div style={{ flex: 1, width: '100%', minHeight: '260px', position: 'relative' }}>
        {!hasData ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#64748b',
              padding: '20px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 210, 255, 0.08)',
                color: '#00D2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
              }}
            >
              <FiTrendingUp size={22} />
            </div>
            <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
              No cash flow activity yet
            </div>
            <div style={{ fontSize: '0.82rem', maxWidth: '320px', lineHeight: 1.5 }}>
              Record your first lent amount using &ldquo;+ Add New Loan&rdquo; to start seeing cash flow trends.
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#00D2FF" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="recoveredGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.04)"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="lent"
                stroke="#00D2FF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#lentGradient)"
              />
              <Area
                type="monotone"
                dataKey="recovered"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#recoveredGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
