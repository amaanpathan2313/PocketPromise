import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const STATUS_DATA = [
  { name: 'Paid on Time', value: 75, color: '#00D2FF' },
  { name: 'Grace Period', value: 15, color: '#10B981' },
  { name: 'Overdue', value: 10, color: '#F59E0B' },
  { name: 'Defaulted', value: 8, color: '#EF4444' },
];

function DonutTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div
        style={{
          backgroundColor: '#0c101d',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          padding: '8px 12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        <span style={{ color: data.payload.color, fontWeight: 700, fontSize: '0.82rem' }}>
          {data.name}: {data.value}%
        </span>
      </div>
    );
  }
  return null;
}

export default function RepaymentStatusChart() {
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
      <h3
        style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: '#f8fafc',
          marginBottom: '10px',
          letterSpacing: '-0.01em',
        }}
      >
        Repayment Status
      </h3>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        {/* Donut Chart */}
        <div style={{ width: '130px', height: '130px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<DonutTooltip />} />
              <Pie
                data={STATUS_DATA}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={56}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {STATUS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
          }}
        >
          {STATUS_DATA.map((item) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78rem',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: item.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#94a3b8', whiteSpace: 'nowrap' }}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

