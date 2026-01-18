import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import StoreCard from '../components/StoreCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import useApi from '../hooks/useApi';

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      navigate('/');
      return;
    }
    loadStores();
  }, []);

  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await api.listStores();
      if (response.success) {
        setStores(response.stores || []);
      } else {
        toast.error(response.error || 'Failed to load stores');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleCreateStore = async () => {
    if (creating || !storeName.trim()) return;
    setCreating(true);
    try {
      const response = await api.createStore(storeName.trim());
      if (response.success && response.store) {
        toast.success('Store created!');
        // Optimistically add the new store to state (API has propagation delay)
        setStores(prev => [response.store, ...prev]);
        setIsModalOpen(false);
        setStoreName('');
      } else {
        toast.error(response.error || 'Failed to create store');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
    setCreating(false);
  };

  const handleDeleteStore = async (storeId) => {
    if (!confirm('Delete this store?')) return;
    try {
      const response = await api.deleteStore(storeId);
      if (response.success) {
        toast.success('Store deleted');
        loadStores();
      } else {
        toast.error(response.error || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gemini_api_key');
    navigate('/');
  };

  const rightAction = (
    <Button variant="secondary" onClick={handleLogout}>
      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout
    </Button>
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <Header title="Gemini File Store Manager" rightAction={rightAction} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0' }}>
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <Header title="Gemini File Store Manager" rightAction={rightAction} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Your Stores</h2>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>{stores.length} store{stores.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" onClick={loadStores}>Refresh</Button>
            <Button onClick={() => setIsModalOpen(true)}>+ New Store</Button>
          </div>
        </div>

        {stores.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '80px 40px',
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>No stores yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Create your first store to get started</p>
            <Button onClick={() => setIsModalOpen(true)}>Create Store</Button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {stores.map((store) => (
              <StoreCard
                key={store.name}
                store={store}
                onOpen={(id) => navigate(`/stores/${encodeURIComponent(id)}`)}
                onDelete={handleDeleteStore}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setStoreName(''); }}
        title="Create New Store"
      >
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Store Name
            </label>
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Enter store name"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateStore()}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setStoreName(''); }}>Cancel</Button>
            <Button onClick={handleCreateStore} disabled={creating || !storeName.trim()}>
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoresPage;
