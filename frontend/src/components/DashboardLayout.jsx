import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { getAuth, clearAuth, getUserName, getAvatarUrl } from '../utils/auth';
import ChatBox from './ChatBox';

const NAV_ITEMS = [
  { to: '/portal',      label: 'Portal',      icon: 'dashboard' },
  { to: '/live-map',    label: 'Live Map',     icon: 'map' },
  { to: '/fleet',       label: 'Fleet',        icon: 'directions_bus' },
  { to: '/schedule',    label: 'Schedule',     icon: 'event_note' },
  { to: '/maintenance', label: 'Maintenance',  icon: 'build' },
  { to: '/alerts',      label: 'Alerts',       icon: 'notifications_active' },
  { to: '/chat',        label: 'Chat',         icon: 'chat' },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [ddOpen, setDdOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clock, setClock] = useState('--:--:--');
  const ddRef = useRef(null);

  const auth = getAuth();
  const userName = getUserName();
  const avatarUrl = getAvatarUrl(userName);
  const isAdmin = auth?.role === 'admin';

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const [theme, setTheme] = useState(localStorage.getItem('vit-theme') || 'light');
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('vit-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  useEffect(() => {
    const handler = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const doLogout = () => { clearAuth(); navigate('/signin'); };

  const allNavItems = isAdmin
    ? [{ to: '/admin', label: 'Admin', icon: 'admin_panel_settings' }, ...NAV_ITEMS]
    : NAV_ITEMS;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="nav-brand" onClick={() => navigate(isAdmin ? '/admin' : '/portal')}>
            <div className="nav-brand-icon">
              <span className="material-symbols-outlined">directions_bus</span>
            </div>
            <div className="nav-brand-text">
              <span className="nav-brand-name">VIT Shuttle</span>
              <span className="nav-brand-sub">{isAdmin ? 'Admin Panel' : 'Campus Transit'}</span>
            </div>
          </div>

          <div className="nav-menu">
            {allNavItems.map(item => (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}${item.to === '/admin' ? ' admin-tab' : ''}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="nav-actions">
            <div className="clock-chip">
              <span className="clock-label">IST</span>
              <span className="clock-time">{clock}</span>
            </div>

            <button className="nav-icon-btn" title="Alerts" onClick={() => navigate('/alerts')}>
              <span className="material-symbols-outlined">notifications</span>
              <span className="notif-dot" />
            </button>

            {/* Settings icon — top right */}
            <button className="nav-icon-btn" title="Settings" onClick={() => navigate('/settings')}>
              <span className="material-symbols-outlined">settings</span>
            </button>

            <div ref={ddRef} style={{ position: 'relative' }}>
              <div className={`profile-chip${ddOpen ? ' open' : ''}`} onClick={() => setDdOpen(!ddOpen)}>
                <img src={avatarUrl} alt="" className="profile-avatar" />
                <span className="profile-name">{userName}</span>
                {isAdmin && <span className="badge badge-red" style={{ fontSize: '.55rem', padding: '0 .3rem' }}>ADMIN</span>}
                <span className="role-dot" />
                <span className="material-symbols-outlined chevron">expand_more</span>
              </div>
              {ddOpen && (
                <div className="profile-dd">
                  <div className="dd-header">
                    <div className="dd-avatar"><img src={avatarUrl} alt="" /></div>
                    <div>
                      <div className="dd-name">{userName}</div>
                      <div className="dd-role">{auth?.role || 'Student'}</div>
                    </div>
                  </div>
                  <div className="dd-body">
                    <button className="dd-item" onClick={() => { setDdOpen(false); navigate('/settings'); }}>
                      <span className="material-symbols-outlined">settings</span> Settings
                    </button>
                    {isAdmin && (
                      <button className="dd-item" onClick={() => { setDdOpen(false); navigate('/admin'); }}>
                        <span className="material-symbols-outlined">admin_panel_settings</span> Admin Panel
                      </button>
                    )}
                    <button className="dd-item" onClick={() => { setDdOpen(false); navigate('/buy-pass'); }}>
                      <span className="material-symbols-outlined">shopping_cart</span> Buy Pass
                    </button>
                    <div className="dd-divider" />
                    <button className="dd-item" onClick={() => { setDdOpen(false); clearAuth(); navigate('/signin'); }}>
                      <span className="material-symbols-outlined">swap_horiz</span> Switch User
                    </button>
                    <button className="dd-item danger" onClick={doLogout}>
                      <span className="material-symbols-outlined">logout</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
              <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>

            <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
              <i /><i /><i />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-drawer${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)}>
        <div className="mobile-drawer-panel" onClick={e => e.stopPropagation()}>
          {allNavItems.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}>
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '.5rem 0' }} />
          <div className="nav-item" onClick={() => { setMobileOpen(false); navigate('/settings'); }}>
            <span className="material-symbols-outlined">settings</span> Settings
          </div>
        </div>
      </div>

      <div className="dashboard">
        <main className="dash-main"><Outlet /></main>
      </div>

      <ChatBox />
    </>
  );
}
