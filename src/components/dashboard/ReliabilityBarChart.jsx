import { useMemo } from 'react';
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
import { FiMoreVertical, FiCheckCircle } from 'react-icons/fi';
import { usePocketPromise } from '../../context/PocketPromiseContext';

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
          {data.payload.range}: {data.value} {data.value === 1 ? 'borrower' : 'borrowers'}
        </span>
      </div>
    );
  }
  return null;
}

export default function ReliabilityBarChart() {
  const { allLoans } = usePocketPromise();

  const { reliabilityData, hasOverdue } = useMemo(() => {
    const buckets = [
      { range: '1-7 Days', count: 0, color: '#00D2FF' },
      { range: '8-14 Days', count: 0, color: '#06B6D4' },
      { range: '15-30 Days', count: 0, color: '#10B981' },
      { range: '31-60 Days', count: 0, color: '#F59E0B' },
      { range: '60+ Days', count: 0, color: '#F97316' },
      { range: '90+ Days', count: 0, color: '#EF4444' },
      { range: 'Default', count: 0, color: '#DC2626' },
    ];

    if (!allLoans || allLoans.length === 0) {
      return { reliabilityData: buckets, hasOverdue: false };
    }

    const now = new Date();
    let foundOverdue = false;

    allLoans.forEach((loan) => {
      if (loan.status === 'Repaid' || loan.statusType === 'repaid' || !loan.dueDate) return;
      const due = new Date(loan.dueDate);
      if (due < now) {
        foundOverdue = true;
        const diffDays = Math.floor((now - due) / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) buckets[0].count++;
        else if (diffDays <= 14) buckets[1].count++;
        else if (diffDays <= 30) buckets[2].count++;
        else if (diffDays <= 60) buckets[3].count++;
        else if (diffDays <= 90) buckets[4].count++;
        else if (diffDays <= 180) buckets[5].count++;
        else buckets[6].count++;
      }
    });

    return { reliabilityData: buckets, hasOverdue: foundOverdue };
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

      {!hasOverdue ? (
        <div
          style={{
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '6px',
            }}
          >
            <FiCheckCircle size={18} />
          </div>
          <span style={{ fontSize: '0.82rem', color: '#f1f5f9', fontWeight: 600 }}>No Overdue Dues</span>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>All active borrowers are on track</span>
        </div>
      ) : (
        <>
          <div style={{ width: '100%', height: '140px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reliabilityData} margin={{ top: 10, right: 0, left: -28, bottom: -6 }}>
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
                  allowDecimals={false}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={20}>
                  {reliabilityData.map((entry, index) => (
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
        </>
      )}
    </div>
  );
}
