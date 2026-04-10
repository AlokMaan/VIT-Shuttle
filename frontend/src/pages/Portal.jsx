import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserName, getAuth } from '../utils/auth';
import { users, passes, card as cardApi } from '../services/api';

/* ── Hero Slides ── */
const SLIDES = [
  {
    gradient: 'linear-gradient(135deg, #0c1220 0%, #0f3d38 50%, #0d9488 100%)',
    tag: '🚌 VIT Campus Transit',
    title: 'Your Smart Shuttle Dashboard',
    desc: 'Track buses in real-time, buy digital passes, manage your shuttle card — all in one place.',
    cta: { label: 'Track Shuttle', icon: 'map', to: '/live-map' },
    cta2: { label: 'Buy Pass', icon: 'shopping_cart', to: '/buy-pass' },
  },
  {
    gradient: 'linear-gradient(135deg, #0c1220 0%, #312e81 50%, #6366f1 100%)',
    tag: '💳 VIT Shuttle Card',
    title: 'Tap. Ride. Go.',
    desc: 'Your digital transit card — add money instantly, earn 2% cashback, and enjoy seamless campus rides.',
    cta: { label: 'View My Card', icon: 'credit_card', to: '/settings' },
    cta2: { label: 'Add Money', icon: 'add', to: '/settings' },
  },
  {
    gradient: 'linear-gradient(135deg, #0c1220 0%, #064e3b 50%, #10b981 100%)',
    tag: '🎟️ Digital Pass System',
    title: 'QR Pass — No Paper Tickets',
    desc: 'Buy Daily (₹20), Monthly (₹400), or Yearly (₹3,000) passes. Get instant QR code — show & board.',
    cta: { label: 'Buy Now', icon: 'shopping_cart', to: '/buy-pass' },
    cta2: { label: 'View Plans', icon: 'confirmation_number', to: '/settings' },
  },
  {
    gradient: 'linear-gradient(135deg, #0c1220 0%, #713f12 50%, #f59e0b 100%)',
    tag: '🗺️ Live Route Tracking',
    title: '3 Routes. 4 Buses. Real-Time.',
    desc: 'Route Alpha, Beta, Charlie — track every bus live on the map with ETA, stops, and driver info.',
    cta: { label: 'Open Map', icon: 'map', to: '/live-map' },
    cta2: { label: 'Schedules', icon: 'event_note', to: '/schedule' },
  },
];

const FEATURES = [
  { icon: 'map', title: 'Live Tracking', desc: 'Real-time GPS tracking of all campus shuttles', color: 'blue' },
  { icon: 'qr_code_2', title: 'QR Pass', desc: 'Digital passes with QR — scan to board', color: 'green' },
  { icon: 'credit_card', title: 'Shuttle Card', desc: 'Add money, tap & ride, earn cashback', color: 'purple' },
  { icon: 'schedule', title: 'Smart Schedule', desc: 'Routes, stops, timetables for all buses', color: 'orange' },
  { icon: 'payment', title: 'Razorpay', desc: 'Secure payments via UPI, Card, NetBanking', color: 'blue' },
  { icon: 'notifications_active', title: 'Live Alerts', desc: 'Instant notifications for delays & changes', color: 'green' },
];

const STEPS = [
  { num: '01', title: 'Create Account', desc: 'Sign up with @vitstudent.ac.in email', icon: 'person_add' },
  { num: '02', title: 'Buy Pass or Add Money', desc: 'Choose a pass plan or top-up shuttle card', icon: 'shopping_cart' },
  { num: '03', title: 'Get QR Code', desc: 'Digital pass with QR generated instantly', icon: 'qr_code_2' },
  { num: '04', title: 'Board & Ride', desc: 'Show QR or tap card, track bus live', icon: 'directions_bus' },
];

const ROUTES_INFO = [
  { name: 'Route Alpha', stops: ['Main Gate', 'SJT Block', 'TT Complex', 'Hostel Zone'], color: '#0d9488', buses: 2, freq: '15 min' },
  { name: 'Route Beta', stops: ['Library', 'Academic Block', 'Food Court'], color: '#10b981', buses: 1, freq: '20 min' },
  { name: 'Route Charlie', stops: ['VIT Gate 2', 'Gym Complex', 'Admin Block'], color: '#f59e0b', buses: 1, freq: '20 min' },
];

export default function Portal() {
  const navigate = useNavigate();
  const name = getUserName();
  const auth = getAuth();
  const [greeting, setGreeting] = useState('');
  const [activePass, setActivePass] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [slide, setSlide] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
    users.dashboard().then(res => setDashData(res.dashboard)).catch(() => {});
    passes.active().then(res => setActivePass(res.pass)).catch(() => {});
    cardApi.getCard().then(res => setCardData(res.card)).catch(() => {});
  }, []);

  // Auto-slide
  useEffect(() => {
    timerRef.current = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goSlide = (i) => {
    setSlide(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000);
  };

  // cardData is now fetched from backend in useEffect above

  return (
    <div className="fade-up">
      {/* ━━━ HERO CAROUSEL ━━━ */}
      <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative', height: 220 }}>
        {SLIDES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0, background: s.gradient, padding: '2rem 2.5rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff',
            opacity: i === slide ? 1 : 0, transform: i === slide ? 'translateX(0)' : i < slide ? 'translateX(-40px)' : 'translateX(40px)',
            transition: 'opacity .6s ease, transform .6s ease', pointerEvents: i === slide ? 'auto' : 'none',
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', right: -30, top: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
            <div style={{ position: 'absolute', right: 80, bottom: -50, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.08em', opacity: .7, marginBottom: '.4rem' }}>{s.tag}</div>
              <div style={{ fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', fontWeight: 800, marginBottom: '.35rem', letterSpacing: '-.02em' }}>
                {i === 0 ? `${greeting}, ${name}!` : s.title}
              </div>
              <div style={{ fontSize: '.88rem', opacity: .8, maxWidth: 520, lineHeight: 1.5, marginBottom: '.85rem' }}>{s.desc}</div>
              <div style={{ display: 'flex', gap: '.5rem' }}>
                <button onClick={() => navigate(s.cta.to)} style={{ background: 'rgba(255,255,255,.18)', color: '#fff', border: '1px solid rgba(255,255,255,.25)', padding: '.45rem .9rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.3rem', backdropFilter: 'blur(10px)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{s.cta.icon}</span> {s.cta.label}
                </button>
                <button onClick={() => navigate(s.cta2.to)} style={{ background: '#fff', color: '#1e293b', border: 'none', padding: '.45rem .9rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{s.cta2.icon}</span> {s.cta2.label}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '.4rem', zIndex: 5 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goSlide(i)} style={{
              width: i === slide ? 24 : 8, height: 8, borderRadius: 4,
              background: i === slide ? '#fff' : 'rgba(255,255,255,.35)',
              border: 'none', cursor: 'pointer', transition: 'all .3s',
            }} />
          ))}
        </div>

        {/* Arrows */}
        <button onClick={() => goSlide((slide - 1 + SLIDES.length) % SLIDES.length)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,.3)', color: '#fff', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, backdropFilter: 'blur(4px)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>chevron_left</span>
        </button>
        <button onClick={() => goSlide((slide + 1) % SLIDES.length)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,.3)', color: '#fff', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, backdropFilter: 'blur(4px)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>chevron_right</span>
        </button>
      </div>

      {/* ━━━ ACTIVE PASS + CARD BANNER ━━━ */}
      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        {/* Active Pass */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '1rem 1.15rem', background: activePass ? 'var(--green-bg)' : 'var(--surface-2)', borderColor: activePass ? 'var(--green)' : 'var(--border)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: activePass ? 'var(--green)' : 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: activePass ? '#fff' : 'var(--text-4)', fontSize: '1.2rem' }}>{activePass ? 'verified' : 'credit_card_off'}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '.88rem', color: activePass ? 'var(--green)' : 'var(--text-3)' }}>
              {activePass ? `${activePass.type?.toUpperCase()} PASS — Active` : 'No Active Pass'}
            </div>
            <div style={{ fontSize: '.72rem', color: 'var(--text-3)' }}>
              {activePass ? `Valid until ${new Date(activePass.endDate).toLocaleDateString('en-IN')}` : 'Buy a pass to start riding'}
            </div>
          </div>
          <button className="btn btn-secondary" style={{ fontSize: '.74rem' }} onClick={() => navigate(activePass ? '/settings' : '/buy-pass')}>
            {activePass ? 'View QR' : 'Buy Pass'}
          </button>
        </div>

        {/* Shuttle Card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '1rem 1.15rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #1e293b, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: '#4ade80', fontSize: '1.2rem' }}>credit_card</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '.88rem' }}>Shuttle Card</div>
            <div style={{ fontSize: '.72rem', color: 'var(--text-3)' }}>
              {cardData ? `Balance: ₹${cardData.balance?.toLocaleString('en-IN')} • ${cardData.number?.slice(-4)}` : 'View your transit card'}
            </div>
          </div>
          <button className="btn btn-secondary" style={{ fontSize: '.74rem' }} onClick={() => navigate('/settings')}>
            <span className="material-symbols-outlined" style={{ fontSize: '.85rem' }}>credit_card</span> Card
          </button>
        </div>
      </div>

      {/* ━━━ STATS ━━━ */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card"><div className="stat-icon blue"><span className="material-symbols-outlined">directions_bus</span></div><div className="stat-value">4</div><div className="stat-label">Active Shuttles</div><span className="stat-trend up">↑ 3 routes</span></div>
        <div className="stat-card"><div className="stat-icon green"><span className="material-symbols-outlined">route</span></div><div className="stat-value">3</div><div className="stat-label">Campus Routes</div><span className="stat-trend up">Alpha, Beta, Charlie</span></div>
        <div className="stat-card"><div className="stat-icon orange"><span className="material-symbols-outlined">confirmation_number</span></div><div className="stat-value">{dashData?.totalRides || 0}</div><div className="stat-label">My Rides</div><span className="stat-trend up">Lifetime</span></div>
        <div className="stat-card"><div className="stat-icon purple"><span className="material-symbols-outlined">avg_pace</span></div><div className="stat-value">94%</div><div className="stat-label">On-Time Rate</div><span className="stat-trend up">↑ 2%</span></div>
      </div>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div className="page-tag" style={{ display: 'inline-flex' }}><span className="material-symbols-outlined">school</span> How It Works</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginTop: '.35rem', letterSpacing: '-.02em' }}>4 Simple Steps to Start Riding</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
          {STEPS.map((s, i) => (
            <div key={s.num} className="card" style={{ textAlign: 'center', padding: '1.25rem 1rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 6, right: 10, fontSize: '2.5rem', fontWeight: 900, color: 'var(--border)', lineHeight: 1 }}>{s.num}</div>
              <div className={`stat-icon ${['blue', 'green', 'orange', 'purple'][i]}`} style={{ margin: '0 auto .65rem' }}>
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '.9rem', marginBottom: '.2rem' }}>{s.title}</div>
              <div style={{ fontSize: '.74rem', color: 'var(--text-3)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ━━━ CAMPUS ROUTES ━━━ */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div><div className="page-tag"><span className="material-symbols-outlined">route</span> Routes</div><h2 style={{ fontWeight: 800, fontSize: '1.15rem', marginTop: '.3rem' }}>Campus Routes</h2></div>
          <button className="btn btn-secondary" onClick={() => navigate('/schedule')}><span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>event_note</span> Schedule</button>
        </div>
        <div className="grid-3">
          {ROUTES_INFO.map(r => (
            <div key={r.name} className="card" style={{ borderLeft: `4px solid ${r.color}`, padding: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.65rem' }}>
                <div style={{ fontWeight: 800, fontSize: '.92rem', color: r.color }}>{r.name}</div>
                <div style={{ display: 'flex', gap: '.25rem' }}>
                  <span className="badge badge-green" style={{ fontSize: '.58rem' }}>{r.buses} bus</span>
                  <span className="badge badge-blue" style={{ fontSize: '.58rem' }}>{r.freq}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
                {r.stops.map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.78rem' }}>
                    <div style={{ width: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, border: '2px solid #fff', boxShadow: `0 0 0 1px ${r.color}` }} />
                      {i < r.stops.length - 1 && <div style={{ width: 2, height: 14, background: `${r.color}40` }} />}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-2)' }}>{s}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary" style={{ marginTop: '.75rem', width: '100%', justifyContent: 'center', fontSize: '.76rem' }} onClick={() => navigate('/live-map')}>
                <span className="material-symbols-outlined" style={{ fontSize: '.9rem' }}>my_location</span> Track
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ━━━ FEATURES ━━━ */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div className="page-tag" style={{ display: 'inline-flex' }}><span className="material-symbols-outlined">auto_awesome</span> Features</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginTop: '.35rem' }}>Everything You Need</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card" style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start', padding: '1.15rem' }}>
              <div className={`stat-icon ${f.color}`} style={{ flexShrink: 0 }}><span className="material-symbols-outlined">{f.icon}</span></div>
              <div><div style={{ fontWeight: 800, fontSize: '.9rem', marginBottom: '.15rem' }}>{f.title}</div><div style={{ fontSize: '.76rem', color: 'var(--text-3)', lineHeight: 1.5 }}>{f.desc}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* ━━━ QUICK ACTIONS + SIDEBAR ━━━ */}
      <div className="grid-main-side" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-title"><span className="material-symbols-outlined">bolt</span>Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '.75rem' }}>
            {[
              { icon: 'map', label: 'Live Map', desc: 'Track buses', to: '/live-map', color: 'blue' },
              { icon: 'shopping_cart', label: 'Buy Pass', desc: 'Get QR pass', to: '/buy-pass', color: 'purple' },
              { icon: 'credit_card', label: 'My Card', desc: 'View & top up', to: '/settings', color: 'green' },
              { icon: 'event_note', label: 'Schedule', desc: 'View timetables', to: '/schedule', color: 'orange' },
              { icon: 'qr_code_2', label: 'My QR', desc: 'Boarding pass', to: '/settings', color: 'blue' },
              { icon: 'chat', label: 'Support', desc: 'Chat with team', to: '/chat', color: 'green' },
            ].map(a => (
              <div key={a.label} onClick={() => navigate(a.to)} style={{ padding: '.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all .2s', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', gap: '.6rem' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                <div className={`stat-icon ${a.color}`}><span className="material-symbols-outlined">{a.icon}</span></div>
                <div><div style={{ fontWeight: 700, fontSize: '.82rem' }}>{a.label}</div><div style={{ fontSize: '.68rem', color: 'var(--text-3)' }}>{a.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <div className="card-title"><span className="material-symbols-outlined">campaign</span>Announcements</div>
            {[
              { title: 'All Systems Go', desc: 'Shuttles running normally', type: 'ok', icon: 'check_circle' },
              { title: 'Holiday Schedule', desc: 'Modified timings Apr 12', type: 'warn', icon: 'event' },
              { title: 'New Route Charlie', desc: 'Gate 2 → Gym → Admin', type: 'info', icon: 'add_road' },
              { title: 'AC on Route Alpha', desc: 'Both buses now AC ❄️', type: 'ok', icon: 'ac_unit' },
            ].map((a, i) => (
              <div key={i} className="alert-card" style={{ padding: '.55rem .65rem', marginBottom: '.3rem' }}>
                <div className={`alert-icon ${a.type}`}><span className="material-symbols-outlined">{a.icon}</span></div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '.78rem' }}>{a.title}</div><div style={{ fontSize: '.66rem', color: 'var(--text-3)' }}>{a.desc}</div></div>
              </div>
            ))}
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.68rem', color: 'var(--text-4)', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '.4rem' }}>Operating Hours</div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)' }}>6:00 AM — 10:00 PM</div>
            <div style={{ fontSize: '.76rem', color: 'var(--text-3)', marginTop: '.2rem' }}>Monday to Saturday</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '.65rem' }}>
              <div><div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--green)' }}>15 min</div><div style={{ fontSize: '.62rem', color: 'var(--text-4)' }}>Frequency</div></div>
              <div style={{ width: 1, background: 'var(--border)' }} />
              <div><div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--orange)' }}>10</div><div style={{ fontSize: '.62rem', color: 'var(--text-4)' }}>Stops</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
