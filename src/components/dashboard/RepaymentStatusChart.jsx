import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { FiPieChart } from 'react-icons/fi';
import { usePocketPromise } from '../../context/PocketPromiseContext';

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
          {data.name}: {data.value} ({data.payload.percentage}%)
        </span>
      </div>
    );
  }
  return null;
}

export default function RepaymentStatusChart() {
  const { allLoans } = usePocketPromise();

  const { statusData, hasData } = useMemo(() => {
    if (!allLoans || allLoans.length === 0) {
      return { statusData: [], hasData: false };
    }

    const total = allLoans.length;
    const now = new Date();

    const paidCount = allLoans.filter((l) => l.status === 'Repaid' || l.statusType === 'repaid').length;
    const overdueCount = allLoans.filter((l) => {
      if (l.status === 'Repaid' || l.statusType === 'repaid') return false;
      return l.dueDate && new Date(l.dueDate) < now;
    }).length;
    const graceCount = allLoans.filter((l) => {
      if (l.status === 'Repaid' || l.statusType === 'repaid') return false;
      return !l.dueDate || new Date(l.dueDate) >= now;
    }).length;
    const defaultedCount = allLoans.filter((l) => l.status === 'Defaulted').length;

    const data = [
      {
        name: 'Paid on Time',
        value: paidCount,
        percentage: Math.round((paidCount / total) * 100),
        color: '#00D2FF',
      },
      {
        name: 'Grace Period',
        value: graceCount,
        percentage: Math.round((graceCount / total) * 100),
        color: '#10B981',
      },
      {
        name: 'Overdue',
        value: overdueCount,
        percentage: Math.round((overdueCount / total) * 100),
        color: '#F59E0B',
      },
      {
        name: 'Defaulted',
        value: defaultedCount,
        percentage: Math.round((defaultedCount / total) * 100),
        color: '#EF4444',
      },
    ].filter((item) => item.value > 0);

    return { statusData: data, hasData: data.length > 0 };
  }, [allLoans]);

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

      {!hasData ? (
        <div
          style={{
            height: '130px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            textAlign: 'center',
            padding: '10px',
          }}
        >
          <FiPieChart size={24} style={{ color: '#00D2FF', opacity: 0.5, marginBottom: '6px' }} />
          <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>No loan status recorded</span>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Status segments will display as loans are added</span>
        </div>
      ) : (
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
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={56}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
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
            {statusData.map((item) => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.78rem' }}>
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
