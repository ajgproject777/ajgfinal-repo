import React, { useState } from 'react';
import type { NavPage, OwnerUser } from './types';
import { DashboardProvider, useDashboard } from './store/DashboardContext';
import { DEMO_OWNER } from './data/demoData';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { OverviewPage } from './pages/OverviewPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { OrdersPage } from './pages/OrdersPage';
import { MenuPage } from './pages/MenuPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const DashboardContent: React.FC<{ user: OwnerUser; onSignOut: () => void }> = ({
  user,
  onSignOut,
}) => {
  const [currentPage, setCurrentPage] = useState<NavPage>('overview');
  const { state } = useDashboard();

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        fontFamily: 'var(--font-family)',
      }}
    >
      {/* Persistent Sidebar */}
      <Sidebar
        current={currentPage}
        onNavigate={setCurrentPage}
        onSignOut={onSignOut}
        restaurantName={state.profile.name}
        isOpen={state.profile.isOpen}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <Topbar currentPage={currentPage} user={user} onSignOut={onSignOut} />

        <main
          style={{
            flex: 1,
            padding: '1.75rem 2rem 3rem',
            maxWidth: 1350,
            width: '100%',
            margin: '0 auto',
          }}
        >
          {currentPage === 'overview' && <OverviewPage onNavigate={setCurrentPage} />}
          {currentPage === 'reservations' && <ReservationsPage />}
          {currentPage === 'orders' && <OrdersPage />}
          {currentPage === 'menu' && <MenuPage />}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'settings' && <SettingsPage user={user} onSignOut={onSignOut} />}
        </main>
      </div>
    </div>
  );
};

export function App() {
  const [user, setUser] = useState<OwnerUser | null>(() => {
    try {
      const stored = sessionStorage.getItem('dinego_demo_owner');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          name: DEMO_OWNER.name,
          email: DEMO_OWNER.email,
          avatarInitials: DEMO_OWNER.avatarInitials,
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const handleLogin = (u: OwnerUser) => {
    setUser(u);
    try {
      sessionStorage.setItem('dinego_demo_owner', JSON.stringify(u));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      sessionStorage.removeItem('dinego_demo_owner');
    } catch {
      // Ignore
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <DashboardProvider>
      <DashboardContent user={user} onSignOut={handleSignOut} />
    </DashboardProvider>
  );
}

export default App;
