/**
 * VIT Shuttle — API Service Layer
 * Centralizes all backend communication
 */
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

function getToken() {
  try {
    const auth = JSON.parse(localStorage.getItem('vit-auth') || 'null');
    return auth?.token || '';
  } catch { return ''; }
}

function buildHeaders(json = true) {
  const h = {};
  const token = getToken();
  if (token) h.Authorization = `Bearer ${token}`;
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

async function request(path, opts = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...opts,
      headers: { ...buildHeaders(), ...(opts.headers || {}) },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 5002.');
    }
    throw err;
  }
}

// ── Auth ──────────────────────────────────────────────
export const auth = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  signup: (payload) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),

  me: () => request('/auth/me'),

  updateProfile: (data) =>
    request('/auth/update-profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// ── Passes ────────────────────────────────────────────
export const passes = {
  myPasses: () => request('/passes/my'),
  active: () => request('/passes/active'),
  verify: (qrCode) => request(`/passes/verify/${qrCode}`),
};

// ── Payments ──────────────────────────────────────────
export const payments = {
  createOrder: (passType) =>
    request('/payments/create-order', { method: 'POST', body: JSON.stringify({ passType }) }),

  verify: (payload) =>
    request('/payments/verify', { method: 'POST', body: JSON.stringify(payload) }),

  history: () => request('/payments/history'),
};

// ── Users / Dashboard ─────────────────────────────────
export const users = {
  dashboard: () => request('/users/dashboard'),
  markNotificationsRead: () =>
    request('/users/notifications/read', { method: 'PATCH' }),
};

// ── Admin ─────────────────────────────────────────────
export const admin = {
  stats: () => request('/admin/stats'),
  users: (page = 1, search = '') => request(`/admin/users?page=${page}&search=${encodeURIComponent(search)}`),
  toggleUser: (id) => request(`/admin/users/${id}/toggle`, { method: 'PATCH' }),
  payments: (page = 1) => request(`/admin/payments?page=${page}`),
  complaints: (status = '') => request(`/admin/complaints${status ? `?status=${status}` : ''}`),
  updateComplaint: (id, data) => request(`/admin/complaints/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  scanlogs: (page = 1) => request(`/admin/scanlogs?page=${page}`),
  analytics: () => request('/admin/analytics/revenue'),
};

// ── Shuttles ──────────────────────────────────────────
export const shuttles = {
  list: () => request('/shuttles'),
};

// ── Card (Shuttle Card) ───────────────────────────────
export const card = {
  getCard: () => request('/card'),
  transactions: () => request('/card/transactions'),
  topup: (amount) =>
    request('/card/topup', { method: 'POST', body: JSON.stringify({ amount }) }),
  verifyTopup: (payload) =>
    request('/card/verify-topup', { method: 'POST', body: JSON.stringify(payload) }),
};

// ── Complaints ────────────────────────────────────────
export const complaints = {
  submit: (data) =>
    request('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  myComplaints: () => request('/complaints/my'),
  track: (trackingId) => request(`/complaints/track/${trackingId}`),
};

export default { auth, passes, payments, users, admin, shuttles, card, complaints };
