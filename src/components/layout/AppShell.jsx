import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PocketPromiseSidebar from './PocketPromiseSidebar';
import HeaderBar from '../dashboard/HeaderBar';
import { PocketPromiseProvider } from '../../context/PocketPromiseContext';

export default function AppShell() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <PocketPromiseProvider>
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          backgroundColor: '#080c16',
          color: '#f8fafc',
          overflowX: 'hidden',
          fontFamily: 'var(--font-primary)',
        }}
      >
        {/* Left Sidebar Navigation */}
        <PocketPromiseSidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Right Main Content Panel */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            padding: '0 28px',
            maxWidth: '1600px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* Top Header */}
          <HeaderBar onOpenMobile={() => setMobileSidebarOpen(true)} />

          {/* Page View */}
          <main style={{ flex: 1 }}>
            <Outlet />
          </main>
        </div>
      </div>
    </PocketPromiseProvider>
  );
}
