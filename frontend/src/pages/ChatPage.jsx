import { useState, useRef, useEffect } from 'react';

const CONTACTS = [
  { id: 1, name: 'Campus Transport Office', avatar: 'support_agent', online: true, lastMsg: 'We will update the route shortly.', time: '10:24 AM', unread: 2 },
  { id: 2, name: 'Driver — Rajesh K.', avatar: 'person', online: true, lastMsg: 'Bus will reach SJT in 5 min.', time: '10:18 AM', unread: 0 },
  { id: 3, name: 'Admin — Dr. Sharma', avatar: 'admin_panel_settings', online: false, lastMsg: 'Pass renewal approved.', time: 'Yesterday', unread: 0 },
  { id: 4, name: 'Route Alpha Group', avatar: 'group', online: true, lastMsg: 'Any delays today?', time: '09:45 AM', unread: 5 },
  { id: 5, name: 'Maintenance Team', avatar: 'engineering', online: false, lastMsg: 'VIT-012 brake pads replaced.', time: 'Apr 8', unread: 0 },
];

const CHAT_MESSAGES = {
  1: [
    { from: 'them', text: 'Good morning! How can we help you today?', time: '10:20 AM' },
    { from: 'me', text: 'Hi, when will Route Alpha resume normal service?', time: '10:21 AM' },
    { from: 'them', text: 'Route Alpha will resume at 11:00 AM. Traffic is clearing up.', time: '10:22 AM' },
    { from: 'them', text: 'We will update the route shortly.', time: '10:24 AM' },
  ],
  2: [
    { from: 'them', text: 'Starting from Main Gate now.', time: '10:15 AM' },
    { from: 'me', text: 'Can you pick up from SJT?', time: '10:16 AM' },
    { from: 'them', text: 'Bus will reach SJT in 5 min.', time: '10:18 AM' },
  ],
  3: [
    { from: 'me', text: 'Good afternoon sir, can my pass be renewed?', time: 'Yesterday' },
    { from: 'them', text: 'Pass renewal approved.', time: 'Yesterday' },
  ],
  4: [
    { from: 'them', text: 'Morning everyone! 🚌', time: '09:30 AM' },
    { from: 'them', text: 'Any delays today?', time: '09:45 AM' },
  ],
  5: [
    { from: 'them', text: 'VIT-012 brake pads replaced.', time: 'Apr 8' },
  ],
};

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);

  const sendMessage = () => {
    if (!msg.trim()) return;
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), { from: 'me', text: msg.trim(), time }]
    }));
    setMsg('');
  };

  const contact = CONTACTS.find(c => c.id === activeChat);
  const chatMsgs = messages[activeChat] || [];

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-tag"><span className="material-symbols-outlined">chat</span> Messaging</div>
        <h1>Chat</h1>
        <p>Message transport staff, drivers, and admin</p>
      </div>

      <div className="card" style={{ padding: 0, display: 'grid', gridTemplateColumns: '300px 1fr', height: '520px', overflow: 'hidden' }}>
        {/* Contact List */}
        <div style={{ borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
          <div style={{ padding: '.85rem 1rem', borderBottom: '1px solid var(--border)', fontWeight: 800, fontSize: '.88rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--primary)' }}>forum</span>
            Conversations
          </div>
          {CONTACTS.map(c => (
            <div
              key={c.id}
              onClick={() => setActiveChat(c.id)}
              style={{
                padding: '.75rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '.65rem',
                borderBottom: '1px solid var(--border)',
                background: activeChat === c.id ? 'var(--primary-bg)' : 'transparent',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: activeChat === c.id ? 'var(--primary)' : 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: activeChat === c.id ? '#fff' : 'var(--text-3)' }}>{c.avatar}</span>
                {c.online && <span style={{ position: 'absolute', bottom: 1, right: 1, width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', border: '1.5px solid var(--surface)' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '.82rem', color: 'var(--text)' }}>{c.name}</div>
                <div style={{ fontSize: '.72rem', color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMsg}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '.62rem', color: 'var(--text-4)' }}>{c.time}</div>
                {c.unread > 0 && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, borderRadius: 9, background: 'var(--primary)', color: '#fff', fontSize: '.6rem', fontWeight: 800, padding: '0 4px', marginTop: 3 }}>
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Panel */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '.55rem', background: 'var(--surface-2)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#fff' }}>{contact?.avatar}</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '.85rem' }}>{contact?.name}</div>
              <div style={{ fontSize: '.68rem', color: contact?.online ? 'var(--green)' : 'var(--text-4)' }}>
                {contact?.online ? '● Online' : '○ Offline'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '.5rem', background: 'var(--bg)' }}>
            {chatMsgs.map((m, i) => (
              <div key={i} style={{
                maxWidth: '75%',
                padding: '.55rem .8rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '.82rem',
                lineHeight: 1.5,
                alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
                background: m.from === 'me' ? 'var(--primary)' : 'var(--surface)',
                color: m.from === 'me' ? '#fff' : 'var(--text)',
                borderBottomRightRadius: m.from === 'me' ? '4px' : 'var(--radius-md)',
                borderBottomLeftRadius: m.from === 'me' ? 'var(--radius-md)' : '4px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                {m.text}
                <div style={{ fontSize: '.6rem', opacity: .7, textAlign: 'right', marginTop: '.15rem' }}>{m.time}</div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.65rem 1rem', borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            <input
              className="chat-input"
              placeholder="Type a message…"
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              style={{ flex: 1 }}
            />
            <button className="chat-send" onClick={sendMessage}>
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
