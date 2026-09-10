import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import { validateEmail } from '../utils/validation';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.token);
      
      // Redirect based on role
      if (response.data.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (response.data.user.role === 'NORMAL_USER') {
        navigate('/user/stores');
      } else if (response.data.user.role === 'STORE_OWNER') {
        navigate('/store-owner/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</h2>
        
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
