import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import { validateEmail, validateName, validateAddress, getPasswordError } from '../utils/validation';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name must be 2-60 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    } else if (!validateAddress(formData.address)) {
      newErrors.address = 'Address must be max 400 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordError = getPasswordError(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        password: formData.password
      });
      
      login(response.data.user, response.data.token);
      navigate('/user/stores');
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Signup failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign Up</h2>
        
        {errors.submit && <div className="alert error">{errors.submit}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="2-60 characters"
            />
            {errors.name && <small style={{ color: '#e74c3c' }}>{errors.name}</small>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <small style={{ color: '#e74c3c' }}>{errors.email}</small>}
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
              placeholder="Max 400 characters"
              rows="3"
            />
            {errors.address && <small style={{ color: '#e74c3c' }}>{errors.address}</small>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="8-16 chars, 1 uppercase, 1 special char"
            />
            {errors.password && <small style={{ color: '#e74c3c' }}>{errors.password}</small>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.confirmPassword && <small style={{ color: '#e74c3c' }}>{errors.confirmPassword}</small>}
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
