import { useUser } from '@clerk/clerk-react';
import { FiSearch, FiBell, FiPlus, FiMenu } from 'react-icons/fi';
import { usePocketPromise } from '../../context/PocketPromiseContext';

export default function HeaderBar({ onOpenMobile }) {
  const { user } = useUser();
  const { searchQuery, setSearchQuery, setIsAddModalOpen, activeRemindersCount } = usePocketPromise();

  const userName = user?.firstName || 'User';

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 0 20px 0',
        gap: '20px',
        flexWrap: 'wrap',
      }}
    >
      {/* Left: Greeting & Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Mobile menu toggle */}
        <button
          onClick={onOpenMobile}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f1f5f9',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="lg:hidden"
        >
          <FiMenu size={20} />
        </button>

        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Welcome back, {userName}
          </h1>
          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.86rem',
              marginTop: '4px',
              fontWeight: 400,
            }}
          >
            Track past lent money and automate reminders
          </p>
        </div>
      </div>

      {/* Right: Search, Notifications, + Add New Loan CTA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FiSearch
            size={16}
            style={{
              position: 'absolute',
              left: '14px',
              color: '#64748b',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: '#111726',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              padding: '9px 16px 9px 38px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              outline: 'none',
              width: '180px',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(0, 210, 255, 0.4)';
              e.target.style.boxShadow = '0 0 12px rgba(0, 210, 255, 0.15)';
              e.target.style.width = '220px';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.target.style.boxShadow = 'none';
              e.target.style.width = '180px';
            }}
          />
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#111726',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#111726';
            }}
          >
            <FiBell size={18} />
          </button>
          {/* Badge */}
          {activeRemindersCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#0072FF',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px rgba(0, 114, 255, 0.6)',
                border: '2px solid #0c101c',
              }}
            >
              {activeRemindersCount}
            </span>
          )}
        </div>

        {/* Add New Loan Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            backgroundColor: '#0072FF',
            backgroundImage: 'linear-gradient(135deg, #0072FF 0%, #0099FF 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(0, 114, 255, 0.35)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 114, 255, 0.5)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 114, 255, 0.35)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <FiPlus size={16} strokeWidth={2.5} />
          <span>Add New Loan</span>
        </button>
      </div>
    </header>
  );
}

