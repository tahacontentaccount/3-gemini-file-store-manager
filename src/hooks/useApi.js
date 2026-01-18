const useApi = () => {
  const getApiUrl = () => localStorage.getItem('n8n_webhook_url');
  const getApiKey = () => localStorage.getItem('gemini_api_key');

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:...;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const callApi = async (action, data = {}, file = null) => {
    const url = getApiUrl();
    const apiKey = getApiKey();
    
    if (!url) {
      throw new Error('Webhook URL not configured');
    }

    // For file uploads, convert to base64 and send as JSON
    if (file) {
      const base64 = await fileToBase64(file);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          apiKey,
          storeId: data.storeId,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          fileData: base64
        })
      });
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
