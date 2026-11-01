import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { FiMoreVertical } from 'react-icons/fi';

const CASH_FLOW_DATA = [
  { month: 'Jan', lent: 45, recovered: 25 },
  { month: 'Feb', lent: 82, recovered: 35 },
  { month: 'Mar', lent: 98, recovered: 55 },
  { month: 'Apr', lent: 60, recovered: 70 },
  { month: 'May', lent: 105, recovered: 85 },
  { month: 'Jun', lent: 75, recovered: 110 },
];

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
          {label} 2024
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00D2FF' }} />
            <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>Lent:</span>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem' }}>
              ₹{payload[0]?.value}k
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>Recovered:</span>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem' }}>
              ₹{payload[1]?.value}k
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function CashFlowChart() {
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

      {/* Area Chart Container */}
      <div style={{ flex: 1, width: '100%', minHeight: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CASH_FLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              domain={[0, 120]}
              ticks={[0, 20, 40, 60, 80, 100, 120]}
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
      </div>
    </div>
  );
}

