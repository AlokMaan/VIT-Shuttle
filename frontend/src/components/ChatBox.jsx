import { useState, useRef, useEffect } from 'react';
import { complaints as complaintsApi } from '../services/api';

const CATEGORIES = [
  { value: 'driver', label: 'Driver Issue', icon: 'person' },
  { value: 'bus_condition', label: 'Bus Condition', icon: 'directions_bus' },
  { value: 'punctuality', label: 'Punctuality', icon: 'schedule' },
  { value: 'cleanliness', label: 'Cleanliness', icon: 'cleaning_services' },
  { value: 'overcrowding', label: 'Overcrowding', icon: 'groups' },
  { value: 'route', label: 'Route Issue', icon: 'route' },
  { value: 'payment', label: 'Payment Issue', icon: 'payment' },
  { value: 'other', label: 'Other', icon: 'more_horiz' },
];

const BOT_REPLIES = [
  "I'll look into that for you! 🔍",
  'Our shuttles run every 10-15 minutes on weekdays.',
  'You can buy a pass from the Portal → Buy Pass section.',
  'Route Alpha runs from Main Gate → SJT → TT Complex.',
  "If you're experiencing delays, please check the Alerts tab.",
  'For urgent issues, call the campus transport helpline: 0416-220-2020.',
  "Your monthly pass can be renewed from Settings → Subscription.",
  'The night shuttle service runs until midnight on weekdays.',
];

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('chat'); // 'chat' | 'complaint' | 'my'
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: '👋 Welcome to VIT Shuttle Support! How can I help you?', time: 'Just now' },
    { id: 2, from: 'bot', text: 'Ask about routes, schedules, or use the Complaint tab to report an issue.', time: 'Just now' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  // Complaint form
  const [cmpForm, setCmpForm] = useState({ title: '', description: '', category: 'other', priority: 'medium', shuttleId: '' });
  const [cmpMsg, setCmpMsg] = useState('');
  const [cmpLoading, setCmpLoading] = useState(false);

  // My complaints
  const [myComplaints, setMyComplaints] = useState([]);
  const [loadingMy, setLoadingMy] = useState(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { id: Date.now(), from: 'user', text, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: reply, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 600 + Math.random() * 600);
  };

  const submitComplaint = async () => {
    if (!cmpForm.title.trim() || !cmpForm.description.trim()) { setCmpMsg('❌ Title and description required.'); return; }
    setCmpLoading(true);
    setCmpMsg('');
    try {
      const res = await complaintsApi.submit(cmpForm);
      setCmpMsg(`✅ ${res.message}`);
      setCmpForm({ title: '', description: '', category: 'other', priority: 'medium', shuttleId: '' });
    } catch (err) { setCmpMsg(`❌ ${err.message}`); }
    finally { setCmpLoading(false); }
  };

  const loadMyComplaints = async () => {
    setLoadingMy(true);
    try {
      const res = await complaintsApi.myComplaints();
      setMyComplaints(res.complaints || []);
    } catch (err) { console.error(err); }
    finally { setLoadingMy(false); }
  };

  useEffect(() => { if (tab === 'my') loadMyComplaints(); }, [tab]);

  const tabBtn = (t, label, icon) => (
    <button onClick={() => setTab(t)} style={{
      flex: 1, padding: '.4rem', background: tab === t ? 'var(--primary-bg)' : 'transparent',
      border: 'none', cursor: 'pointer', color: tab === t ? 'var(--primary)' : 'var(--text-3)',
      fontWeight: tab === t ? 700 : 500, fontSize: '.7rem', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '.2rem', borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: '.85rem' }}>{icon}</span>
      {label}
    </button>
  );

  return (
    <>
      {open && (
        <div className="chatbox">
          <div className="chat-header">
            <div className="chat-header-avatar"><span className="material-symbols-outlined">support_agent</span></div>
            <div className="chat-header-info"><h4>Shuttle Support</h4><p>Chat • Complaints • Track</p></div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            {tabBtn('chat', 'Chat', 'chat')}
            {tabBtn('complaint', 'Complaint', 'report_problem')}
            {tabBtn('my', 'My Issues', 'history')}
          </div>

          {/* ── CHAT TAB ── */}
          {tab === 'chat' && (
            <>
              <div className="chat-messages">
                {messages.map(msg => (
                  <div key={msg.id} className={`chat-msg ${msg.from}`}>
                    {msg.text}
                    <div className="chat-msg-time">{msg.time}</div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              <div className="chat-input-area">
                <input className="chat-input" placeholder="Type a message…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                <button className="chat-send" onClick={sendMessage}><span className="material-symbols-outlined">send</span></button>
              </div>
            </>
          )}

          {/* ── COMPLAINT TAB ── */}
          {tab === 'complaint' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '.85rem' }}>
              <div style={{ fontSize: '.78rem', fontWeight: 700, marginBottom: '.5rem', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '.95rem', color: 'var(--primary)' }}>report_problem</span>
                Submit a Complaint
              </div>

              <div style={{ marginBottom: '.5rem' }}>
                <label style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: '.2rem' }}>Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.3rem' }}>
                  {CATEGORIES.map(c => (
                    <button key={c.value} onClick={() => setCmpForm(f => ({ ...f, category: c.value }))} style={{
                      padding: '.3rem .15rem', borderRadius: 6, border: '1px solid', cursor: 'pointer',
                      borderColor: cmpForm.category === c.value ? 'var(--primary)' : 'var(--border)',
                      background: cmpForm.category === c.value ? 'var(--primary-bg)' : 'var(--surface-2)',
                      color: cmpForm.category === c.value ? 'var(--primary)' : 'var(--text-3)',
                      fontSize: '.56rem', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.1rem',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '.8rem' }}>{c.icon}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '.4rem' }}>
                <label style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: '.2rem' }}>Title</label>
                <input value={cmpForm.title} onChange={e => setCmpForm(f => ({ ...f, title: e.target.value }))} placeholder="Brief summary…" style={{ width: '100%', padding: '.4rem .55rem', borderRadius: 6, border: '1.5px solid var(--border)', background: 'var(--surface-2)', fontSize: '.78rem', color: 'var(--text)', outline: 'none' }} />
              </div>

              <div style={{ marginBottom: '.4rem' }}>
                <label style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: '.2rem' }}>Description</label>
                <textarea value={cmpForm.description} onChange={e => setCmpForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the issue in detail…" rows={3} style={{ width: '100%', padding: '.4rem .55rem', borderRadius: 6, border: '1.5px solid var(--border)', background: 'var(--surface-2)', fontSize: '.78rem', color: 'var(--text)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>

              <div style={{ display: 'flex', gap: '.4rem', marginBottom: '.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: '.2rem' }}>Priority</label>
                  <select value={cmpForm.priority} onChange={e => setCmpForm(f => ({ ...f, priority: e.target.value }))} style={{ width: '100%', padding: '.35rem .45rem', borderRadius: 6, border: '1.5px solid var(--border)', background: 'var(--surface-2)', fontSize: '.74rem', color: 'var(--text)', outline: 'none' }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: '.2rem' }}>Bus ID (optional)</label>
                  <input value={cmpForm.shuttleId} onChange={e => setCmpForm(f => ({ ...f, shuttleId: e.target.value }))} placeholder="VIT-001" style={{ width: '100%', padding: '.35rem .45rem', borderRadius: 6, border: '1.5px solid var(--border)', background: 'var(--surface-2)', fontSize: '.74rem', color: 'var(--text)', outline: 'none' }} />
                </div>
              </div>

              {cmpMsg && <div style={{ fontSize: '.74rem', marginBottom: '.4rem', color: cmpMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)' }}>{cmpMsg}</div>}

              <button onClick={submitComplaint} disabled={cmpLoading} style={{
                width: '100%', padding: '.5rem', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: 'var(--grad-primary)', color: '#fff', fontWeight: 700, fontSize: '.8rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.3rem',
                opacity: cmpLoading ? .6 : 1,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{cmpLoading ? 'progress_activity' : 'send'}</span>
                {cmpLoading ? 'Submitting…' : 'Submit Complaint'}
              </button>
            </div>
          )}

          {/* ── MY COMPLAINTS TAB ── */}
          {tab === 'my' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '.85rem' }}>
              <div style={{ fontSize: '.78rem', fontWeight: 700, marginBottom: '.5rem', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '.95rem', color: 'var(--primary)' }}>history</span>
                My Complaints ({myComplaints.length})
              </div>
              {loadingMy ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-4)', fontSize: '.78rem' }}>Loading…</div>
              ) : myComplaints.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-4)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '.3rem' }}>inbox</span>
                  <div style={{ fontSize: '.78rem' }}>No complaints yet</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                  {myComplaints.map(c => {
                    const statusColor = { pending: 'var(--orange)', in_review: 'var(--primary)', resolved: 'var(--green)', rejected: 'var(--red)' };
                    return (
                      <div key={c._id} style={{ padding: '.55rem .65rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.2rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '.78rem' }}>{c.title}</div>
                          <span style={{ fontSize: '.58rem', fontWeight: 700, padding: '.1rem .35rem', borderRadius: 4, color: statusColor[c.status] || 'var(--text-3)', background: `${statusColor[c.status] || 'var(--text-3)'}15` }}>
                            {c.status?.toUpperCase().replace('_', ' ')}
                          </span>
                        </div>
                        <div style={{ fontSize: '.66rem', color: 'var(--text-3)', lineHeight: 1.4 }}>{c.description?.slice(0, 80)}{c.description?.length > 80 ? '…' : ''}</div>
                        <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center', marginTop: '.25rem' }}>
                          <span style={{ fontSize: '.58rem', color: 'var(--text-4)', fontFamily: 'monospace' }}>{c.trackingId}</span>
                          <span style={{ fontSize: '.55rem', color: 'var(--text-4)' }}>•</span>
                          <span style={{ fontSize: '.58rem', color: 'var(--text-4)' }}>{c.category}</span>
                          <span style={{ fontSize: '.55rem', color: 'var(--text-4)' }}>•</span>
                          <span style={{ fontSize: '.58rem', color: 'var(--text-4)' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <button className={`chat-fab${open ? ' open' : ''}`} onClick={() => setOpen(!open)} title="Support & Complaints">
        <span className="material-symbols-outlined chat-icon">chat</span>
        <span className="material-symbols-outlined close-icon">close</span>
      </button>
    </>
  );
}
