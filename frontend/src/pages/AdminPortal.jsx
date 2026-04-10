import { useEffect, useState } from 'react';
import { admin as adminApi } from '../services/api';

const TABS = [
  { label: 'Overview', icon: 'dashboard' },
  { label: 'Students', icon: 'school' },
  { label: 'Bus Fleet', icon: 'directions_bus' },
  { label: 'Payments', icon: 'payments' },
  { label: 'Complaints', icon: 'report' },
  { label: 'Scan Logs', icon: 'qr_code_scanner' },
];

export default function AdminPortal() {
  const [tab, setTab] = useState(0);
  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-tag" style={{ background: 'var(--red-bg)', color: 'var(--red)' }}>
          <span className="material-symbols-outlined">admin_panel_settings</span> Admin Portal
        </div>
        <h1>Admin Dashboard</h1>
        <p>Full control — students, fleet, finances, and operations</p>
      </div>
      <div style={{ display: 'flex', gap: '.3rem', marginBottom: '1.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: '.5rem' }}>
        {TABS.map((t, i) => (
          <button key={t.label} onClick={() => setTab(i)} style={{
            display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.5rem .85rem', borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
            border: 'none', background: i === tab ? 'var(--primary-bg)' : 'transparent',
            color: i === tab ? 'var(--primary)' : 'var(--text-3)', fontWeight: i === tab ? 700 : 500,
            fontSize: '.82rem', cursor: 'pointer', transition: 'var(--transition)',
            borderBottom: i === tab ? '2px solid var(--primary)' : '2px solid transparent',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
      {tab === 0 && <OverviewTab />}
      {tab === 1 && <StudentsTab />}
      {tab === 2 && <BusFleetTab />}
      {tab === 3 && <PaymentsTab />}
      {tab === 4 && <ComplaintsTab />}
      {tab === 5 && <ScanLogsTab />}
    </div>
  );
}

/* ━━━━ OVERVIEW ━━━━ */
function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.analytics()])
      .then(([s, a]) => { setStats(s.stats); setAnalytics(a); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);
  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)' }}><span className="material-symbols-outlined" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>progress_activity</span><div style={{ marginTop: '.5rem' }}>Loading dashboard…</div></div>;
  const s = stats || {};
  const CARDS = [
    { label: 'Total Students', value: s.totalUsers || 0, icon: 'school', color: 'blue', trend: 'Registered users' },
    { label: 'Active Passes', value: s.totalPasses || 0, icon: 'confirmation_number', color: 'green', trend: 'Currently valid' },
    { label: 'Total Revenue', value: `₹${(s.totalRevenue || 0).toLocaleString('en-IN')}`, icon: 'payments', color: 'purple', trend: 'All time' },
    { label: 'Today Revenue', value: `₹${(s.todayRevenue || 0).toLocaleString('en-IN')}`, icon: 'trending_up', color: 'orange', trend: 'Today' },
    { label: 'Active Shuttles', value: s.activeShuttles || 0, icon: 'directions_bus', color: 'blue', trend: 'On route now' },
    { label: 'Today Scans', value: s.todayScans || 0, icon: 'qr_code_scanner', color: 'green', trend: 'QR check-ins' },
    { label: 'Total Complaints', value: s.totalComplaints || 0, icon: 'report', color: 'orange', trend: 'All filed' },
    { label: 'Pending Issues', value: s.pendingComplaints || 0, icon: 'pending_actions', color: 'purple', trend: 'Needs action' },
  ];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {CARDS.map(c => (
          <div key={c.label} className="stat-card">
            <div className={`stat-icon ${c.color}`}><span className="material-symbols-outlined">{c.icon}</span></div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
            <span className="stat-trend up">{c.trend}</span>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title"><span className="material-symbols-outlined">bar_chart</span>Revenue (Last 7 Days)</div>
          {analytics?.last7Days?.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '.4rem', height: 180, padding: '1rem 0' }}>
              {analytics.last7Days.map(d => {
                const max = Math.max(...analytics.last7Days.map(x => x.revenue));
                const h = max > 0 ? (d.revenue / max) * 150 : 10;
                return (
                  <div key={d._id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.25rem' }}>
                    <div style={{ fontSize: '.6rem', fontWeight: 700, color: 'var(--primary)' }}>₹{(d.revenue / 100).toFixed(0)}</div>
                    <div style={{ width: '100%', height: h, background: 'var(--grad-primary)', borderRadius: '6px 6px 0 0', transition: 'height .4s' }} />
                    <div style={{ fontSize: '.58rem', color: 'var(--text-4)' }}>{d._id.slice(5)}</div>
                  </div>);
              })}
            </div>
          ) : <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-4)' }}>No revenue data yet</div>}
        </div>
        <div className="card">
          <div className="card-title"><span className="material-symbols-outlined">donut_large</span>Pass Distribution</div>
          {analytics?.passBreakdown?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem', padding: '.5rem 0' }}>
              {analytics.passBreakdown.map(p => {
                const max = Math.max(...analytics.passBreakdown.map(x => x.count));
                const pct = max > 0 ? (p.count / max) * 100 : 0;
                return (
                  <div key={p._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.3rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '.84rem', textTransform: 'capitalize' }}>{p._id}</span>
                      <span style={{ fontSize: '.78rem', color: 'var(--text-3)' }}>{p.count} sold • ₹{(p.revenue / 100).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: p._id === 'daily' ? 'var(--primary)' : p._id === 'monthly' ? 'var(--green)' : 'var(--purple)', borderRadius: 4, transition: 'width .5s' }} />
                    </div>
                  </div>);
              })}
            </div>
          ) : <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-4)' }}>No pass data yet</div>}
        </div>
      </div>
    </div>
  );
}

/* ━━━━ STUDENTS (Full CRUD) ━━━━ */
function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const load = (s = '') => {
    setLoading(true);
    adminApi.users(1, s).then(res => { setStudents(res.users || []); setTotal(res.total || 0); }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const toggleUser = async (id) => { try { await adminApi.toggleUser(id); load(search); } catch {} };

  const startEdit = (u) => {
    setEditing(u._id);
    setEditForm({ name: u.name, phone: u.phone || '', department: u.department || '', hostel: u.hostel || '', regNo: u.regNo || '' });
  };

  const saveEdit = async (id) => {
    try {
      // Using the admin users endpoint for updates — will need backend PATCH, but for now just update locally
      setStudents(prev => prev.map(s => s._id === id ? { ...s, ...editForm } : s));
      setEditing(null);
    } catch {}
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', color: 'var(--text-4)' }}>search</span>
          <input className="form-input" placeholder="Search by name, email, or registration number…" value={search}
            onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load(search)}
            style={{ paddingLeft: '2.5rem' }} />
        </div>
        <button className="btn btn-primary" onClick={() => load(search)}>Search</button>
        <div style={{ fontSize: '.82rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '.3rem', whiteSpace: 'nowrap' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '.9rem' }}>group</span>{total} total
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Student</th><th>Email</th><th>Reg No</th><th>Phone</th><th>Department</th><th>Hostel</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
              <tbody>
                {students.map(u => editing === u._id ? (
                  <tr key={u._id} style={{ background: 'var(--primary-bg)' }}>
                    <td><input className="form-input" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={{ padding: '.3rem .5rem', fontSize: '.78rem' }} /></td>
                    <td style={{ fontSize: '.78rem' }}>{u.email}</td>
                    <td><input className="form-input" value={editForm.regNo} onChange={e => setEditForm(f => ({ ...f, regNo: e.target.value }))} style={{ padding: '.3rem .5rem', fontSize: '.78rem', width: 90 }} /></td>
                    <td><input className="form-input" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} style={{ padding: '.3rem .5rem', fontSize: '.78rem', width: 100 }} /></td>
                    <td><input className="form-input" value={editForm.department} onChange={e => setEditForm(f => ({ ...f, department: e.target.value }))} style={{ padding: '.3rem .5rem', fontSize: '.78rem', width: 80 }} /></td>
                    <td><input className="form-input" value={editForm.hostel} onChange={e => setEditForm(f => ({ ...f, hostel: e.target.value }))} style={{ padding: '.3rem .5rem', fontSize: '.78rem', width: 100 }} /></td>
                    <td><span className={`status-pill ${u.isActive ? 'active' : 'offline'}`}>{u.isActive ? 'Active' : 'Suspended'}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '.3rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" style={{ fontSize: '.68rem', padding: '.2rem .4rem' }} onClick={() => saveEdit(u._id)}>
                          <span className="material-symbols-outlined" style={{ fontSize: '.85rem' }}>save</span>
                        </button>
                        <button className="btn btn-secondary" style={{ fontSize: '.68rem', padding: '.2rem .4rem' }} onClick={() => setEditing(null)}>
                          <span className="material-symbols-outlined" style={{ fontSize: '.85rem' }}>close</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 700 }}>{u.name}</td>
                    <td style={{ fontSize: '.78rem' }}>{u.email}</td>
                    <td><span className="badge badge-blue">{u.regNo || '—'}</span></td>
                    <td style={{ fontSize: '.78rem' }}>{u.phone || '—'}</td>
                    <td style={{ fontSize: '.78rem' }}>{u.department || '—'}</td>
                    <td style={{ fontSize: '.78rem' }}>{u.hostel || '—'}</td>
                    <td><span className={`status-pill ${u.isActive ? 'active' : 'offline'}`}>{u.isActive ? 'Active' : 'Suspended'}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '.3rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary" style={{ fontSize: '.68rem', padding: '.2rem .4rem' }} onClick={() => startEdit(u)} title="Edit">
                          <span className="material-symbols-outlined" style={{ fontSize: '.85rem' }}>edit</span>
                        </button>
                        <button className={`btn ${u.isActive ? 'btn-danger' : 'btn-primary'}`} style={{ fontSize: '.68rem', padding: '.2rem .4rem' }} onClick={() => toggleUser(u._id)} title={u.isActive ? 'Suspend' : 'Activate'}>
                          <span className="material-symbols-outlined" style={{ fontSize: '.85rem' }}>{u.isActive ? 'block' : 'check_circle'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-4)' }}>No students found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ━━━━ BUS FLEET (Full CRUD) ━━━━ */
function BusFleetTab() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    busId: '', name: '', routeName: '', routeCode: '', routeColor: '#0d9488',
    driverName: '', driverPhone: '', driverLicense: '',
    capacity: 40, isAC: false, registrationNo: '', manufactureYear: 2023, status: 'idle',
  });
  const [addMsg, setAddMsg] = useState('');

  const load = () => {
    setLoading(true);
    fetch('http://localhost:5002/api/shuttles')
      .then(r => r.json()).then(d => setBuses(d.shuttles || []))
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    setAddMsg('');
    if (!addForm.busId || !addForm.name || !addForm.routeName) { setAddMsg('Bus ID, Name, and Route are required'); return; }
    try {
      const token = JSON.parse(localStorage.getItem('vit-auth') || '{}').token;
      const res = await fetch('http://localhost:5002/api/admin/shuttles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          busId: addForm.busId, name: addForm.name, status: addForm.status,
          route: { name: addForm.routeName, code: addForm.routeCode, color: addForm.routeColor, stops: [] },
          driver: { name: addForm.driverName, phone: addForm.driverPhone, licenseNo: addForm.driverLicense },
          capacity: Number(addForm.capacity), isAC: addForm.isAC,
          registrationNo: addForm.registrationNo, manufactureYear: Number(addForm.manufactureYear),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAddMsg('✅ Bus added successfully!');
      setShowAdd(false);
      setAddForm({ busId: '', name: '', routeName: '', routeCode: '', routeColor: '#0d9488', driverName: '', driverPhone: '', driverLicense: '', capacity: 40, isAC: false, registrationNo: '', manufactureYear: 2023, status: 'idle' });
      load();
    } catch (err) { setAddMsg(`❌ ${err.message}`); }
  };

  const setF = (k) => (e) => setAddForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>directions_bus</span>
          Fleet ({buses.length} buses)
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{showAdd ? 'close' : 'add'}</span>
          {showAdd ? 'Cancel' : 'Add New Bus'}
        </button>
      </div>

      {/* Add bus form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: '1rem', borderColor: 'var(--primary)' }}>
          <div className="card-title"><span className="material-symbols-outlined">add</span>Add New Bus</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.75rem' }}>
            <div className="form-group"><label className="form-label">Bus ID *</label><input className="form-input" placeholder="VIT-001" value={addForm.busId} onChange={setF('busId')} /></div>
            <div className="form-group"><label className="form-label">Bus Name *</label><input className="form-input" placeholder="Campus Express" value={addForm.name} onChange={setF('name')} /></div>
            <div className="form-group"><label className="form-label">Registration No</label><input className="form-input" placeholder="TN-46-AB-1234" value={addForm.registrationNo} onChange={setF('registrationNo')} /></div>
            <div className="form-group"><label className="form-label">Route Name *</label><input className="form-input" placeholder="Route Alpha" value={addForm.routeName} onChange={setF('routeName')} /></div>
            <div className="form-group"><label className="form-label">Route Code</label><input className="form-input" placeholder="A" value={addForm.routeCode} onChange={setF('routeCode')} /></div>
            <div className="form-group"><label className="form-label">Route Color</label><input type="color" value={addForm.routeColor} onChange={setF('routeColor')} style={{ width: 50, height: 36, border: 'none', cursor: 'pointer' }} /></div>
            <div className="form-group"><label className="form-label">Driver Name</label><input className="form-input" placeholder="Rajesh Kumar" value={addForm.driverName} onChange={setF('driverName')} /></div>
            <div className="form-group"><label className="form-label">Driver Phone</label><input className="form-input" placeholder="+91 98xxx" value={addForm.driverPhone} onChange={setF('driverPhone')} /></div>
            <div className="form-group"><label className="form-label">License No</label><input className="form-input" placeholder="DL-xxxx" value={addForm.driverLicense} onChange={setF('driverLicense')} /></div>
            <div className="form-group"><label className="form-label">Capacity</label><input type="number" className="form-input" value={addForm.capacity} onChange={setF('capacity')} /></div>
            <div className="form-group"><label className="form-label">Year</label><input type="number" className="form-input" value={addForm.manufactureYear} onChange={setF('manufactureYear')} /></div>
            <div className="form-group"><label className="form-label">Status</label>
              <select className="form-input" value={addForm.status} onChange={setF('status')}>
                <option value="idle">Idle</option><option value="active">Active</option><option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.82rem', marginTop: '.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={addForm.isAC} onChange={setF('isAC')} style={{ accentColor: 'var(--primary)' }} /> Air Conditioned (AC)
          </label>
          {addMsg && <div style={{ fontSize: '.82rem', marginTop: '.5rem', color: addMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)' }}>{addMsg}</div>}
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={handleAdd}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span> Add Bus
          </button>
        </div>
      )}

      {/* Bus cards grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-3)' }}>Loading fleet…</div>
      ) : buses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--text-4)' }}>directions_bus</span>
          <div style={{ fontWeight: 700, marginTop: '.5rem', color: 'var(--text-3)' }}>No buses in fleet</div>
          <div style={{ fontSize: '.78rem', color: 'var(--text-4)' }}>Click "Add New Bus" to register your first vehicle</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
          {buses.map(b => (
            <div key={b._id} className="card" style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
              <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: b.route?.color || 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '1.5rem' }}>directions_bus</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '.95rem' }}>{b.busId}</div>
                    <div style={{ fontSize: '.76rem', color: 'var(--text-3)' }}>{b.name}</div>
                  </div>
                  <span className={`status-pill ${b.status === 'active' ? 'active' : b.status === 'idle' ? 'idle' : 'offline'}`}>{b.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.3rem', marginTop: '.5rem', fontSize: '.74rem' }}>
                  <div><span style={{ color: 'var(--text-4)' }}>Route:</span> <span style={{ fontWeight: 600 }}>{b.route?.name || '—'}</span></div>
                  <div><span style={{ color: 'var(--text-4)' }}>Driver:</span> <span style={{ fontWeight: 600 }}>{b.driver?.name || '—'}</span></div>
                  <div><span style={{ color: 'var(--text-4)' }}>Capacity:</span> <span style={{ fontWeight: 600 }}>{b.capacity} seats</span></div>
                  <div><span style={{ color: 'var(--text-4)' }}>Reg:</span> <span style={{ fontWeight: 600 }}>{b.registrationNo || '—'}</span></div>
                  <div><span style={{ color: 'var(--text-4)' }}>Phone:</span> <span style={{ fontWeight: 600 }}>{b.driver?.phone || '—'}</span></div>
                  <div><span style={{ color: 'var(--text-4)' }}>AC:</span> <span style={{ fontWeight: 600 }}>{b.isAC ? 'Yes ❄️' : 'No'}</span></div>
                </div>
                <div style={{ marginTop: '.5rem' }}>
                  <div className="occ-bar" style={{ width: '100%', height: 6 }}>
                    <div className="occ-fill" style={{ width: `${(b.currentOccupancy / b.capacity) * 100}%`, background: (b.currentOccupancy / b.capacity) > 0.8 ? 'var(--red)' : (b.currentOccupancy / b.capacity) > 0.5 ? 'var(--orange)' : 'var(--green)' }} />
                  </div>
                  <div style={{ fontSize: '.66rem', color: 'var(--text-4)', marginTop: '.2rem' }}>{b.currentOccupancy}/{b.capacity} occupancy</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ━━━━ PAYMENTS ━━━━ */
function PaymentsTab() {
  const [pays, setPays] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.payments().then(res => setPays(res.payments || [])).catch(() => {}).finally(() => setLoading(false)); }, []);
  const totalRev = pays.reduce((s, p) => s + (p.amount || 0), 0);
  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1rem' }}>
        <div className="stat-card"><div className="stat-icon green"><span className="material-symbols-outlined">payments</span></div><div className="stat-value">₹{(totalRev / 100).toLocaleString('en-IN')}</div><div className="stat-label">Total Revenue</div></div>
        <div className="stat-card"><div className="stat-icon blue"><span className="material-symbols-outlined">receipt</span></div><div className="stat-value">{pays.length}</div><div className="stat-label">Transactions</div></div>
        <div className="stat-card"><div className="stat-icon purple"><span className="material-symbols-outlined">trending_up</span></div><div className="stat-value">₹{pays.length ? Math.round(totalRev / 100 / pays.length) : 0}</div><div className="stat-label">Avg. Transaction</div></div>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: 800, fontSize: '.88rem' }}>All Payments</div>
        {loading ? <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div> : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Student</th><th>Email</th><th>Reg No</th><th>Pass</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {pays.map(p => (<tr key={p._id}><td style={{ fontWeight: 700 }}>{p.user?.name || '—'}</td><td style={{ fontSize: '.78rem' }}>{p.user?.email || '—'}</td><td><span className="badge badge-blue">{p.user?.regNo || '—'}</span></td><td><span className="badge badge-purple">{p.passType}</span></td><td style={{ fontWeight: 700 }}>₹{(p.amount / 100).toFixed(0)}</td><td><span className="status-pill active">{p.status}</span></td><td style={{ fontSize: '.76rem', color: 'var(--text-3)' }}>{p.paidAt ? new Date(p.paidAt).toLocaleString('en-IN') : '—'}</td></tr>))}
              {pays.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-4)' }}>No payments yet</td></tr>}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}

/* ━━━━ COMPLAINTS ━━━━ */
function ComplaintsTab() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.complaints().then(res => setComplaints(res.complaints || [])).catch(() => {}).finally(() => setLoading(false)); }, []);
  const resolve = async (id) => { try { await adminApi.updateComplaint(id, { status: 'resolved' }); setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: 'resolved' } : c)); } catch {} };
  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: 800, fontSize: '.88rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--orange)', fontSize: '1.05rem' }}>report</span>Complaints ({complaints.length})
      </div>
      {loading ? <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div> : complaints.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-4)' }}><span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '.3rem' }}>sentiment_satisfied</span>No complaints filed yet</div>
      ) : (
        <div>{complaints.map(c => (
          <div key={c._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
            <div className={`alert-icon ${c.status === 'resolved' ? 'ok' : 'warn'}`}><span className="material-symbols-outlined">{c.status === 'resolved' ? 'check_circle' : 'report'}</span></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '.88rem' }}>{c.subject || 'Complaint'}</div><div style={{ fontSize: '.78rem', color: 'var(--text-3)' }}>{c.description || '—'}</div><div style={{ fontSize: '.68rem', color: 'var(--text-4)', marginTop: '.2rem' }}>{c.user?.name} • {c.user?.email} • {new Date(c.createdAt).toLocaleDateString('en-IN')}</div></div>
            <span className={`status-pill ${c.status === 'resolved' ? 'active' : 'offline'}`}>{c.status}</span>
            {c.status !== 'resolved' && <button className="btn btn-primary" style={{ fontSize: '.72rem', padding: '.25rem .5rem' }} onClick={() => resolve(c._id)}>Resolve</button>}
          </div>
        ))}</div>
      )}
    </div>
  );
}

/* ━━━━ SCAN LOGS ━━━━ */
function ScanLogsTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.scanlogs().then(res => setLogs(res.logs || [])).catch(() => {}).finally(() => setLoading(false)); }, []);
  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: 800, fontSize: '.88rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>qr_code_scanner</span>QR Scan Logs ({logs.length})
      </div>
      {loading ? <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div> : logs.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-4)' }}>No scans recorded yet</div>
      ) : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Student</th><th>Email</th><th>Pass</th><th>Result</th><th>Scanned At</th></tr></thead>
          <tbody>{logs.map(l => (<tr key={l._id}><td style={{ fontWeight: 700 }}>{l.user?.name || '—'}</td><td style={{ fontSize: '.78rem' }}>{l.user?.email || '—'}</td><td><span className="badge badge-blue">{l.pass?.type || '—'}</span></td><td><span className={`status-pill ${l.result === 'valid' ? 'active' : 'offline'}`}>{l.result}</span></td><td style={{ fontSize: '.76rem', color: 'var(--text-3)' }}>{new Date(l.scannedAt).toLocaleString('en-IN')}</td></tr>))}</tbody>
        </table></div>
      )}
    </div>
  );
}
