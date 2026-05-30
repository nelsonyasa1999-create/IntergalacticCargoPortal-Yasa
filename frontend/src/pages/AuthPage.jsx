import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../api/api';
import useAuth from '../hooks/useAuth';
import LayoutShell from '../components/LayoutShell';
import PasswordInput from '../components/PasswordInput';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login: saveSession, isAuthenticated } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      let session;
      if (mode === 'signup') {
        await signup(email, password);
        session = await login(email, password);
      } else {
        session = await login(email, password);
      }
      saveSession(session);
      setPassword('');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutShell>
      <div className="auth-page">
        <div className="auth-card glass-panel">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-mark__ring" />
            <span className="brand-mark__core">ICP</span>
          </div>
          <p className="eyebrow">Nebula Corp · Classified</p>
          <h1>Intergalactic Cargo Portal</h1>
          <p className="subtitle">Authenticate to access manifest systems</p>

          <div className="mode-toggle" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => setMode('signup')}
            >
              Signup
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="captain@nebula-corp.com"
              autoComplete="email"
              required
            />

            <label htmlFor="password">Password</label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />

            {error && (
              <p className="error-msg" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Authenticating…' : mode === 'login' ? 'Enter portal' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </LayoutShell>
  );
}
