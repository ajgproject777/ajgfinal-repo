import React from 'react';
import {
  CalendarDays, ShoppingBag, Clock, CheckCircle2, Power,
  TrendingUp, ArrowRight, UtensilsCrossed, Activity,
} from 'lucide-react';
import { useDashboard } from '../store/DashboardContext';
import { ReservationBadge, OrderBadge } from '../components/Badges';
import { formatRelativeTime, formatINR, displayDate } from '../utils/formatters';
import type { NavPage } from '../types';

interface OverviewPageProps {
  onNavigate: (page: NavPage) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const { state, setRestaurantOpen } = useDashboard();
  const { reservations, orders, profile, recentActivity } = state;

  // Summary calculations
  const today = new Date().toISOString().slice(0, 10);
  const totalReservations = reservations.length;
  const todayReservations = reservations.filter((r) => r.date === today).length;
  const pendingReservations = reservations.filter((r) => r.status === 'pending').length;
  const todayOrders = orders.filter((o) => o.placedAt.slice(0, 10) === today).length;

  const upcomingReservations = reservations
    .filter((r) => r.status === 'pending' || r.status === 'confirmed')
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5);

  const recentOrders = orders
    .filter((o) => o.status !== 'completed')
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt))
    .slice(0, 4);

  const summaryCards = [
    { label: 'Total Reservations', value: totalReservations, icon: <CalendarDays size={20} />, color: '#7BD0FF', action: () => onNavigate('reservations') },
    { label: "Today's Reservations", value: todayReservations, icon: <Clock size={20} />, color: 'var(--brand-orange)', action: () => onNavigate('reservations') },
    { label: 'Pending Requests', value: pendingReservations, icon: <TrendingUp size={20} />, color: '#F5A623', action: () => onNavigate('reservations') },
    { label: "Today's Pre-orders", value: todayOrders, icon: <ShoppingBag size={20} />, color: '#10B981', action: () => onNavigate('orders') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Restaurant status + quick toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            backgroundColor: profile.isOpen ? '#10B981' : '#EF4444',
            boxShadow: profile.isOpen ? '0 0 0 3px rgba(16,185,129,0.2)' : '0 0 0 3px rgba(239,68,68,0.2)',
          }} />
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              {profile.name} is currently <span style={{ color: profile.isOpen ? '#10B981' : '#EF4444' }}>
                {profile.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              {profile.openingHours} – {profile.closingHours} · {profile.highwayCorridor} · KM {profile.highwayKmMark}
            </div>
          </div>
        </div>
        <button
          id="overview-toggle-open"
          onClick={() => setRestaurantOpen(!profile.isOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700,
            backgroundColor: profile.isOpen ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
            color: profile.isOpen ? '#EF4444' : '#10B981',
            border: `1px solid ${profile.isOpen ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <Power size={14} /> {profile.isOpen ? 'Close Restaurant' : 'Open Restaurant'}
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {summaryCards.map((card) => (
          <button
            key={card.label}
            onClick={card.action}
            style={{
              backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: 12, padding: '1.25rem', textAlign: 'left',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(238,108,77,0.35)'; e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                padding: '0.45rem', borderRadius: 8,
                backgroundColor: `${card.color}18`, color: card.color,
              }}>
                {card.icon}
              </div>
              <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
              {card.value}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.35rem', fontWeight: 500 }}>
              {card.label}
            </div>
          </button>
        ))}
      </div>

      {/* Two-column grid: upcoming reservations + recent orders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Upcoming reservations */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700 }}>
              <CalendarDays size={15} color="var(--brand-orange)" /> Upcoming Reservations
            </div>
            <button onClick={() => onNavigate('reservations')} style={{ fontSize: '0.72rem', color: 'var(--brand-orange)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          {upcomingReservations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>No upcoming reservations</div>
          ) : (
            <div>
              {upcomingReservations.map((r) => (
                <div key={r.id} style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.customerName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {r.id} · {displayDate(r.date)} {r.time} · {r.guests} guests
                    </div>
                  </div>
                  <ReservationBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700 }}>
              <ShoppingBag size={15} color="#10B981" /> Active Orders
            </div>
            <button onClick={() => onNavigate('orders')} style={{ fontSize: '0.72rem', color: 'var(--brand-orange)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>No active orders</div>
          ) : (
            <div>
              {recentOrders.map((o) => (
                <div key={o.id} style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{o.id}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {o.customerName} · {o.items.length} item{o.items.length !== 1 ? 's' : ''} · {formatINR(o.totalAmount)}
                    </div>
                  </div>
                  <OrderBadge status={o.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent activity + quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.25rem', alignItems: 'start' }}>
        {/* Activity feed */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700 }}>
            <Activity size={15} color="var(--text-secondary)" /> Recent Activity
          </div>
          {recentActivity.slice(0, 6).map((event) => (
            <div key={event.id} style={{
              padding: '0.7rem 1.25rem', borderBottom: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', marginTop: '0.4rem', flexShrink: 0,
                backgroundColor: event.type === 'reservation' ? 'var(--brand-orange)' : event.type === 'order' ? '#10B981' : '#7BD0FF',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{event.description}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{formatRelativeTime(event.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
          borderRadius: 12, padding: '1.25rem', minWidth: 200,
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.85rem' }}>Quick Actions</div>
          {[
            { label: 'View Reservations', icon: <CalendarDays size={15} />, page: 'reservations' as NavPage, color: 'var(--brand-orange)' },
            { label: 'Manage Orders', icon: <ShoppingBag size={15} />, page: 'orders' as NavPage, color: '#10B981' },
            { label: 'Update Menu', icon: <UtensilsCrossed size={15} />, page: 'menu' as NavPage, color: '#7BD0FF' },
            { label: 'Edit Profile', icon: <CheckCircle2 size={15} />, page: 'profile' as NavPage, color: '#F5A623' },
          ].map(({ label, icon, page, color }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.6rem 0.75rem', borderRadius: 8,
                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
                marginBottom: '0.5rem', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 600,
                color: 'var(--text-secondary)', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <span style={{ color }}>{icon}</span> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
