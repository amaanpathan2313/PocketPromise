import { motion } from 'framer-motion';
import { SignInButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FiArrowRight, FiShield, FiBell, FiGlobe } from 'react-icons/fi';
import Scene3D from '../components/dashboard/Scene3D';

const features = [
  {
    icon: FiBell,
    title: 'Auto Reminders',
    desc: 'Every 3 hours until they pay back',
  },
  {
    icon: FiGlobe,
    title: 'Multilingual',
    desc: 'English, Hindi & Marathi messages',
  },
  {
    icon: FiShield,
    title: 'Secure',
    desc: 'Your data stays private & encrypted',
  },
];

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--gradient-hero)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Ambient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '-5%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* 3D Scene */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <Scene3D height="240px" coinScale={1.4} />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 8vw, 3rem)',
          fontWeight: 900,
          textAlign: 'center',
          lineHeight: 1.1,
          marginBottom: '12px',
        }}
      >
        Lend<span className="gradient-text">Reminder</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          color: 'var(--text-secondary)',
          textAlign: 'center',
          fontSize: '1rem',
          maxWidth: '340px',
          lineHeight: 1.6,
          marginBottom: '32px',
        }}
      >
        Track money you lend. Auto-remind borrowers in{' '}
        <strong style={{ color: 'var(--color-primary-400)' }}>3 languages</strong> every 3 hours
        until they pay you back.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <SignInButton mode="modal">
          <button className="btn btn-primary btn-lg" style={{ gap: '10px' }}>
            Get Started
            <FiArrowRight size={20} />
          </button>
        </SignInButton>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginTop: '48px',
          maxWidth: '420px',
          width: '100%',
        }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            className="glass"
            style={{
              padding: '16px 12px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + i * 0.15 }}
          >
            <feature.icon size={22} color="var(--color-primary-400)" />
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {feature.title}
            </span>
            <span
              style={{
                fontSize: '0.6rem',
                color: 'var(--text-muted)',
                lineHeight: 1.3,
              }}
            >
              {feature.desc}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
