const useApi = () => {
  const getApiUrl = () => localStorage.getItem('n8n_webhook_url');
  const getApiKey = () => localStorage.getItem('gemini_api_key');

  const callApi = async (action, data = {}, file = null) => {
    const url = getApiUrl();
    const apiKey = getApiKey();
    
    if (!url) {
      throw new Error('Webhook URL not configured');
    }

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('action', action);
      formData.append('apiKey', apiKey);
      if (data.storeId) formData.append('storeId', data.storeId);
      const res = await fetch(url, { method: 'POST', body: formData });
      return res.json();
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, apiKey, ...data })
    });
    return res.json();
  };

  return {
    listStores: () => callApi('list_stores'),
    listDocs: (storeId) => callApi('list_docs', { storeId }),
    createStore: (displayName) => callApi('create_store', { displayName }),
    uploadDoc: (storeId, file) => callApi('upload', { storeId }, file),
    deleteStore: (storeId) => callApi('delete_store', { storeId }),
    deleteDoc: (storeId, documentId) => callApi('delete_doc', { storeId, documentId }),
    chat: (storeId, message) => callApi('chat', { storeId, message })
  };
};

export default useApi;
