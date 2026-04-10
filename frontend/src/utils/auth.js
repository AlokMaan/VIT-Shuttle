/**
 * Auth utility — read/write/clear session from localStorage
 */
const KEY = 'vit-auth';

export function getAuth() {
  try { return JSON.parse(localStorage.getItem(KEY)); }
  catch { return null; }
}

export function setAuth(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function isLoggedIn() {
  return !!getAuth()?.token;
}

export function getUserName() {
  const a = getAuth();
  return a?.name || a?.email?.split('@')[0] || 'Student';
}

export function getAvatarUrl(name) {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'S')}&backgroundColor=2563eb&textColor=ffffff`;
}
