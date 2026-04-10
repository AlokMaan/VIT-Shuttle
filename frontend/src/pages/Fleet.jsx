import { useState } from 'react';

const FLEET = [
  { id: 'VIT-001', name: 'Campus Express 1', route: 'Route Alpha', routeColor: '#0d9488', driver: 'Rajesh Kumar', driverPhone: '+91 98765 43210', license: 'TN-46-AB-1234', capacity: 40, occupancy: 28, status: 'active', isAC: true, year: 2023, nextStop: 'SJT Block', eta: 4 },
  { id: 'VIT-003', name: 'Campus Express 2', route: 'Route Beta', routeColor: '#10b981', driver: 'Suresh M.', driverPhone: '+91 97654 32109', license: 'TN-46-CD-5678', capacity: 40, occupancy: 15, status: 'active', isAC: false, year: 2022, nextStop: 'Food Court', eta: 7 },
  { id: 'VIT-007', name: 'Campus Shuttle A', route: 'Route Charlie', routeColor: '#f59e0b', driver: 'Vijay S.', driverPhone: '+91 96543 21098', license: 'TN-46-EF-9012', capacity: 35, occupancy: 22, status: 'active', isAC: false, year: 2021, nextStop: 'Gym Complex', eta: 3 },
  { id: 'VIT-009', name: 'Campus Express 3', route: 'Route Alpha', routeColor: '#0d9488', driver: 'Manoj K.', driverPhone: '+91 95432 10987', license: 'TN-46-GH-3456', capacity: 40, occupancy: 35, status: 'active', isAC: true, year: 2023, nextStop: 'Hostel Zone', eta: 6 },
  { id: 'VIT-011', name: 'Reserve Bus 1', route: 'Unassigned', routeColor: '#94a3b8', driver: 'Pending', driverPhone: '—', license: 'TN-46-IJ-7890', capacity: 40, occupancy: 0, status: 'idle', isAC: false, year: 2020, nextStop: '—', eta: 0 },
  { id: 'VIT-013', name: 'Workshop Bus', route: 'Maintenance', routeColor: '#dc2626', driver: '—', driverPhone: '—', license: 'TN-46-KL-1234', capacity: 35, occupancy: 0, status: 'maintenance', isAC: false, year: 2019, nextStop: '—', eta: 0 },
];

export default function Fleet() {
  const [view, setView] = useState('cards'); // 'cards' | 'table'
  const [filter, setFilter] = useState('all');
  const filtered = FLEET.filter(b => filter === 'all' || b.status === filter);

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-tag"><span className="material-symbols-outlined">directions_bus</span> Fleet Management</div>
        <h1>Campus Fleet</h1>
        <p>All buses, drivers, routes, and real-time status</p>
      </div>

      {/* Summary bar */}
      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card"><div className="stat-icon blue"><span className="material-symbols-outlined">directions_bus</span></div><div className="stat-value">{FLEET.length}</div><div className="stat-label">Total Fleet</div></div>
        <div className="stat-card"><div className="stat-icon green"><span className="material-symbols-outlined">check_circle</span></div><div className="stat-value">{FLEET.filter(b => b.status === 'active').length}</div><div className="stat-label">On Route</div></div>
        <div className="stat-card"><div className="stat-icon orange"><span className="material-symbols-outlined">pause_circle</span></div><div className="stat-value">{FLEET.filter(b => b.status === 'idle').length}</div><div className="stat-label">Idle / Reserve</div></div>
        <div className="stat-card"><div className="stat-icon purple"><span className="material-symbols-outlined">build</span></div><div className="stat-value">{FLEET.filter(b => b.status === 'maintenance').length}</div><div className="stat-label">In Maintenance</div></div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '.3rem' }}>
          {['all', 'active', 'idle', 'maintenance'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '.76rem', padding: '.3rem .65rem', textTransform: 'capitalize' }}
              onClick={() => setFilter(f)}>
              {f === 'all' ? 'All Buses' : f}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '.3rem' }}>
          <button className={`btn ${view === 'cards' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '.3rem .5rem' }} onClick={() => setView('cards')}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>grid_view</span>
          </button>
          <button className={`btn ${view === 'table' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '.3rem .5rem' }} onClick={() => setView('table')}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>table_rows</span>
          </button>
        </div>
      </div>

      {/* Card View */}
      {view === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
          {filtered.map(b => (
            <div key={b.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Top color strip */}
              <div style={{ height: 4, background: b.routeColor }} />
              <div style={{ padding: '1.15rem', display: 'flex', gap: '1rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: b.routeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '1.6rem' }}>directions_bus</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.4rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>{b.id}</div>
                      <div style={{ fontSize: '.76rem', color: 'var(--text-3)' }}>{b.name}</div>
                    </div>
                    <span className={`status-pill ${b.status === 'active' ? 'active' : b.status === 'idle' ? 'idle' : 'offline'}`}>{b.status}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.25rem .5rem', fontSize: '.76rem', marginBottom: '.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '.85rem', color: b.routeColor }}>route</span>
                      <span style={{ fontWeight: 600 }}>{b.route}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '.85rem', color: 'var(--text-4)' }}>person</span>
                      <span style={{ fontWeight: 600 }}>{b.driver}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '.85rem', color: 'var(--text-4)' }}>call</span>
                      <span>{b.driverPhone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '.85rem', color: 'var(--text-4)' }}>badge</span>
                      <span>{b.license}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '.85rem', color: 'var(--text-4)' }}>event_seat</span>
                      <span>{b.capacity} seats{b.isAC ? ' ❄️ AC' : ''}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '.85rem', color: 'var(--text-4)' }}>calendar_month</span>
                      <span>Year {b.year}</span>
                    </div>
                  </div>

                  {/* Occupancy bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.68rem', marginBottom: '.2rem' }}>
                      <span style={{ color: 'var(--text-4)' }}>Occupancy</span>
                      <span style={{ fontWeight: 700, color: (b.occupancy/b.capacity) > .8 ? 'var(--red)' : (b.occupancy/b.capacity) > .5 ? 'var(--orange)' : 'var(--green)' }}>{b.occupancy}/{b.capacity}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(b.occupancy/b.capacity)*100}%`, borderRadius: 3, background: (b.occupancy/b.capacity) > .8 ? 'var(--red)' : (b.occupancy/b.capacity) > .5 ? 'var(--orange)' : 'var(--green)', transition: 'width .3s' }} />
                    </div>
                  </div>

                  {/* ETA */}
                  {b.status === 'active' && (
                    <div style={{ marginTop: '.5rem', padding: '.4rem .6rem', borderRadius: 'var(--radius-sm)', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', gap: '.35rem', fontSize: '.72rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '.85rem', color: 'var(--primary)' }}>location_on</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Next: {b.nextStop}</span>
                      <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--primary)' }}>ETA {b.eta} min</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table view */
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Bus ID</th><th>Name</th><th>Route</th><th>Driver</th><th>Phone</th><th>Seats</th><th>Occupancy</th><th>AC</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 800 }}>{b.id}</td>
                    <td>{b.name}</td>
                    <td><span style={{ color: b.routeColor, fontWeight: 600 }}>● {b.route}</span></td>
                    <td style={{ fontWeight: 600 }}>{b.driver}</td>
                    <td style={{ fontSize: '.76rem' }}>{b.driverPhone}</td>
                    <td>{b.capacity}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                        <div className="occ-bar"><div className="occ-fill" style={{ width: `${(b.occupancy/b.capacity)*100}%`, background: (b.occupancy/b.capacity) > .8 ? 'var(--red)' : 'var(--green)' }} /></div>
                        <span style={{ fontSize: '.72rem', fontWeight: 600 }}>{b.occupancy}/{b.capacity}</span>
                      </div>
                    </td>
                    <td>{b.isAC ? '❄️' : '—'}</td>
                    <td><span className={`status-pill ${b.status === 'active' ? 'active' : b.status === 'idle' ? 'idle' : 'offline'}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
