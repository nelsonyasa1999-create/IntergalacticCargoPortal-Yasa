import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCargo } from '../api/api';
import useAuth from '../hooks/useAuth';
import AdminUpload from '../components/AdminUpload';
import CargoTable from '../components/CargoTable';
import LayoutShell from '../components/LayoutShell';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [cargo, setCargo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const loadCargo = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const data = await fetchCargo(token);
      setCargo(data.cargo);
    } catch (err) {
      if (err.status === 401) {
        setError('Session expired. Redirecting to login…');
        return;
      }
      setError(err.message || 'Failed to load cargo.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Data fetch effect: loadCargo owns loading/error state for initial load and upload refreshes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCargo();
  }, [loadCargo]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <LayoutShell>
      <div className="dashboard-page">
        <header className="dashboard-header glass-panel">
          <div>
            <p className="eyebrow">Mission control</p>
            <h1>Cargo Dashboard</h1>
            <p className="user-line">
              <span className="user-email">{user?.email}</span>
              <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
            </p>
          </div>
          <button type="button" className="btn-ghost" onClick={() => setShowLogoutConfirm(true)}>
            Logout
          </button>
        </header>

        {isAdmin && <AdminUpload token={token} onUploaded={loadCargo} />}

        <section className="cargo-section glass-panel">
          <div className="section-head">
            <h2>Cargo manifest</h2>
          </div>
          {loading && <LoadingSpinner label="Scanning cargo records…" />}
          {error && (
            <p className="error-msg" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && <CargoTable cargo={cargo} role={user?.role} />}
        </section>

        {showLogoutConfirm && (
          <div className="modal-backdrop" role="presentation">
            <div
              className="confirm-modal glass-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-confirm-title"
            >
              <h2 id="logout-confirm-title">Logout?</h2>
              <p>Are you sure you want to end this session?</p>
              <div className="confirm-actions">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutShell>
  );
}
