import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiPlusCircle, FiClock, FiSettings } from 'react-icons/fi';

const navItems = [
  { path: '/dashboard', icon: FiHome, label: 'Home' },
  { path: '/add', icon: FiPlusCircle, label: 'Add' },
  { path: '/history', icon: FiClock, label: 'History' },
  { path: '/settings', icon: FiSettings, label: 'Settings' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '72px',
        background: 'rgba(10, 10, 26, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--surface-glass-border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 100,
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              position: 'relative',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(99, 102, 241, 0.12)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            <item.icon
              size={22}
              style={{
                color: isActive ? 'var(--color-primary-400)' : 'var(--text-muted)',
                transition: 'color var(--transition-fast)',
                position: 'relative',
                zIndex: 1,
              }}
            />
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-primary-400)' : 'var(--text-muted)',
                transition: 'color var(--transition-fast)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
