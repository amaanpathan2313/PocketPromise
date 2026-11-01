import { useUser, useClerk } from '@clerk/clerk-react';
import { 
  FiGrid, 
  FiUsers, 
  FiBell, 
  FiClock, 
  FiPhoneCall, 
  FiBarChart2, 
  FiSettings, 
  FiLogOut 
} from 'react-icons/fi';
import { usePocketPromise } from '../../context/PocketPromiseContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
  { id: 'debtors', label: 'Debtors & Loans', icon: FiUsers },
  { id: 'reminders', label: 'Automated Reminders', icon: FiBell },
  { id: 'history', label: 'Transaction History', icon: FiClock },
  { id: 'ai-calls', label: 'AI Call Logs', icon: FiPhoneCall },
  { id: 'analytics', label: 'Analytics & Reports', icon: FiBarChart2 },
  { id: 'settings', label: 'Settings', icon: FiSettings },
];

export default function PocketPromiseSidebar({ mobileOpen, onCloseMobile }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { activeTab, setActiveTab } = usePocketPromise();

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const displayName = user?.firstName || 'Alex';
  const avatarUrl = user?.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
          className="lg:hidden"
        />
      )}

      <aside
        style={{
          width: '260px',
          backgroundColor: '#0c101c',
          borderRight: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 95,
          userSelect: 'none',
        }}
        className={`fixed lg:sticky top-0 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo Header */}
        <div
          style={{
            padding: '24px 22px 20px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00D2FF 0%, #0072FF 60%, #10B981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 210, 255, 0.35)',
            }}
          >
            {/* Stylized Ribbon / Spiral Vector */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M16 8C14 6 10 6 8 8C6 10 6 14 8 16C10 18 14 18 16 16"
                stroke="#00D2FF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                color: '#ffffff',
                lineHeight: 1.1,
              }}
            >
              Pocket<span style={{ color: '#00D2FF' }}>Promise</span>
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            flex: 1,
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            overflowY: 'auto',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid rgba(0, 210, 255, 0.25)' : '1px solid transparent',
                  backgroundColor: isActive ? 'rgba(0, 210, 255, 0.08)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  textAlign: 'left',
                  width: '100%',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '0px',
                      top: '20%',
                      bottom: '20%',
                      width: '3px',
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: '#00D2FF',
                      boxShadow: '0 0 10px #00D2FF',
                    }}
                  />
                )}
                <Icon
                  size={18}
                  style={{
                    color: isActive ? '#00D2FF' : '#64748b',
                    transition: 'color 0.18s ease',
                    flexShrink: 0,
                  }}
                />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile Section */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
            backgroundColor: 'rgba(12, 16, 28, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <img
              src={avatarUrl}
              alt={displayName}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(0, 210, 255, 0.3)',
                flexShrink: 0,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {displayName}
              </span>
              <span
                style={{
                  fontSize: '0.74rem',
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                User Profile
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (signOut) signOut();
            }}
            title="Log Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f43f5e';
              e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
