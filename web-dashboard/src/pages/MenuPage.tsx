import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { useDashboard } from '../store/DashboardContext';
import { VegBadge } from '../components/Badges';
import { Modal } from '../components/Modal';
import { formatINR } from '../utils/formatters';
import type { MenuItem, MenuCategory } from '../types';

const CATEGORIES: MenuCategory[] = [
  'Starters',
  'Main Course',
  'Breads',
  'Rice',
  'Beverages',
  'Desserts',
];

interface FormState {
  name: string;
  description: string;
  category: MenuCategory;
  price: string;
  isVeg: boolean;
  isAvailable: boolean;
}

const initialFormState: FormState = {
  name: '',
  description: '',
  category: 'Main Course',
  price: '',
  isVeg: false,
  isAvailable: true,
};

export const MenuPage: React.FC = () => {
  const { state, addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability } = useDashboard();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredItems = state.menuItems.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormState(initialFormState);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormState({
      name: item.name,
      description: item.description,
      category: item.category,
      price: String(item.price),
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formState.name.trim()) {
      setFormError('Dish name is required.');
      return;
    }
    const numPrice = Number(formState.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError('Please enter a valid positive price in INR.');
      return;
    }

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name: formState.name.trim(),
        description: formState.description.trim(),
        category: formState.category,
        price: numPrice,
        isVeg: formState.isVeg,
        isAvailable: formState.isAvailable,
      });
      showToast(`Updated "${formState.name.trim()}"`);
    } else {
      addMenuItem({
        name: formState.name.trim(),
        description: formState.description.trim(),
        category: formState.category,
        price: numPrice,
        isVeg: formState.isVeg,
        isAvailable: formState.isAvailable,
      });
      showToast(`Added "${formState.name.trim()}" to menu`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const item = state.menuItems.find((m) => m.id === id);
    deleteMenuItem(id);
    setDeleteConfirmId(null);
    showToast(item ? `Deleted "${item.name}"` : 'Menu item deleted');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toast Notification */}
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

      {/* Top Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Menu Catalog</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Manage roadside pre-order dishes, prices, and instant item availability.
          </p>
        </div>
        <button
          id="btn-add-menu-item"
          onClick={openAddModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.6rem 1.1rem',
            borderRadius: 8,
            backgroundColor: 'var(--brand-orange)',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(238,108,77,0.35)',
            transition: 'opacity 0.15s',
          }}
        >
          <Plus size={16} /> Add Dish
        </button>
      </div>

      {/* Filter and Category Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 400 }}>
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
            id="menu-search"
            type="search"
            placeholder="Search dishes by name or description..."
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

        {/* Categories Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 20,
              fontSize: '0.8rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              border: selectedCategory === 'all' ? '1px solid var(--brand-orange)' : '1px solid var(--border-color)',
              backgroundColor: selectedCategory === 'all' ? 'rgba(238,108,77,0.15)' : 'var(--bg-card)',
              color: selectedCategory === 'all' ? 'var(--brand-orange)' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}
          >
            All Items ({state.menuItems.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = state.menuItems.filter((i) => i.category === cat).length;
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 20,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: active ? '1px solid var(--brand-orange)' : '1px solid var(--border-color)',
                  backgroundColor: active ? 'rgba(238,108,77,0.15)' : 'var(--bg-card)',
                  color: active ? 'var(--brand-orange)' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filteredItems.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '3rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            No menu items found matching the selected category and search filter.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: `1px solid ${item.isAvailable ? 'var(--border-color)' : 'rgba(239,68,68,0.25)'}`,
                borderRadius: 12,
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: item.isAvailable ? 1 : 0.72,
                transition: 'border-color 0.15s, opacity 0.15s',
              }}
            >
              <div>
                {/* Header row: Veg dot + category pill + actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <VegBadge isVeg={item.isVeg} />
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--text-muted)',
                        backgroundColor: 'var(--bg-card)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 4,
                      }}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      title="Edit Item"
                      onClick={() => openEditModal(item)}
                      style={{
                        padding: '0.3rem',
                        borderRadius: 6,
                        color: '#7BD0FF',
                        backgroundColor: 'rgba(123,208,255,0.08)',
                        border: '1px solid rgba(123,208,255,0.2)',
                        cursor: 'pointer',
                      }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      title="Delete Item"
                      onClick={() => setDeleteConfirmId(item.id)}
                      style={{
                        padding: '0.3rem',
                        borderRadius: 6,
                        color: '#EF4444',
                        backgroundColor: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {item.name}
                </div>

                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {item.description || 'No description provided.'}
                </p>
              </div>

              {/* Price & Availability footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-orange)' }}>
                  {formatINR(item.price)}
                </div>

                <button
                  onClick={() => toggleMenuItemAvailability(item.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 20,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: item.isAvailable ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    color: item.isAvailable ? '#10B981' : '#EF4444',
                    border: `1px solid ${item.isAvailable ? 'rgba(16,185,129,0.28)' : 'rgba(239,68,68,0.28)'}`,
                    transition: 'all 0.15s',
                  }}
                >
                  {item.isAvailable ? <Check size={12} /> : <X size={12} />}
                  <span>{item.isAvailable ? 'Available' : 'Sold Out'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <Modal
          title={editingItem ? `Edit Dish: ${editingItem.name}` : 'Add New Dish to Menu'}
          onClose={() => setIsModalOpen(false)}
          width={520}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {formError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 8,
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#EF4444',
                  fontSize: '0.82rem',
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{formError}</span>
              </div>
            )}

            {/* Dish Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Dish Name *
              </label>
              <input
                id="menu-form-name"
                type="text"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder="e.g. Kundapur Prawn Masala"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Description
              </label>
              <textarea
                id="menu-form-desc"
                rows={2}
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                placeholder="Key ingredients, cooking style, or accompaniments..."
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-family)',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            </div>

            {/* Category & Price Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Category *
                </label>
                <select
                  id="menu-form-category"
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value as MenuCategory })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Price (INR ₹) *
                </label>
                <input
                  id="menu-form-price"
                  type="number"
                  min="1"
                  step="1"
                  value={formState.price}
                  onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                  placeholder="e.g. 350"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Toggles: Veg & Available */}
            <div style={{ display: 'flex', gap: '1.5rem', padding: '0.5rem 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={formState.isVeg}
                  onChange={(e) => setFormState({ ...formState, isVeg: e.target.checked })}
                  style={{ accentColor: '#10B981', width: 16, height: 16 }}
                />
                <span style={{ fontWeight: 600 }}>Pure Vegetarian</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={formState.isAvailable}
                  onChange={(e) => setFormState({ ...formState, isAvailable: e.target.checked })}
                  style={{ accentColor: 'var(--brand-orange)', width: 16, height: 16 }}
                />
                <span style={{ fontWeight: 600 }}>Mark Available for Order</span>
              </label>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="menu-form-submit"
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#fff',
                  backgroundColor: 'var(--brand-orange)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(238,108,77,0.3)',
                }}
              >
                {editingItem ? 'Save Changes' : 'Add Dish'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal title="Delete Menu Item" onClose={() => setDeleteConfirmId(null)} width={400}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete this item from your restaurant's menu catalog?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
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
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
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
                <Trash2 size={14} /> Yes, Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
