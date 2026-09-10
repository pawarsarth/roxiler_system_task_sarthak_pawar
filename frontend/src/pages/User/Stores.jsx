import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchStores();
  }, [search, sort, order]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getStores({ search, sort, order });
      setStores(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (storeId, score) => {
    try {
      await userAPI.submitRating({ storeId, score });
      // Update the store in the list
      const updatedStores = stores.map(s => {
        if (s.id === storeId) {
          return { ...s, userRating: score };
        }
        return s;
      });
      setStores(updatedStores);
      setSelectedStoreId(null);
      setRating(0);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit rating');
    }
  };

  const handleOpenRating = (storeId, currentRating) => {
    setSelectedStoreId(storeId);
    setRating(currentRating || 0);
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
      <h1>Store Ratings</h1>

      {error && <div className="alert error">{error}</div>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid">
        {stores.map(store => (
          <div key={store.id} className="card">
            <h3 style={{ marginBottom: '0.5rem' }}>{store.name}</h3>
            <p style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>
              <strong>Address:</strong> {store.address}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Overall Rating:</strong> {store.overallRating ? `${store.overallRating} ⭐` : 'No ratings'}
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Your Rating:</strong> {store.userRating ? `${store.userRating} ⭐` : 'Not rated'}
            </p>

            {selectedStoreId === store.id ? (
              <div>
                <p style={{ marginBottom: '0.5rem' }}>Rate this store:</p>
                <div className="rating" style={{ marginBottom: '1rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star ${star <= rating ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleSubmitRating(store.id, rating)}
                    disabled={!rating}
                    style={{ flex: 1 }}
                  >
                    Submit
                  </button>
                  <button
                    className="secondary"
                    onClick={() => setSelectedStoreId(null)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleOpenRating(store.id, store.userRating)}
                style={{ width: '100%' }}
              >
                {store.userRating ? 'Modify Rating' : 'Submit Rating'}
              </button>
            )}
          </div>
        ))}
      </div>

      {stores.length === 0 && (
        <p style={{ textAlign: 'center', padding: '2rem' }}>No stores found</p>
      )}
    </div>
  );
}
