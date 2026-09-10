import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { validateEmail, validateAddress } from '../../utils/validation';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchStores();
  }, [search, sort, order]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStores({ search, sort, order });
      setStores(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch stores');
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

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'Store name is required';
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.address || !validateAddress(formData.address)) {
      newErrors.address = 'Address must be max 400 characters';
    }

    if (!formData.ownerId) {
      newErrors.ownerId = 'Owner ID is required';
    }

    return newErrors;
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    try {
      await adminAPI.createStore(formData);
      setShowCreateModal(false);
      setFormData({ name: '', email: '', address: '', ownerId: '' });
      fetchStores();
    } catch (err) {
      setFormErrors({ submit: err.response?.data?.error || 'Failed to create store' });
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

  if (loading && stores.length === 0) {
    return <div className="container"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Stores Management</h1>
        <button onClick={() => setShowCreateModal(true)}>Create Store</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, email, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name {sort === 'name' && (order === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('email')}>Email {sort === 'email' && (order === 'asc' ? '↑' : '↓')}</th>
            <th>Address</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.email}</td>
              <td>{store.address}</td>
              <td>{store.rating ? `${store.rating} ⭐` : 'No ratings'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {stores.length === 0 && <p style={{ textAlign: 'center', padding: '2rem' }}>No stores found</p>}

      {/* Create Modal */}
      <div className={`modal ${showCreateModal ? 'open' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Create New Store</h2>
            <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
          </div>

          {formErrors.submit && <div className="alert error">{formErrors.submit}</div>}

          <form onSubmit={handleCreateStore}>
            <div className="form-group">
              <label>Store Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleCreateChange}
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
              <label>Owner ID</label>
              <input
                type="text"
                name="ownerId"
                value={formData.ownerId}
                onChange={handleCreateChange}
                placeholder="Enter STORE_OWNER user ID"
              />
              {formErrors.ownerId && <small style={{ color: '#e74c3c' }}>{formErrors.ownerId}</small>}
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
    </div>
  );
}
