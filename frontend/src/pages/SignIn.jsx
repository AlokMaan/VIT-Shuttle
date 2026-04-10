import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import { setAuth } from '../utils/auth';

export default function SignIn() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('select'); // 'select' | 'student' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleStudentMode = () => { setMode('student'); setEmail(''); setPassword(''); setError(''); };
  const handleAdminMode = () => { setMode('admin'); setEmail('admin@vit.ac.in'); setPassword(''); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) { setError('Please fill in all fields'); return; }

    // Student email check
    if (mode === 'student' && !email.endsWith('@vitstudent.ac.in')) {
      setError('Only @vitstudent.ac.in emails are allowed for students');
      return;
    }

    setLoading(true);
    try {
      const data = await auth.login(email, password);
      setAuth({
        token: data.token,
        name: data.user?.name || email.split('@')[0],
        email: data.user?.email || email,
        role: data.user?.role || 'student',
        userId: data.user?.id,
        regNo: data.user?.regNo,
        phone: data.user?.phone,
        department: data.user?.department,
        hostel: data.user?.hostel,
      });
      // Admin goes to admin portal, student to portal
      navigate(data.user?.role === 'admin' ? '/admin' : '/portal');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="nav-brand-icon">
            <span className="material-symbols-outlined">directions_bus</span>
          </div>
          <div className="nav-brand-text">
            <span className="nav-brand-name" style={{ fontSize: '1.15rem' }}>VIT Shuttle</span>
            <span className="nav-brand-sub">Campus Transit System</span>
          </div>
        </div>

        {/* ━━━ MODE SELECT ━━━ */}
        {mode === 'select' && (
          <>
            <div className="auth-title">Welcome to VIT Shuttle</div>
            <div className="auth-subtitle">Choose how you'd like to sign in</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {/* Student sign in with email */}
              <button className="auth-btn" type="button" onClick={handleStudentMode}
                style={{ background: 'var(--grad-primary)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.15rem' }}>mail</span>
                Sign in with Student Email
              </button>

              <div className="auth-divider"><span>or</span></div>

              {/* Admin sign in */}
              <button className="auth-btn" type="button" onClick={handleAdminMode}
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.15rem', color: 'var(--red)' }}>admin_panel_settings</span>
                Sign in as Admin
              </button>
            </div>

            <div className="auth-footer" style={{ marginTop: '2rem' }}>
              New student? <Link to="/signup">Create an account</Link>
            </div>
          </>
        )}

        {/* ━━━ STUDENT FORM ━━━ */}
        {mode === 'student' && (
          <>
            <button onClick={() => setMode('select')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.3rem', color: 'var(--text-3)', fontSize: '.82rem', marginBottom: '1rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span> Back
            </button>
            <div className="auth-title">Student Sign In</div>
            <div className="auth-subtitle">Use your @vitstudent.ac.in email</div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Student Email</label>
                <div className="auth-input-group">
                  <div className="auth-input-icon"><span className="material-symbols-outlined">school</span></div>
                  <input type="email" placeholder="yourname@vitstudent.ac.in" value={email}
                    onChange={e => setEmail(e.target.value)} autoComplete="email" />
                </div>
                <div style={{ fontSize: '.68rem', color: 'var(--text-4)', marginTop: '.2rem' }}>Only @vitstudent.ac.in emails accepted</div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="auth-input-group">
                  <div className="auth-input-icon"><span className="material-symbols-outlined">lock</span></div>
                  <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password}
                    onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                  <button type="button" style={{ background: 'none', border: 'none', padding: '0 .75rem', cursor: 'pointer', color: 'var(--text-4)' }} onClick={() => setShowPw(!showPw)}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{showPw ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              {error && <div className="form-error" style={{ marginBottom: '.75rem', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '.9rem' }}>error</span>{error}
              </div>}
              <button className="auth-btn" type="submit" disabled={loading}>
                {loading
                  ? <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite', fontSize: '1rem' }}>progress_activity</span>
                  : <>Sign In <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span></>}
              </button>
            </form>
            <div className="auth-footer">
              Don't have an account? <Link to="/signup">Create one</Link>
            </div>
          </>
        )}

        {/* ━━━ ADMIN FORM ━━━ */}
        {mode === 'admin' && (
          <>
            <button onClick={() => setMode('select')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.3rem', color: 'var(--text-3)', fontSize: '.82rem', marginBottom: '1rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span> Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', justifyContent: 'center', marginBottom: '.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.3rem', color: 'var(--red)' }}>admin_panel_settings</span>
              <span style={{ fontWeight: 800, fontSize: '1.3rem' }}>Admin Access</span>
            </div>
            <div className="auth-subtitle">Enter admin credentials</div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Admin Email</label>
                <div className="auth-input-group">
                  <div className="auth-input-icon"><span className="material-symbols-outlined">admin_panel_settings</span></div>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    autoComplete="email" style={{ color: 'var(--text-3)' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Admin Password</label>
                <div className="auth-input-group">
                  <div className="auth-input-icon"><span className="material-symbols-outlined">lock</span></div>
                  <input type={showPw ? 'text' : 'password'} placeholder="Enter admin password" value={password}
                    onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                  <button type="button" style={{ background: 'none', border: 'none', padding: '0 .75rem', cursor: 'pointer', color: 'var(--text-4)' }} onClick={() => setShowPw(!showPw)}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{showPw ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              {error && <div className="form-error" style={{ marginBottom: '.75rem', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '.9rem' }}>error</span>{error}
              </div>}
              <button className="auth-btn" type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #dc2626, #7c3aed)' }}>
                {loading
                  ? <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite', fontSize: '1rem' }}>progress_activity</span>
                  : <>Access Admin Panel <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>shield</span></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
