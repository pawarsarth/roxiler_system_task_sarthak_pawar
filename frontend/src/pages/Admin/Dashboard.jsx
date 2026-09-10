import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
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
      <h1>Admin Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="number">{dashboard?.totalUsers || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Stores</h3>
          <div className="number">{dashboard?.totalStores || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Ratings</h3>
          <div className="number">{dashboard?.totalRatings || 0}</div>
        </div>
      </div>
    </div>
  );
}
