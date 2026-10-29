import React from 'react';
import {
  LayoutDashboard, CalendarDays, ShoppingBag, UtensilsCrossed,
  Store, Settings, LogOut, ChevronRight,
} from 'lucide-react';
import type { NavPage } from '../types';

interface SidebarProps {
  current: NavPage;
  onNavigate: (page: NavPage) => void;
  onSignOut: () => void;
  restaurantName: string;
  isOpen: boolean;
}

const NAV_ITEMS: { page: NavPage; label: string; icon: React.ReactNode }[] = [
  { page: 'overview',     label: 'Overview',           icon: <LayoutDashboard size={18} /> },
  { page: 'reservations', label: 'Reservations',        icon: <CalendarDays size={18} /> },
  { page: 'orders',       label: 'Food Orders',         icon: <ShoppingBag size={18} /> },
  { page: 'menu',         label: 'Menu Management',     icon: <UtensilsCrossed size={18} /> },
  { page: 'profile',      label: 'Restaurant Profile',  icon: <Store size={18} /> },
  { page: 'settings',     label: 'Settings',            icon: <Settings size={18} /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  current, onNavigate, onSignOut, restaurantName, isOpen,
}) => {
  return (
    <aside style={{
      width: 240,
      minWidth: 240,
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.25rem 1.25rem 1rem',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            backgroundColor: 'var(--brand-orange)', padding: '0.45rem', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(238,108,77,0.3)',
          }}>
            <UtensilsCrossed size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Dine<span style={{ color: 'var(--brand-orange)' }}>Go</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Partner Portal</div>
          </div>
        </div>

        {/* Restaurant info */}
        <div style={{
          marginTop: '0.85rem',
          padding: '0.6rem 0.75rem',
          borderRadius: 8,
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.2rem' }}>Managing</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{restaurantName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              backgroundColor: isOpen ? '#10B981' : '#EF4444',
              display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{ fontSize: '0.7rem', color: isOpen ? '#10B981' : '#EF4444', fontWeight: 600 }}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '0.75rem 0.75rem', overflowY: 'auto' }} aria-label="Main navigation">
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem', marginBottom: '0.4rem' }}>
          Navigation
        </div>
        {NAV_ITEMS.map(({ page, label, icon }) => {
          const active = current === page;
          return (
            <button
              key={page}
              id={`nav-${page}`}
              onClick={() => onNavigate(page)}
              aria-current={active ? 'page' : undefined}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: '0.65rem', padding: '0.6rem 0.75rem',
                borderRadius: 8, marginBottom: '0.2rem',
                backgroundColor: active ? 'rgba(238,108,77,0.12)' : 'transparent',
                color: active ? 'var(--brand-orange)' : 'var(--text-secondary)',
                fontSize: '0.875rem', fontWeight: active ? 700 : 500,
                border: active ? '1px solid rgba(238,108,77,0.25)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 0.15s',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {icon}
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
        <button
          id="sidebar-signout"
          onClick={onSignOut}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: '0.65rem', padding: '0.6rem 0.75rem',
            borderRadius: 8, color: 'var(--text-secondary)',
            fontSize: '0.875rem', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s',
            border: '1px solid transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)';
            e.currentTarget.style.color = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
