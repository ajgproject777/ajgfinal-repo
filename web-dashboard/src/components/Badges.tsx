import React from 'react';
import type { ReservationStatus, OrderStatus } from '../types';

// ─── Generic pill badge ────────────────────────────────────────────────────

interface PillBadgeProps {
  label: string;
  color: string;
  bg: string;
  border: string;
  dot?: boolean;
}

export const PillBadge: React.FC<PillBadgeProps> = ({ label, color, bg, border, dot }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.2rem 0.65rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.01em',
    backgroundColor: bg,
    color,
    border: `1px solid ${border}`,
    whiteSpace: 'nowrap',
  }}>
    {dot && (
      <span style={{
        width: 6, height: 6,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-block',
        flexShrink: 0,
      }} />
    )}
    {label}
  </span>
);

// ─── Reservation status badge ──────────────────────────────────────────────

const RESERVATION_STATUS_CONFIG: Record<ReservationStatus, {
  label: string; color: string; bg: string; border: string;
}> = {
  pending:   { label: 'Pending',   color: '#F5A623', bg: 'rgba(245,166,35,0.12)',   border: 'rgba(245,166,35,0.3)' },
  confirmed: { label: 'Confirmed', color: '#10B981', bg: 'rgba(16,185,129,0.12)',   border: 'rgba(16,185,129,0.3)' },
  completed: { label: 'Completed', color: '#7BD0FF', bg: 'rgba(123,208,255,0.10)',  border: 'rgba(123,208,255,0.25)' },
  cancelled: { label: 'Cancelled', color: '#A09D96', bg: 'rgba(160,157,150,0.10)',  border: 'rgba(160,157,150,0.25)' },
  rejected:  { label: 'Rejected',  color: '#EF4444', bg: 'rgba(239,68,68,0.10)',    border: 'rgba(239,68,68,0.25)' },
};

export const ReservationBadge: React.FC<{ status: ReservationStatus }> = ({ status }) => {
  const cfg = RESERVATION_STATUS_CONFIG[status];
  return <PillBadge label={cfg.label} color={cfg.color} bg={cfg.bg} border={cfg.border} dot />;
};

// ─── Order status badge ────────────────────────────────────────────────────

const ORDER_STATUS_CONFIG: Record<OrderStatus, {
  label: string; color: string; bg: string; border: string;
}> = {
  received:  { label: 'Received',  color: '#7BD0FF', bg: 'rgba(123,208,255,0.10)', border: 'rgba(123,208,255,0.25)' },
  preparing: { label: 'Preparing', color: '#F5A623', bg: 'rgba(245,166,35,0.12)',  border: 'rgba(245,166,35,0.3)' },
  ready:     { label: 'Ready',     color: '#10B981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)' },
  completed: { label: 'Completed', color: '#A09D96', bg: 'rgba(160,157,150,0.10)', border: 'rgba(160,157,150,0.25)' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.25)' },
};

export const OrderBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const cfg = ORDER_STATUS_CONFIG[status];
  return <PillBadge label={cfg.label} color={cfg.color} bg={cfg.bg} border={cfg.border} dot />;
};

// ─── Veg / Non-veg badge ──────────────────────────────────────────────────

export const VegBadge: React.FC<{ isVeg: boolean }> = ({ isVeg }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: 3,
    border: `1.5px solid ${isVeg ? '#10B981' : '#EF4444'}`,
    flexShrink: 0,
  }}>
    <span style={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: isVeg ? '#10B981' : '#EF4444',
      display: 'block',
    }} />
  </span>
);

// ─── Existing StatusBadge kept for backward compat ─────────────────────────

export { StatusBadge } from './StatusBadge';
