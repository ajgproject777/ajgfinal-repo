import React, { useState } from 'react';
import { Search, Filter, Eye, ArrowRight, XCircle, CheckCheck, Clock, ChefHat, BellRing } from 'lucide-react';
import { useDashboard } from '../store/DashboardContext';
import { OrderBadge } from '../components/Badges';
import { Modal } from '../components/Modal';
import { formatINR, formatDateTime } from '../utils/formatters';
import type { FoodOrder, OrderStatus } from '../types';

const STATUS_OPTIONS: Array<OrderStatus | 'all'> = [
  'all',
  'received',
  'preparing',
  'ready',
  'completed',
  'cancelled',
];

const NEXT_STATUS_MAP: Partial<Record<OrderStatus, { next: OrderStatus; label: string; icon: React.ReactNode; color: string }>> = {
  received: { next: 'preparing', label: 'Start Preparing', icon: <ChefHat size={13} />, color: '#F5A623' },
  preparing: { next: 'ready', label: 'Mark Ready', icon: <BellRing size={13} />, color: '#10B981' },
  ready: { next: 'completed', label: 'Complete Order', icon: <CheckCheck size={13} />, color: '#7BD0FF' },
};

export const OrdersPage: React.FC = () => {
  const { state, advanceOrderStatus, cancelOrder } = useDashboard();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<FoodOrder | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = state.orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      (o.reservationId && o.reservationId.toLowerCase().includes(q)) ||
      o.items.some((i) => i.name.toLowerCase().includes(q));
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAdvance = (id: string) => {
    advanceOrderStatus(id);
    const order = state.orders.find((o) => o.id === id);
    if (order) {
      const nextInfo = NEXT_STATUS_MAP[order.status];
      showToast(nextInfo ? `Order ${id} advanced to ${nextInfo.next}.` : `Order status updated.`);
    }
    // Update selected modal if open
    setSelectedOrder((prev) => {
      if (!prev || prev.id !== id) return prev;
      const orderAfter = state.orders.find((o) => o.id === id);
      return orderAfter || null;
    });
  };

  const handleCancel = (id: string) => {
    cancelOrder(id);
    setCancelConfirmId(null);
    setSelectedOrder(null);
    showToast(`Order ${id} cancelled.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 80,
            right: 24,
            zIndex: 999,
            padding: '0.75rem 1.25rem',
            borderRadius: 10,
            backgroundColor: '#10B981',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {toast}
        </div>
      )}

      {/* Information Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.75rem 1rem',
          borderRadius: 8,
          backgroundColor: 'rgba(123,208,255,0.06)',
          border: '1px solid rgba(123,208,255,0.2)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
        }}
      >
        <Clock size={15} color="#7BD0FF" style={{ flexShrink: 0 }} />
        <span>
          <strong style={{ color: '#7BD0FF' }}>Highway Pre-Orders</strong>: These food orders are placed ahead of customer arrival on NH 66 to minimise dwell time. Orders can be linked to a table reservation or processed as roadside takeaway.
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            id="orders-search"
            type="search"
            placeholder="Search order ref, customer, item, or booking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: 36,
              paddingRight: 12,
              paddingTop: '0.55rem',
              paddingBottom: '0.55rem',
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-family)',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            id="orders-filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-family)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Orders Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                {['Order Ref', 'Customer', 'Linked Reservation', 'Items Summary', 'Total Amount', 'Placed At', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No food orders match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const nextAction = NEXT_STATUS_MAP[o.status];
                  const totalItems = o.items.reduce((acc, i) => acc + i.quantity, 0);

                  return (
                    <tr
                      key={o.id}
                      style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.12s' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'rgba(255,255,255,0.02)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#10B981', whiteSpace: 'nowrap' }}>
                        {o.id}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {o.customerName}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                        {o.reservationId ? (
                          <span style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>{o.reservationId}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.75rem' }}>Walk-in / Direct</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span style={{ fontWeight: 600 }}>{totalItems} item{totalItems !== 1 ? 's' : ''}: </span>
                          <span style={{ color: 'var(--text-secondary)' }}>
                            {o.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                        {formatINR(o.totalAmount)}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        {formatDateTime(o.placedAt)}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <OrderBadge status={o.status} />
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button
                            title="View Order Details"
                            onClick={() => setSelectedOrder(o)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0.3rem',
                              borderRadius: 6,
                              color: '#7BD0FF',
                              border: '1px solid rgba(123,208,255,0.25)',
                              backgroundColor: 'rgba(123,208,255,0.1)',
                              cursor: 'pointer',
                            }}
                          >
                            <Eye size={13} />
                          </button>

                          {nextAction && (
                            <button
                              title={nextAction.label}
                              onClick={() => handleAdvance(o.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.3rem 0.6rem',
                                borderRadius: 6,
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: nextAction.color,
                                border: `1px solid ${nextAction.color}35`,
                                backgroundColor: `${nextAction.color}15`,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {nextAction.icon}
                              <span>{nextAction.label}</span>
                            </button>
                          )}

                          {o.status !== 'completed' && o.status !== 'cancelled' && (
                            <button
                              title="Cancel Order"
                              onClick={() => setCancelConfirmId(o.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0.3rem',
                                borderRadius: 6,
                                color: '#EF4444',
                                border: '1px solid rgba(239,68,68,0.25)',
                                backgroundColor: 'rgba(239,68,68,0.1)',
                                cursor: 'pointer',
                              }}
                            >
                              <XCircle size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal title={`Food Order ${selectedOrder.id}`} onClose={() => setSelectedOrder(null)} width={560}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedOrder.customerName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {selectedOrder.reservationId ? `Linked Reservation: ${selectedOrder.reservationId}` : 'Walk-in Direct Order'} · Placed {formatDateTime(selectedOrder.placedAt)}
                </div>
              </div>
              <OrderBadge status={selectedOrder.status} />
            </div>

            {/* Items Breakdown */}
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Ordered Items
              </div>
              <div>
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid var(--border-color)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {formatINR(item.unitPrice)} each
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        {formatINR(item.unitPrice * item.quantity)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Total Payable</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-orange)' }}>
                  {formatINR(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              {NEXT_STATUS_MAP[selectedOrder.status] && (
                <button
                  onClick={() => {
                    handleAdvance(selectedOrder.id);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 1.25rem',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    backgroundColor: 'var(--brand-orange)',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(238,108,77,0.3)',
                  }}
                >
                  <ArrowRight size={15} />
                  {NEXT_STATUS_MAP[selectedOrder.status]?.label}
                </button>
              )}

              {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                <button
                  onClick={() => {
                    setCancelConfirmId(selectedOrder.id);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 1rem',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    backgroundColor: 'rgba(239,68,68,0.12)',
                    color: '#EF4444',
                    border: '1px solid rgba(239,68,68,0.3)',
                  }}
                >
                  <XCircle size={15} /> Cancel Order
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirmId && (
        <Modal title="Cancel Food Order" onClose={() => setCancelConfirmId(null)} width={400}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Are you sure you want to cancel order <strong style={{ color: 'var(--text-primary)' }}>{cancelConfirmId}</strong>? This action will mark the order as cancelled.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setCancelConfirmId(null)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 8,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
              >
                Go Back
              </button>
              <button
                onClick={() => handleCancel(cancelConfirmId)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1rem',
                  borderRadius: 8,
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#fff',
                  backgroundColor: '#EF4444',
                  cursor: 'pointer',
                }}
              >
                <XCircle size={14} /> Yes, Cancel Order
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
