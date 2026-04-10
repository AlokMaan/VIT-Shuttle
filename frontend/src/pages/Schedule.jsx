import { useState } from 'react';

const ROUTES = [
  {
    id: 'alpha', name: 'Route Alpha', color: '#0d9488', code: 'A', buses: ['VIT-001', 'VIT-009'],
    stops: [
      { name: 'Main Gate', time: '6:00', distance: '0 km' },
      { name: 'SJT Block', time: '6:08', distance: '1.2 km' },
      { name: 'TT Complex', time: '6:15', distance: '2.1 km' },
      { name: 'Hostel Zone', time: '6:22', distance: '3.0 km' },
      { name: 'Main Gate', time: '6:30', distance: '4.2 km' },
    ],
    frequency: '15 min', firstBus: '6:00 AM', lastBus: '10:00 PM', totalTrips: 64, duration: '30 min',
  },
  {
    id: 'beta', name: 'Route Beta', color: '#10b981', code: 'B', buses: ['VIT-003'],
    stops: [
      { name: 'Library', time: '6:10', distance: '0 km' },
      { name: 'Academic Block', time: '6:18', distance: '1.5 km' },
      { name: 'Food Court', time: '6:25', distance: '2.8 km' },
      { name: 'Library', time: '6:35', distance: '4.0 km' },
    ],
    frequency: '20 min', firstBus: '6:10 AM', lastBus: '9:40 PM', totalTrips: 48, duration: '25 min',
  },
  {
    id: 'charlie', name: 'Route Charlie', color: '#f59e0b', code: 'C', buses: ['VIT-007'],
    stops: [
      { name: 'VIT Gate 2', time: '6:20', distance: '0 km' },
      { name: 'Gym Complex', time: '6:30', distance: '1.8 km' },
      { name: 'Admin Block', time: '6:40', distance: '3.2 km' },
      { name: 'VIT Gate 2', time: '6:50', distance: '4.5 km' },
    ],
    frequency: '20 min', firstBus: '6:20 AM', lastBus: '9:20 PM', totalTrips: 45, duration: '30 min',
  },
];

export default function Schedule() {
  const [selected, setSelected] = useState(0);
  const route = ROUTES[selected];

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-tag"><span className="material-symbols-outlined">event_note</span> Timetables</div>
        <h1>Shuttle Schedule</h1>
        <p>Routes, stops, timings, and trip details for every campus shuttle</p>
      </div>

      {/* Route selector cards */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {ROUTES.map((r, i) => (
          <div key={r.id} className="card" onClick={() => setSelected(i)} style={{
            cursor: 'pointer', borderLeft: `4px solid ${r.color}`,
            borderColor: selected === i ? r.color : 'var(--border)',
            boxShadow: selected === i ? `0 0 0 2px ${r.color}30` : undefined,
            transition: 'var(--transition)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.5rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '.88rem' }}>{r.code}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '.92rem' }}>{r.name}</div>
                <div style={{ fontSize: '.7rem', color: 'var(--text-3)' }}>{r.buses.length} bus • {r.frequency} interval</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '.5rem', fontSize: '.72rem' }}>
              <span className="badge badge-green">{r.firstBus}</span>
              <span style={{ color: 'var(--text-4)' }}>→</span>
              <span className="badge badge-orange">{r.lastBus}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected route detail */}
      <div className="grid-main-side">
        <div>
          {/* Route info stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.75rem', marginBottom: '1rem' }}>
            {[
              { label: 'First Bus', value: route.firstBus, icon: 'wb_sunny', color: 'green' },
              { label: 'Last Bus', value: route.lastBus, icon: 'dark_mode', color: 'orange' },
              { label: 'Frequency', value: route.frequency, icon: 'schedule', color: 'blue' },
              { label: 'Trip Duration', value: route.duration, icon: 'timer', color: 'purple' },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center', padding: '.85rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: `var(--${s.color === 'blue' ? 'primary' : s.color})` }}>{s.icon}</span>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '.2rem' }}>{s.value}</div>
                <div style={{ fontSize: '.66rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Stops timeline */}
          <div className="card">
            <div className="card-title">
              <span className="material-symbols-outlined" style={{ color: route.color }}>route</span>
              {route.name} — Stops & Timings
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {route.stops.map((s, i) => (
                <div key={`${s.name}-${i}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem', padding: '.6rem 0' }}>
                  {/* Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: i === 0 || i === route.stops.length - 1 ? route.color : '#fff', border: `3px solid ${route.color}`, zIndex: 1 }} />
                    {i < route.stops.length - 1 && <div style={{ width: 2, height: 32, background: `${route.color}40`, marginTop: -2 }} />}
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '.4rem', borderBottom: i < route.stops.length - 1 ? '1px dashed var(--border)' : 'none' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '.88rem' }}>{s.name}</div>
                      <div style={{ fontSize: '.72rem', color: 'var(--text-4)' }}>{s.distance} from start</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '.92rem', color: route.color }}>{s.time}</div>
                      {i === 0 && <span className="badge badge-green" style={{ fontSize: '.58rem' }}>START</span>}
                      {i === route.stops.length - 1 && <span className="badge badge-orange" style={{ fontSize: '.58rem' }}>END</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <div className="card-title"><span className="material-symbols-outlined">directions_bus</span>Assigned Buses</div>
            {route.buses.map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: route.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '1.1rem' }}>directions_bus</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.84rem' }}>{b}</div>
                  <div style={{ fontSize: '.68rem', color: 'var(--text-3)' }}>{route.name}</div>
                </div>
                <span className="status-pill active" style={{ marginLeft: 'auto' }}>active</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title"><span className="material-symbols-outlined">info</span>Route Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
              {[
                { label: 'Total Daily Trips', value: route.totalTrips },
                { label: 'Stops', value: route.stops.length },
                { label: 'Buses Assigned', value: route.buses.length },
                { label: 'Operating Days', value: 'Mon — Sat' },
                { label: 'Sunday', value: 'Limited service' },
              ].map(i => (
                <div key={i.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem', padding: '.2rem 0' }}>
                  <span style={{ color: 'var(--text-3)' }}>{i.label}</span>
                  <span style={{ fontWeight: 700 }}>{i.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: `${route.color}10`, borderColor: route.color }}>
            <div style={{ textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: route.color }}>notifications_active</span>
              <div style={{ fontWeight: 700, fontSize: '.88rem', marginTop: '.3rem', color: route.color }}>Set Reminder</div>
              <div style={{ fontSize: '.74rem', color: 'var(--text-3)', marginTop: '.2rem' }}>Get notified when this bus arrives at your stop</div>
              <button className="btn btn-primary" style={{ marginTop: '.75rem', fontSize: '.78rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>alarm_add</span> Enable
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
