const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const useApi = () => {
  const getApiKey = () => localStorage.getItem('gemini_api_key');

  const headers = () => ({
    'x-goog-api-key': getApiKey(),
    'Content-Type': 'application/json'
  });

  // List all file search stores
  const listStores = async () => {
    const res = await fetch(`${GEMINI_BASE}/fileSearchStores`, {
      headers: { 'x-goog-api-key': getApiKey() }
    });
    const data = await res.json();
    if (data.error) {
      return { success: false, error: data.error.message };
    }
    return { success: true, stores: data.fileSearchStores || [] };
  };

  // Create a new store
  const createStore = async (displayName) => {
    const res = await fetch(`${GEMINI_BASE}/fileSearchStores`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ displayName })
    });
    const data = await res.json();
    if (data.error) {
      return { success: false, error: data.error.message };
    }
    return { success: true, store: data };
  };

  // Delete a store
  const deleteStore = async (storeId) => {
    const res = await fetch(`${GEMINI_BASE}/${storeId}?force=true`, {
      method: 'DELETE',
      headers: { 'x-goog-api-key': getApiKey() }
    });
    if (res.status === 200 || res.status === 204) {
      return { success: true };
    }
    const data = await res.json();
    return { success: false, error: data.error?.message || 'Delete failed' };
  };

  // List documents in a store
  const listDocs = async (storeId) => {
    const res = await fetch(`${GEMINI_BASE}/${storeId}/documents`, {
      headers: { 'x-goog-api-key': getApiKey() }
    });
    const data = await res.json();
    if (data.error) {
      return { success: false, error: data.error.message };
    }
    return { success: true, documents: data.documents || [] };
  };

  // Delete a document
  const deleteDoc = async (storeId, documentId) => {
    const res = await fetch(`${GEMINI_BASE}/${storeId}/documents/${documentId}?force=true`, {
      method: 'DELETE',
      headers: { 'x-goog-api-key': getApiKey() }
    });
    if (res.status === 200 || res.status === 204) {
      return { success: true };
    }
    const data = await res.json();
    return { success: false, error: data.error?.message || 'Delete failed' };
  };

  // Upload a document to a store
  const uploadDoc = async (storeId, file) => {
    const formData = new FormData();
    formData.append('metadata', JSON.stringify({ displayName: file.name }));
    formData.append('file', file);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/upload/v1beta/${storeId}:uploadToFileSearchStore`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': getApiKey(),
          'X-Goog-Upload-Protocol': 'multipart'
        },
        body: formData
      }
    );
    const data = await res.json();
    if (data.error) {
      return { success: false, error: data.error.message };
    }
    return { success: true, document: data };
  };

  // Chat with documents in a store
  const chat = async (storeId, message) => {
    const res = await fetch(`${GEMINI_BASE}/models/gemini-2.0-flash:generateContent`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: message }] }],
        tools: [{
          fileSearch: {
            fileSearchStoreNames: [`fileSearchStores/${storeId}`],
            topK: 5
          }
        }]
      })
    });
    const data = await res.json();
    if (data.error) {
      return { success: false, error: data.error.message };
    }
    const answer = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || 'No response';
    return { success: true, answer };
  };

  return { listStores, createStore, deleteStore, listDocs, deleteDoc, uploadDoc, chat };
};

export default useApi;
