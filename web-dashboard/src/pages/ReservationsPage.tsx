import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, CheckCheck, Trash2 } from 'lucide-react';
import { useDashboard } from '../store/DashboardContext';
import { ReservationBadge } from '../components/Badges';
import { Modal } from '../components/Modal';
import { displayDate, formatDateTime } from '../utils/formatters';
import type { Reservation, ReservationStatus } from '../types';

const STATUS_OPTIONS: Array<ReservationStatus | 'all'> = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'];

export const ReservationsPage: React.FC = () => {
  const { state, confirmReservation, rejectReservation, completeReservation, cancelReservation } = useDashboard();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'all'>('all');
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = state.reservations.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = r.id.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.customerEmail.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleConfirm = (id: string) => { confirmReservation(id); showToast('Reservation confirmed.'); setSelected(null); };
  const handleComplete = (id: string) => { completeReservation(id); showToast('Reservation marked as completed.'); setSelected(null); };
  const handleCancel = (id: string) => { cancelReservation(id); setCancelConfirmId(null); showToast('Reservation cancelled.'); setSelected(null); };
  const handleReject = () => {
    if (!rejectModal) return;
    rejectReservation(rejectModal.id, rejectReason || 'No reason provided.');
    setRejectModal(null);
    setRejectReason('');
    showToast('Reservation rejected.');
    setSelected(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 999,
          padding: '0.75rem 1.25rem', borderRadius: 10,
          backgroundColor: '#10B981', color: '#fff',
          fontSize: '0.85rem', fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {toast}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            id="reservations-search"
            type="search"
            placeholder="Search by ref, name, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: '0.55rem', paddingBottom: '0.55rem',
              borderRadius: 8, border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)',
              fontSize: '0.85rem', fontFamily: 'var(--font-family)', outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            id="reservations-filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ReservationStatus | 'all')}
            style={{
              padding: '0.55rem 0.75rem', borderRadius: 8,
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)',
              fontSize: '0.85rem', fontFamily: 'var(--font-family)', cursor: 'pointer', outline: 'none',
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
        borderRadius: 12, overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                {['Booking Ref', 'Customer', 'Date & Time', 'Guests', 'Contact', 'Pre-Order', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No reservations match your search.
                  </td>
                </tr>
              ) : filtered.map((r) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.12s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'; }}
                >
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--brand-orange)', whiteSpace: 'nowrap' }}>{r.id}</td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 600 }}>{r.customerName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{r.customerEmail}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                    <div>{displayDate(r.date)}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{r.time}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{r.guests}</td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{r.customerPhone}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    {r.hasPreOrder ? (
                      <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.72rem' }}>Yes</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}><ReservationBadge status={r.status} /></td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <ActionBtn icon={<Eye size={13} />} label="View" onClick={() => setSelected(r)} color="#7BD0FF" />
                      {r.status === 'pending' && (
                        <>
                          <ActionBtn icon={<CheckCircle size={13} />} label="Confirm" onClick={() => handleConfirm(r.id)} color="#10B981" />
                          <ActionBtn icon={<XCircle size={13} />} label="Reject" onClick={() => setRejectModal({ id: r.id })} color="#EF4444" />
                        </>
                      )}
                      {r.status === 'confirmed' && (
                        <>
                          <ActionBtn icon={<CheckCheck size={13} />} label="Complete" onClick={() => handleComplete(r.id)} color="#10B981" />
                          <ActionBtn icon={<Trash2 size={13} />} label="Cancel" onClick={() => setCancelConfirmId(r.id)} color="#EF4444" />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <Modal title={`Reservation ${selected.id}`} onClose={() => setSelected(null)} width={580}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selected.customerName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{selected.customerEmail} · {selected.customerPhone}</div>
              </div>
              <ReservationBadge status={selected.status} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                ['Date', displayDate(selected.date)],
                ['Time', selected.time],
                ['Guests', String(selected.guests)],
                ['Pre-Order', selected.hasPreOrder ? selected.orderId ?? 'Yes' : 'No'],
                ['Booked', formatDateTime(selected.createdAt)],
                ['Corridor', 'NH 66'],
              ].map(([label, value]) => (
                <div key={label} style={{ backgroundColor: 'var(--bg-card)', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{label}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>
            {selected.notes && (
              <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 8, padding: '0.75rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>Customer Notes</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{selected.notes}</div>
              </div>
            )}
            {selected.rejectionReason && (
              <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.75rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>Rejection Reason</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{selected.rejectionReason}</div>
              </div>
            )}
            {/* Actions inside modal */}
            <div style={{ display: 'flex', gap: '0.6rem', paddingTop: '0.5rem' }}>
              {selected.status === 'pending' && (
                <>
                  <button onClick={() => handleConfirm(selected.id)} style={btnStyle('#10B981')}><CheckCircle size={14} /> Confirm</button>
                  <button onClick={() => { setSelected(null); setRejectModal({ id: selected.id }); }} style={btnStyle('#EF4444')}><XCircle size={14} /> Reject</button>
                </>
              )}
              {selected.status === 'confirmed' && (
                <>
                  <button onClick={() => handleComplete(selected.id)} style={btnStyle('#10B981')}><CheckCheck size={14} /> Mark Completed</button>
                  <button onClick={() => { setSelected(null); setCancelConfirmId(selected.id); }} style={btnStyle('#EF4444')}><Trash2 size={14} /> Cancel</button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Reject reason modal */}
      {rejectModal && (
        <Modal title="Reject Reservation" onClose={() => { setRejectModal(null); setRejectReason(''); }} width={440}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Provide an optional reason for rejecting reservation <strong style={{ color: 'var(--text-primary)' }}>{rejectModal.id}</strong>.</p>
            <textarea
              id="reject-reason-input"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Restaurant fully booked for this time slot."
              rows={3}
              style={{
                width: '100%', padding: '0.65rem', borderRadius: 8,
                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)', fontSize: '0.85rem',
                fontFamily: 'var(--font-family)', resize: 'vertical', outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={handleReject} style={btnStyle('#EF4444')}><XCircle size={14} /> Confirm Rejection</button>
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} style={btnStyle('var(--text-muted)')}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel confirm */}
      {cancelConfirmId && (
        <Modal title="Cancel Reservation" onClose={() => setCancelConfirmId(null)} width={400}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Are you sure you want to cancel reservation <strong style={{ color: 'var(--text-primary)' }}>{cancelConfirmId}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => handleCancel(cancelConfirmId)} style={btnStyle('#EF4444')}><Trash2 size={14} /> Yes, Cancel</button>
              <button onClick={() => setCancelConfirmId(null)} style={btnStyle('var(--text-muted)')}>Go Back</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────

interface ActionBtnProps { icon: React.ReactNode; label: string; onClick: () => void; color: string; }
const ActionBtn: React.FC<ActionBtnProps> = ({ icon, label, onClick, color }) => (
  <button
    title={label}
    aria-label={label}
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0.3rem', borderRadius: 6, cursor: 'pointer',
      color, border: `1px solid ${color}28`,
      backgroundColor: `${color}10`, transition: 'all 0.12s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${color}22`; }}
    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${color}10`; }}
  >
    {icon}
  </button>
);

const btnStyle = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
  padding: '0.55rem 1rem', borderRadius: 8, cursor: 'pointer',
  fontSize: '0.82rem', fontWeight: 700,
  backgroundColor: `${color}15`, color,
  border: `1px solid ${color}40`, transition: 'all 0.15s',
});
