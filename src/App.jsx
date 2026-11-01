import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0c101d',
            color: '#f1f5f9',
            border: '1px solid rgba(0, 210, 255, 0.25)',
            borderRadius: '12px',
            fontSize: '0.88rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
          },
        }}
      />

      <Routes>
        {/* Main Dashboard Layout (AppShell) */}
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Clerk Auth Pages */}
        <Route
          path="/sign-in/*"
          element={
            <div
              style={{
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#080c16',
              }}
            >
              <SignIn routing="path" path="/sign-in" />
            </div>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <div
              style={{
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#080c16',
              }}
            >
              <SignUp routing="path" path="/sign-up" />
            </div>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
