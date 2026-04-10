import { useState } from 'react';

const ALERTS = [
  { id: 1, type: 'info', severity: 'low', title: 'Route Alpha — Schedule Update', desc: 'Frequency increased to every 12 minutes during peak hours (8AM-10AM, 4PM-6PM). Effective from April 11.', time: '2 hours ago', route: 'Alpha' },
  { id: 2, type: 'warning', severity: 'medium', title: 'VIT-011 Under Maintenance', desc: 'Reserve Bus 1 (VIT-011) is undergoing scheduled brake replacement. Expected back in service by April 13.', time: '4 hours ago', route: 'Reserve' },
  { id: 3, type: 'success', severity: 'low', title: 'Route Charlie Now Operational', desc: 'The new Route Charlie (Gate 2 → Gym → Admin Block) is now live with bus VIT-007 assigned. Check Schedule for timings.', time: '1 day ago', route: 'Charlie' },
  { id: 4, type: 'error', severity: 'high', title: 'Route Beta — Temporary Detour', desc: 'Due to road repair work near Food Court, Route Beta will take an alternate path until April 15. ETA may increase by 5 minutes.', time: '1 day ago', route: 'Beta' },
  { id: 5, type: 'success', severity: 'low', title: 'AC Buses on Route Alpha', desc: 'Both buses (VIT-001, VIT-009) on Route Alpha are now air-conditioned. Enjoy a comfortable ride! ❄️', time: '2 days ago', route: 'Alpha' },
  { id: 6, type: 'info', severity: 'low', title: 'Holiday Schedule — April 12-14', desc: 'Modified timings will be in effect during the Pongal holiday. First bus: 8:00 AM, Last bus: 8:00 PM. Frequency: 25 minutes.', time: '3 days ago', route: 'All' },
  { id: 7, type: 'warning', severity: 'medium', title: 'Pass Expiry Reminder', desc: 'Your monthly pass expires in 3 days. Renew now to avoid interruption. Visit Settings → Subscription.', time: '3 days ago', route: '—' },
  { id: 8, type: 'info', severity: 'low', title: 'Feedback Survey', desc: 'Help us improve! Complete the campus transport satisfaction survey and get a chance to win a free monthly pass.', time: '5 days ago', route: '—' },
];

const FILTERS = ['all', 'info', 'warning', 'success', 'error'];
const ICONS = { info: 'info', warning: 'warning', success: 'check_circle', error: 'error' };
const ICON_CLASSES = { info: 'info', warning: 'warn', success: 'ok', error: 'err' };

export default function Alerts() {
  const [filter, setFilter] = useState('all');
  const filtered = ALERTS.filter(a => filter === 'all' || a.type === filter);

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-tag"><span className="material-symbols-outlined">notifications_active</span> Alerts & Updates</div>
        <h1>Alerts</h1>
        <p>Service updates, schedule changes, and important notifications</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total', count: ALERTS.length, icon: 'notifications', color: 'blue' },
          { label: 'Urgent', count: ALERTS.filter(a => a.severity === 'high').length, icon: 'priority_high', color: 'orange' },
          { label: 'Resolved', count: ALERTS.filter(a => a.type === 'success').length, icon: 'check_circle', color: 'green' },
          { label: 'Info', count: ALERTS.filter(a => a.type === 'info').length, icon: 'info', color: 'purple' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '.85rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <div className={`stat-icon ${s.color}`}><span className="material-symbols-outlined">{s.icon}</span></div>
            <div><div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{s.count}</div><div style={{ fontSize: '.68rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '.3rem', marginBottom: '1rem' }}>
        {FILTERS.map(f => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '.76rem', padding: '.3rem .65rem', textTransform: 'capitalize' }}
            onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Alerts' : f}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
        {filtered.map(a => (
          <div key={a.id} className="alert-card" style={{ padding: '1rem 1.15rem' }}>
            <div className={`alert-icon ${ICON_CLASSES[a.type]}`}>
              <span className="material-symbols-outlined">{ICONS[a.type]}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.2rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: '.9rem' }}>{a.title}</span>
                {a.severity === 'high' && <span className="badge badge-red">URGENT</span>}
                {a.route !== '—' && <span className="badge badge-blue">{a.route}</span>}
              </div>
              <div style={{ fontSize: '.8rem', color: 'var(--text-3)', lineHeight: 1.6 }}>{a.desc}</div>
              <div style={{ fontSize: '.68rem', color: 'var(--text-4)', marginTop: '.35rem', display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '.8rem' }}>schedule</span>{a.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
