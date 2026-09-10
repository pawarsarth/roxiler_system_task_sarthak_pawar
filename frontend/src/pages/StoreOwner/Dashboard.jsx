import { useState, useEffect } from 'react';
import { storeOwnerAPI } from '../../services/api';

export default function StoreOwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await storeOwnerAPI.getDashboard();
      setDashboard(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading...</div></div>;
  }

  if (error) {
    return <div className="container"><div className="alert error">{error}</div></div>;
  }

  return (
    <div className="container">
      <h1>Store Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Store Name</h3>
          <div style={{ fontSize: '1.3rem', color: '#2c3e50' }}>{dashboard?.store?.name}</div>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <div className="number">{dashboard?.averageRating ? `${dashboard.averageRating} ⭐` : 'No ratings'}</div>
        </div>
        <div className="stat-card">
          <h3>Total Ratings</h3>
          <div className="number">{dashboard?.totalRatings || 0}</div>
        </div>
      </div>

      <div className="card">
        <h2>Store Information</h2>
        <p><strong>Email:</strong> {dashboard?.store?.email}</p>
        <p><strong>Address:</strong> {dashboard?.store?.address}</p>
      </div>

      <div className="card">
        <h2>Ratings from Users</h2>
        {dashboard?.ratings && dashboard.ratings.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.ratings.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.userName}</td>
                  <td>{r.userEmail}</td>
                  <td>{r.score} ⭐</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>No ratings yet</p>
        )}
      </div>
    </div>
  );
}
