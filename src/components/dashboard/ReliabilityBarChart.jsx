import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { FiMoreVertical } from 'react-icons/fi';

const RELIABILITY_DATA = [
  { range: '1-7 Days', count: 48, color: '#00D2FF' },
  { range: '8-14 Days', count: 42, color: '#06B6D4' },
  { range: '15-30 Days', count: 34, color: '#10B981' },
  { range: '31-60 Days', count: 26, color: '#F59E0B' },
  { range: '60+ Days', count: 22, color: '#F97316' },
  { range: '90+ Days', count: 16, color: '#EF4444' },
  { range: 'Default', count: 10, color: '#DC2626' },
];

function BarTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div
        style={{
          backgroundColor: '#0c101d',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          padding: '6px 10px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        <span style={{ color: data.payload.color, fontWeight: 700, fontSize: '0.8rem' }}>
          {data.payload.range}: {data.value} debtors
        </span>
      </div>
    );
  }
  return null;
}

export default function ReliabilityBarChart() {
  return (
    <div
      style={{
        backgroundColor: '#0e1424',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <h3
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#f8fafc',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Debtor Repayment Reliability
        </h3>

        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '2px',
          }}
        >
          <FiMoreVertical size={16} />
        </button>
      </div>

      <div style={{ width: '100%', height: '140px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={RELIABILITY_DATA} margin={{ top: 10, right: 0, left: -28, bottom: -6 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="range"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 9 }}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
              domain={[0, 50]}
              ticks={[0, 10, 20, 30, 40, 50]}
            />
            <Tooltip content={<BarTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={20}>
              {RELIABILITY_DATA.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          textAlign: 'center',
          fontSize: '0.74rem',
          color: '#64748b',
          marginTop: '2px',
          fontWeight: 500,
        }}
      >
        Days Overdue
      </div>
    </div>
  );
}

