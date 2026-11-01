import { useState, useEffect } from 'react';
import { FiPhoneOff, FiMic, FiMicOff, FiVolume2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { usePocketPromise } from '../../context/PocketPromiseContext';

export default function AICallSimulatorModal() {
  const { callingLoan, closeAICall } = usePocketPromise();
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [callStage, setCallStage] = useState('dialing'); // dialing, active, completed

  useEffect(() => {
    if (!callingLoan) {
      setSeconds(0);
      setCallStage('dialing');
      return;
    }

    const connectTimer = setTimeout(() => {
      setCallStage('active');
    }, 1800);

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(interval);
    };
  }, [callingLoan]);

  if (!callingLoan) return null;

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const formattedAmount = `₹${Number(callingLoan.amount).toLocaleString('en-IN')}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#0c101d',
          border: '1px solid rgba(0, 210, 255, 0.3)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '440px',
          padding: '32px 24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 210, 255, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Top Tag */}
        <div
          style={{
            backgroundColor: 'rgba(0, 210, 255, 0.12)',
            color: '#00D2FF',
            padding: '4px 14px',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#00D2FF',
              boxShadow: '0 0 8px #00D2FF',
            }}
          />
          PocketPromise AI Voice Agent
        </div>

        {/* Debtor Avatar with Pulsing Rings */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          {callStage === 'active' && (
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: '-8px',
                borderRadius: '50%',
                border: '2px solid #00D2FF',
              }}
            />
          )}
          <img
            src={callingLoan.avatar}
            alt={callingLoan.debtor}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #00D2FF',
              position: 'relative',
              zIndex: 2,
            }}
          />
        </div>

        {/* Caller Info */}
        <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0' }}>
          {callingLoan.debtor}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '0 0 12px 0' }}>
          {callingLoan.phone || '+91 98765 43210'}
        </p>

        {/* Status & Timer */}
        <div style={{ marginBottom: '20px' }}>
          {callStage === 'dialing' ? (
            <span style={{ color: '#f59e0b', fontSize: '0.88rem', fontWeight: 600 }}>
              Dialing debtor via AI Voice Line...
            </span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <span style={{ color: '#10b981', fontSize: '0.88rem', fontWeight: 700 }}>
                Connected
              </span>
              <span style={{ color: '#64748b' }}>•</span>
              <span style={{ color: '#cbd5e1', fontSize: '0.88rem', fontFamily: 'monospace' }}>
                {formatTimer(seconds)}
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Sound Wave Bars */}
        {callStage === 'active' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              height: '34px',
              marginBottom: '20px',
            }}
          >
            {[18, 28, 14, 32, 22, 12, 30, 24, 16, 26, 20].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [h * 0.4, h, h * 0.4] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + (i % 3) * 0.2,
                  ease: 'easeInOut',
                }}
                style={{
                  width: '4px',
                  backgroundColor: '#00D2FF',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px rgba(0, 210, 255, 0.4)',
                }}
              />
            ))}
          </div>
        )}

        {/* Real-time AI Transcript Preview */}
        <div
          style={{
            backgroundColor: '#131929',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '0.82rem',
            color: '#cbd5e1',
            textAlign: 'left',
            lineHeight: 1.5,
            width: '100%',
            marginBottom: '24px',
          }}
        >
          <div style={{ color: '#00D2FF', fontWeight: 700, fontSize: '0.74rem', marginBottom: '4px' }}>
            AGENT TRANSCRIPTION
          </div>
          {callStage === 'dialing' ? (
            <em style={{ color: '#64748b' }}>Establishing secure connection with telecommunication carrier...</em>
          ) : (
            <span>
              &ldquo;Hello {callingLoan.debtor.split(' ')[0]}, this is an automated courtesy reminder from{' '}
              <strong style={{ color: '#ffffff' }}>PocketPromise</strong>. We are calling regarding the loan of{' '}
              <strong style={{ color: '#00D2FF' }}>{formattedAmount}</strong> due on{' '}
              <strong style={{ color: '#ffffff' }}>{callingLoan.dueDateDisplay}</strong>. Please confirm your repayment plan.&rdquo;
            </span>
          )}
        </div>

        {/* Call Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: isMuted ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              color: isMuted ? '#f43f5e' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            {isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
          </button>

          {/* End Call Button */}
          <button
            onClick={closeAICall}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(239, 68, 68, 0.5)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <FiPhoneOff size={26} />
          </button>

          <button
            onClick={() => { }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FiVolume2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
