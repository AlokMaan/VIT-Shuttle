import { useState } from 'react';

const LOGS = [
  { id: 1, bus: 'VIT-001', task: 'Engine Oil Change', type: 'Preventive', priority: 'low', status: 'completed', mechanic: 'Gopal R.', cost: 2500, date: '2026-04-08', next: '2026-07-08' },
  { id: 2, bus: 'VIT-011', task: 'Brake Pad Replacement', type: 'Corrective', priority: 'high', status: 'in-progress', mechanic: 'Anand S.', cost: 8000, date: '2026-04-10', next: '—' },
  { id: 3, bus: 'VIT-003', task: 'Tire Rotation & Alignment', type: 'Preventive', priority: 'medium', status: 'completed', mechanic: 'Ravi K.', cost: 3200, date: '2026-04-05', next: '2026-06-05' },
  { id: 4, bus: 'VIT-007', task: 'AC Servicing', type: 'Preventive', priority: 'low', status: 'scheduled', mechanic: 'Gopal R.', cost: 4500, date: '2026-04-15', next: '2026-10-15' },
  { id: 5, bus: 'VIT-009', task: 'Transmission Fluid Check', type: 'Inspection', priority: 'low', status: 'completed', mechanic: 'Ravi K.', cost: 1200, date: '2026-04-03', next: '2026-07-03' },
  { id: 6, bus: 'VIT-013', task: 'Full Engine Overhaul', type: 'Corrective', priority: 'high', status: 'in-progress', mechanic: 'Anand S., Gopal R.', cost: 45000, date: '2026-04-09', next: '—' },
  { id: 7, bus: 'VIT-001', task: 'Windshield Wiper Replacement', type: 'Corrective', priority: 'low', status: 'completed', mechanic: 'Ravi K.', cost: 800, date: '2026-04-01', next: '—' },
  { id: 8, bus: 'VIT-003', task: 'Battery Check & Replacement', type: 'Inspection', priority: 'medium', status: 'completed', mechanic: 'Anand S.', cost: 5500, date: '2026-03-28', next: '2026-09-28' },
];

const STATUS_COLORS = { completed: 'active', 'in-progress': 'idle', scheduled: 'offline' };
const PRIORITY_BADGES = { high: 'badge-red', medium: 'badge-orange', low: 'badge-green' };

export default function Maintenance() {
  const [filter, setFilter] = useState('all');
  const filtered = LOGS.filter(l => filter === 'all' || l.status === filter);
  const totalCost = LOGS.reduce((s, l) => s + l.cost, 0);

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-tag"><span className="material-symbols-outlined">build</span> Maintenance</div>
        <h1>Maintenance Log</h1>
        <p>Service records, inspections, and scheduled maintenance for the fleet</p>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card"><div className="stat-icon blue"><span className="material-symbols-outlined">build</span></div><div className="stat-value">{LOGS.length}</div><div className="stat-label">Total Records</div></div>
        <div className="stat-card"><div className="stat-icon green"><span className="material-symbols-outlined">check_circle</span></div><div className="stat-value">{LOGS.filter(l => l.status === 'completed').length}</div><div className="stat-label">Completed</div></div>
        <div className="stat-card"><div className="stat-icon orange"><span className="material-symbols-outlined">autorenew</span></div><div className="stat-value">{LOGS.filter(l => l.status === 'in-progress').length}</div><div className="stat-label">In Progress</div></div>
        <div className="stat-card"><div className="stat-icon purple"><span className="material-symbols-outlined">payments</span></div><div className="stat-value">₹{totalCost.toLocaleString('en-IN')}</div><div className="stat-label">Total Cost</div></div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '.3rem', marginBottom: '1rem' }}>
        {['all', 'completed', 'in-progress', 'scheduled'].map(f => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '.76rem', padding: '.3rem .65rem', textTransform: 'capitalize' }}
            onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Records' : f.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Bus</th><th>Task</th><th>Type</th><th>Priority</th><th>Mechanic</th><th>Cost</th><th>Status</th><th>Date</th><th>Next Due</th></tr></thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 800 }}>{l.bus}</td>
                  <td style={{ fontWeight: 600, maxWidth: 200 }}>{l.task}</td>
                  <td><span className="badge badge-blue">{l.type}</span></td>
                  <td><span className={`badge ${PRIORITY_BADGES[l.priority]}`}>{l.priority}</span></td>
                  <td style={{ fontSize: '.78rem' }}>{l.mechanic}</td>
                  <td style={{ fontWeight: 700 }}>₹{l.cost.toLocaleString('en-IN')}</td>
                  <td><span className={`status-pill ${STATUS_COLORS[l.status]}`}>{l.status}</span></td>
                  <td style={{ fontSize: '.76rem', color: 'var(--text-3)' }}>{l.date}</td>
                  <td style={{ fontSize: '.76rem', color: l.next === '—' ? 'var(--text-4)' : 'var(--green)', fontWeight: l.next !== '—' ? 600 : 400 }}>{l.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
