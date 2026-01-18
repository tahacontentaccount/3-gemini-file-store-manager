import { useState, useEffect, useRef } from 'react';
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
  const creatingRef = useRef(false);
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      navigate('/');
      return;
    }
    loadStores();
  }, [navigate]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await api.listStores();
      console.log('List stores response:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        // Handle different possible response formats
        const storesList = response.stores || response.fileSearchStores || [];
        console.log('Stores list:', JSON.stringify(storesList, null, 2));
        // Sort by createTime descending (newest first)
        const sortedStores = [...storesList].sort((a, b) => {
          const timeA = a.createTime ? new Date(a.createTime).getTime() : 0;
          const timeB = b.createTime ? new Date(b.createTime).getTime() : 0;
          return timeB - timeA;
        });
        setStores(sortedStores);
      } else {
        toast.error('Failed to load stores: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error loading stores:', error);
      toast.error('Error loading stores: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async () => {
    // Prevent multiple simultaneous calls
    if (creatingRef.current || creating || !storeName.trim()) {
      if (!storeName.trim()) {
        toast.error('Please enter a store name');
      }
      return;
    }

    creatingRef.current = true;
    setCreating(true);
    const nameToCreate = storeName.trim();

    try {
      const response = await api.createStore(nameToCreate);
      console.log('Create store full response:', JSON.stringify(response, null, 2));
      
      // Check if response is for create_store action
      if (response.action === 'create_store' && response.success) {
        const store = response.store;
        if (store && store.name) {
          toast.success('Store created successfully: ' + (store.displayName || nameToCreate));
          setIsModalOpen(false);
          setStoreName('');
          // Wait a moment before refreshing to allow the store to be indexed
          setTimeout(() => loadStores(), 3000);
        } else {
          const errorMsg = response.error || response.store?.error?.message || 'Store creation failed - no store data returned';
          toast.error('Failed to create store: ' + errorMsg);
          console.error('Create store error - no store data:', response);
        }
      } else {
        // Handle wrong response format (e.g., list_stores response)
        const errorMsg = response.error || 'Unexpected response format from server';
        toast.error('Failed to create store: ' + errorMsg);
        console.error('Create store error - wrong response format:', response);
      }
    } catch (error) {
      console.error('Error creating store:', error);
      toast.error('Error creating store: ' + error.message);
    } finally {
      setCreating(false);
      creatingRef.current = false;
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.deleteStore(storeId);
      if (response.success) {
        toast.success('Store deleted successfully');
        loadStores();
      } else {
        toast.error('Failed to delete store');
      }
    } catch (error) {
      toast.error('Error deleting store: ' + error.message);
    }
  };

  const handleOpenStore = (storeId) => {
    navigate(`/stores/${encodeURIComponent(storeId)}`);
  };

  const handleChangeApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    navigate('/');
  };

  const rightAction = (
    <Button variant="secondary" onClick={handleChangeApiKey}>
      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Settings
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
            <p style={{ color: '#6b7280', fontSize: '15px' }}>Manage your file search stores</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" onClick={loadStores}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Store
            </Button>
          </div>
        </div>

        {stores.length === 0 ? (
          <div 
            className="animate-slideUp"
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '80px 40px',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
              borderRadius: '20px',
              marginBottom: '24px'
            }}>
              <svg style={{ width: '40px', height: '40px', color: '#667eea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>No stores yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Create your first store to get started!</p>
            <Button onClick={() => setIsModalOpen(true)}>Create Your First Store</Button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {stores.map((store, index) => (
              <div key={store.name} style={{ animationDelay: `${index * 0.1}s` }}>
                <StoreCard
                  store={store}
                  onOpen={handleOpenStore}
                  onDelete={handleDeleteStore}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setStoreName('');
        }}
        title="Create New Store"
      >
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Store Name
            </label>
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Enter store name"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !creating && storeName.trim()) {
                  e.preventDefault();
                  handleCreateStore();
                }
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setStoreName('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateStore} disabled={creating || !storeName.trim()}>
              {creating ? 'Creating...' : 'Create Store'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoresPage;
