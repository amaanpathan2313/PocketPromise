import { useState } from 'react';
import { FiX, FiPhone, FiMail, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { usePocketPromise } from '../../context/PocketPromiseContext';

export default function AddLoanModal() {
  const { isAddModalOpen, setIsAddModalOpen, addLoan } = usePocketPromise();

  const [debtor, setDebtor] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [channel, setChannel] = useState('ai_call');
  const [notes, setNotes] = useState('');

  if (!isAddModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!debtor.trim() || !amount || !dueDate) {
      toast.error('Please fill in Debtor Name, Amount, and Due Date');
      return;
    }

    addLoan({
      debtor: debtor.trim(),
      amount: parseFloat(amount),
      phone: phone.trim(),
      email: email.trim(),
      dueDate,
      channel,
      notes: notes.trim(),
    });

    toast.success(`Loan recorded for ${debtor}! Reminders queued.`, {
      icon: '🚀',
    });

    setIsAddModalOpen(false);
    setDebtor('');
    setAmount('');
    setPhone('');
    setEmail('');
    setDueDate('');
    setNotes('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={() => setIsAddModalOpen(false)}
    >
      <div
        style={{
          backgroundColor: '#0e1424',
          border: '1px solid rgba(0, 210, 255, 0.25)',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '520px',
          padding: '24px 28px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 210, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                margin: 0,
              }}
            >
              Add New Loan
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '2px' }}>
              Track money lent and schedule automated AI voice/SMS follow-ups
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Debtor Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
              Debtor Name *
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <FiUser size={16} style={{ position: 'absolute', left: '12px', color: '#64748b' }} />
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={debtor}
                onChange={(e) => setDebtor(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#141b2d',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '10px 14px 10px 38px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Amount & Due Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                Amount (₹ INR) *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '12px', color: '#00D2FF', fontWeight: 700 }}>₹</span>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#141b2d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '10px 14px 10px 34px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                Promise Payback Date *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#141b2d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Phone & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                Phone (For AI Voice Calls)
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiPhone size={15} style={{ position: 'absolute', left: '12px', color: '#64748b' }} />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#141b2d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '10px 14px 10px 36px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                Email (For Statements)
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiMail size={15} style={{ position: 'absolute', left: '12px', color: '#64748b' }} />
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#141b2d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '10px 14px 10px 36px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Preferred Reminder Channel */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
              Primary Automated Follow-Up Channel
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { id: 'ai_call', label: '🎙️ AI Voice Call' },
                { id: 'email_sent', label: '✉️ Email Notice' },
                { id: 'sms', label: '💬 SMS Text' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setChannel(opt.id)}
                  style={{
                    backgroundColor: channel === opt.id ? 'rgba(0, 210, 255, 0.15)' : '#141b2d',
                    border: channel === opt.id ? '1px solid #00D2FF' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: channel === opt.id ? '#00D2FF' : '#94a3b8',
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                backgroundColor: '#0072FF',
                backgroundImage: 'linear-gradient(135deg, #0072FF 0%, #00D2FF 100%)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 114, 255, 0.4)',
              }}
            >
              Save & Activate Reminders
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
