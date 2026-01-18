const useApi = () => {
  const baseUrl = import.meta.env.VITE_N8N_BASE_URL;

  const getApiKey = () => localStorage.getItem('gemini_api_key');

  const callApi = async (action, data = {}, file = null) => {
    const url = `${baseUrl}/gemini-api`;
    const apiKey = getApiKey();

    if (file) {
      // Multipart for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('action', action);
      formData.append('apiKey', apiKey);
      if (data.storeId) formData.append('storeId', data.storeId);

      const res = await fetch(url, { 
        method: 'POST', 
        body: formData 
      });
      return res.json();
    }

    const requestBody = { action, apiKey, ...data };
    console.log('API Request:', action, JSON.stringify(requestBody, null, 2));
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    const responseData = await res.json();
    console.log('API Response:', action, JSON.stringify(responseData, null, 2));
    return responseData;
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
