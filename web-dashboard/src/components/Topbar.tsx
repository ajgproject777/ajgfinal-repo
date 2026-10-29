import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import type { NavPage, OwnerUser } from '../types';
import { useDashboard } from '../store/DashboardContext';
import { formatRelativeTime } from '../utils/formatters';

const PAGE_LABELS: Record<NavPage, string> = {
  overview:     'Overview',
  reservations: 'Reservations',
  orders:       'Food Orders',
  menu:         'Menu Management',
  profile:      'Restaurant Profile',
  settings:     'Settings',
};

interface TopbarProps {
  currentPage: NavPage;
  user: OwnerUser;
  onSignOut: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ currentPage, user, onSignOut }) => {
  const { state, unreadCount, markAllNotificationsRead } = useDashboard();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleNotifs = () => {
    if (!showNotifs) {
      markAllNotificationsRead();
    }
    setShowNotifs((v) => !v);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile((v) => !v);
    setShowNotifs(false);
  };

  return (
    <header style={{
      height: 64,
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(14,13,12,0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0,
    }}>
      {/* Page title */}
      <div>
        <h1 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
          {PAGE_LABELS[currentPage]}
        </h1>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.05rem' }}>
          {state.profile.name}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            id="topbar-notifications"
            onClick={toggleNotifs}
            aria-label={`Notifications (${unreadCount} unread)`}
            style={{
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 38, height: 38, borderRadius: '50%',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(238,108,77,0.4)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -3, right: -3,
                backgroundColor: 'var(--brand-orange)', color: '#fff',
                fontSize: '0.6rem', fontWeight: 700, lineHeight: 1,
                width: 16, height: 16, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-primary)',
              }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {showNotifs && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowNotifs(false)} />
              <div style={{
                position: 'absolute', top: '110%', right: 0,
                width: 340, borderRadius: 12,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                zIndex: 100, overflow: 'hidden',
              }}>
                <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Notifications</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Recent</span>
                </div>
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {state.notifications.map((n) => (
                    <div key={n.id} style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: n.read ? 'transparent' : 'rgba(238,108,77,0.04)',
                    }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.3rem' }}>{n.message}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatRelativeTime(n.time)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile menu */}
        <div style={{ position: 'relative' }}>
          <button
            id="topbar-profile"
            onClick={toggleProfile}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.35rem 0.75rem 0.35rem 0.4rem',
              borderRadius: 8, cursor: 'pointer',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(238,108,77,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              backgroundColor: 'var(--brand-orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {user.avatarInitials}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 }}>{user.name.split(' ')[0]}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Owner</div>
            </div>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)', marginLeft: '0.15rem' }} />
          </button>

          {showProfile && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowProfile(false)} />
              <div style={{
                position: 'absolute', top: '110%', right: 0,
                width: 200, borderRadius: 10,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                zIndex: 100, overflow: 'hidden',
              }}>
                <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{user.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{user.email}</div>
                </div>
                <div style={{ padding: '0.4rem' }}>
                  <button style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.55rem 0.6rem', borderRadius: 6,
                    fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <User size={14} /> My Profile
                  </button>
                  <button
                    onClick={onSignOut}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.55rem 0.6rem', borderRadius: 6,
                      fontSize: '0.82rem', color: '#EF4444', cursor: 'pointer',
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
