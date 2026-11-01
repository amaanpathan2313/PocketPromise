import { useState } from 'react';
import { 
  FiMoreHorizontal, 
  FiPhoneCall, 
  FiMail, 
  FiCheckCircle, 
  FiTrash2,
  FiUsers,
  FiImage 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { usePocketPromise } from '../../context/PocketPromiseContext';

export default function DebtsTable() {
  const { loans, startAICall, markAsRepaid, deleteLoan, setIsAddModalOpen, openLightbox } = usePocketPromise();
  const [openMenuId, setOpenMenuId] = useState(null);

  const formatINR = (val) => {
    return `₹${Number(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusBadge = (status, statusType) => {
    if (status === 'Repaid' || statusType === 'repaid') {
      return (
        <span
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '9999px',
            padding: '4px 12px',
            fontSize: '0.76rem',
            fontWeight: 600,
            display: 'inline-block',
          }}
        >
          Repaid
        </span>
      );
    }
    if (status === 'Email Sent' || statusType === 'email_sent') {
      return (
        <span
          style={{
            backgroundColor: 'rgba(249, 115, 22, 0.12)',
            color: '#f97316',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: '9999px',
            padding: '4px 12px',
            fontSize: '0.76rem',
            fontWeight: 600,
            display: 'inline-block',
          }}
        >
          Email Sent
        </span>
      );
    }
    // Default: AI Call Scheduled
    return (
      <span
        style={{
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '9999px',
          padding: '4px 12px',
          fontSize: '0.76rem',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#f59e0b',
            boxShadow: '0 0 6px #f59e0b',
          }}
        />
        AI Call Scheduled
      </span>
    );
  };

  const handleActionClick = (loan, action) => {
    setOpenMenuId(null);
    if (action === 'call') {
      startAICall(loan);
    } else if (action === 'email') {
      toast.success(`Automated reminder email sent to ${loan.debtor}!`, {
        icon: '✉️',
      });
    } else if (action === 'repaid') {
      markAsRepaid(loan.id);
      toast.success(`Marked debt for ${loan.debtor} as Repaid!`, {
        icon: '✅',
      });
    } else if (action === 'delete') {
      deleteLoan(loan.id);
      toast('Debt record removed', { icon: '🗑️' });
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#0e1424',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px 22px',
        marginTop: '20px',
      }}
    >
      {/* Table Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
        }}
      >
        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#f8fafc',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          AI Reminders Status
        </h3>

        <span
          style={{
            fontSize: '0.84rem',
            fontWeight: 600,
            color: '#64748b',
          }}
        >
          Recent Debts
        </span>
      </div>

      {/* Table Element */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <th style={{ padding: '10px 14px', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Debtor
              </th>
              <th style={{ padding: '10px 14px', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Amount
              </th>
              <th style={{ padding: '10px 14px', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Due Date
              </th>
              <th style={{ padding: '10px 14px', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Status
              </th>
              <th style={{ padding: '10px 14px', fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '44px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 210, 255, 0.08)',
                        color: '#00D2FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <FiUsers size={20} />
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>
                      No active or past loans found
                    </span>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '340px', marginBottom: '14px', lineHeight: 1.5 }}>
                      Record a borrower promise to activate automated voice calls, SMS, and email follow-ups.
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      style={{
                        backgroundColor: 'rgba(0, 210, 255, 0.12)',
                        border: '1px solid rgba(0, 210, 255, 0.3)',
                        color: '#00D2FF',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      + Add Your First Loan
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr
                  key={loan.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Debtor */}
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={loan.avatar}
                        alt={loan.debtor}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          backgroundColor: '#1e293b',
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9' }}>
                          {loan.debtor}
                        </div>
                        {loan.imageUrls && loan.imageUrls.length > 0 && (
                          <button
                            onClick={() => openLightbox(loan.imageUrls, `${loan.debtor}'s Proof Documents`)}
                            style={{
                              background: 'rgba(0, 210, 255, 0.1)',
                              border: '1px solid rgba(0, 210, 255, 0.25)',
                              color: '#00D2FF',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '3px',
                            }}
                            title="Click to view full receipts & proof"
                          >
                            <FiImage size={11} />
                            {loan.imageUrls.length} {loan.imageUrls.length === 1 ? 'receipt' : 'receipts'}
                          </button>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td style={{ padding: '12px 14px', fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                    {formatINR(loan.amount)}
                  </td>

                  {/* Due Date */}
                  <td style={{ padding: '12px 14px', fontSize: '0.84rem', color: '#94a3b8' }}>
                    {loan.dueDateDisplay || loan.dueDate}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px 14px' }}>
                    {getStatusBadge(loan.status, loan.statusType)}
                  </td>

                  {/* Action */}
                  <td style={{ padding: '12px 14px', textAlign: 'right', position: 'relative' }}>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === loan.id ? null : loan.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                    >
                      <FiMoreHorizontal size={18} />
                    </button>

                    {/* Popover Action Menu */}
                    {openMenuId === loan.id && (
                      <div
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '40px',
                          backgroundColor: '#0c101d',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '10px',
                          padding: '6px',
                          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7)',
                          zIndex: 50,
                          minWidth: '180px',
                          textAlign: 'left',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                      >
                        {loan.imageUrls && loan.imageUrls.length > 0 && (
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              openLightbox(loan.imageUrls, `${loan.debtor}'s Proof Documents`);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#38bdf8',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              width: '100%',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <FiImage size={14} /> View Receipts ({loan.imageUrls.length})
                          </button>
                        )}

                        <button
                          onClick={() => handleActionClick(loan, 'call')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#00D2FF',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            width: '100%',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 210, 255, 0.1)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <FiPhoneCall size={14} /> Trigger AI Voice Call
                        </button>

                        <button
                          onClick={() => handleActionClick(loan, 'email')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#f1f5f9',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            width: '100%',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <FiMail size={14} /> Send Email Reminder
                        </button>

                        {loan.status !== 'Repaid' && (
                          <button
                            onClick={() => handleActionClick(loan, 'repaid')}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#10b981',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              width: '100%',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <FiCheckCircle size={14} /> Mark as Repaid
                          </button>
                        )}

                        <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.06)', margin: '4px 0' }} />

                        <button
                          onClick={() => handleActionClick(loan, 'delete')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#f43f5e',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            width: '100%',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <FiTrash2 size={14} /> Delete Record
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

