import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navigation() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav>
      <div className="container">
        <div>
          <Link to="/" style={{ marginRight: 'auto', fontSize: '1.3rem', fontWeight: 'bold' }}>
            RatingApp
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {user?.role === 'ADMIN' && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/stores">Stores</Link>
            </>
          )}
          {user?.role === 'NORMAL_USER' && (
            <>
              <Link to="/user/stores">Stores</Link>
            </>
          )}
          {user?.role === 'STORE_OWNER' && (
            <>
              <Link to="/store-owner/dashboard">Dashboard</Link>
            </>
          )}
          <span>{user?.name}</span>
          <button className="secondary" onClick={handleLogout} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
