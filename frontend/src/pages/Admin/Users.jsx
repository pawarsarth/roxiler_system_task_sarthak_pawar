import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { validateEmail, validateName, validateAddress, getPasswordError } from '../../utils/validation';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'NORMAL_USER'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [search, role, sort, order]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers({ search, role, sort, order });
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || !validateName(formData.name)) {
      newErrors.name = 'Name must be 2-60 characters';
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.address || !validateAddress(formData.address)) {
      newErrors.address = 'Address must be max 400 characters';
    }

    const passwordError = getPasswordError(formData.password);
    if (passwordError) newErrors.password = passwordError;

    return newErrors;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    try {
      await adminAPI.createUser(formData);
      setShowCreateModal(false);
      setFormData({ name: '', email: '', address: '', password: '', role: 'NORMAL_USER' });
      fetchUsers();
    } catch (err) {
      setFormErrors({ submit: err.response?.data?.error || 'Failed to create user' });
    }
  };

  const handleViewUser = async (id) => {
    try {
      const response = await adminAPI.getUserById(id);
      setSelectedUser(response.data);
      setShowDetailModal(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch user');
    }
  };

  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field);
      setOrder('asc');
    }
  };

  if (loading && users.length === 0) {
    return <div className="container"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Users Management</h1>
        <button onClick={() => setShowCreateModal(true)}>Create User</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, email, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="NORMAL_USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name {sort === 'name' && (order === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('email')}>Email {sort === 'email' && (order === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('role')}>Role {sort === 'role' && (order === 'asc' ? '↑' : '↓')}</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleViewUser(user.id)}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && <p style={{ textAlign: 'center', padding: '2rem' }}>No users found</p>}

      {/* Create Modal */}
      <div className={`modal ${showCreateModal ? 'open' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Create New User</h2>
            <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
          </div>

          {formErrors.submit && <div className="alert error">{formErrors.submit}</div>}

          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleCreateChange}
                placeholder="2-60 characters"
              />
              {formErrors.name && <small style={{ color: '#e74c3c' }}>{formErrors.name}</small>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleCreateChange}
              />
              {formErrors.email && <small style={{ color: '#e74c3c' }}>{formErrors.email}</small>}
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleCreateChange}
                placeholder="Max 400 characters"
                rows="3"
              />
              {formErrors.address && <small style={{ color: '#e74c3c' }}>{formErrors.address}</small>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleCreateChange}
                placeholder="8-16 chars, 1 uppercase, 1 special char"
              />
              {formErrors.password && <small style={{ color: '#e74c3c' }}>{formErrors.password}</small>}
            </div>

            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleCreateChange}>
                <option value="ADMIN">Admin</option>
                <option value="NORMAL_USER">Normal User</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={{ flex: 1 }}>Create</button>
              <button type="button" className="secondary" onClick={() => setShowCreateModal(false)} style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Detail Modal */}
      <div className={`modal ${showDetailModal ? 'open' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>User Details</h2>
            <button className="modal-close" onClick={() => setShowDetailModal(false)}>✕</button>
          </div>

          {selectedUser && (
            <div>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Address:</strong> {selectedUser.address}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              {selectedUser.store && (
                <>
                  <p><strong>Store Name:</strong> {selectedUser.store.name}</p>
                  <p><strong>Store Rating:</strong> {selectedUser.rating || 'N/A'}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
