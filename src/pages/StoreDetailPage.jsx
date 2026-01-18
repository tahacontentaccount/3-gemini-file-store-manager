import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import UploadZone from '../components/UploadZone';
import DocumentTable from '../components/DocumentTable';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import useApi from '../hooks/useApi';

const StoreDetailPage = () => {
  const { storeId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [storeName, setStoreName] = useState('Store');
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    const apiKey = localStorage.getItem('gemini_api_key');
    const n8nUrl = localStorage.getItem('n8n_webhook_url');
    if (!apiKey || !n8nUrl) {
      navigate('/');
      return;
    }
    const decodedStoreId = decodeURIComponent(storeId);
    const storeNameFromId = decodedStoreId.split('/').pop() || decodedStoreId;
    setStoreName(storeNameFromId);
    loadDocuments();
  }, [storeId, navigate]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.listDocs(decodeURIComponent(storeId));
      if (response.success) {
        setDocuments(response.documents || []);
      } else {
        toast.error('Failed to load documents');
      }
    } catch (error) {
      toast.error('Error loading documents: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      const response = await api.uploadDoc(decodeURIComponent(storeId), selectedFile);
      if (response.success) {
        toast.success('Document uploaded successfully');
        setSelectedFile(null);
        loadDocuments();
      } else {
        toast.error('Failed to upload document');
      }
    } catch (error) {
      toast.error('Error uploading document: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await api.deleteDoc(decodeURIComponent(storeId), documentId);
      if (response.success) {
        toast.success('Document deleted successfully');
        loadDocuments();
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      toast.error('Error deleting document: ' + error.message);
    }
  };

  const handleChat = () => {
    navigate(`/stores/${encodeURIComponent(storeId)}/chat`);
  };

  const rightAction = (
    <Button onClick={handleChat}>
      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      Chat with Store
    </Button>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <Header
        title={storeName}
        showBack={true}
        backPath="/stores"
        backText="Back to Stores"
        rightAction={rightAction}
      />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <UploadZone onFileSelect={handleFileSelect} selectedFile={selectedFile} />
          
          {selectedFile && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>Documents</h2>
            </div>
            <DocumentTable
              documents={documents}
              loading={loading}
              onDelete={handleDeleteDoc}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;
