const useApi = () => {
  // Get baseUrl from localStorage first, fallback to environment variable
  const getBaseUrl = () => {
    const stored = localStorage.getItem('n8n_base_url');
    if (stored) return stored;
    const envUrl = import.meta.env.VITE_N8N_BASE_URL;
    if (envUrl && envUrl !== 'undefined') return envUrl;
    return null;
  };

  const getApiKey = () => localStorage.getItem('gemini_api_key');

  const callApi = async (action, data = {}, file = null) => {
    const baseUrl = getBaseUrl();
    
    // Check if baseUrl is configured
    if (!baseUrl) {
      const error = new Error('API endpoint not configured. Please enter your n8n webhook URL in the settings.');
      console.error('Missing n8n base URL:', error);
      throw error;
    }

    const url = `${baseUrl}/gemini-api`;
    const apiKey = getApiKey();
    
    console.log('API Base URL:', baseUrl);
    console.log('Full API URL:', url);

    if (file) {
      // Multipart for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('action', action);
      formData.append('apiKey', apiKey);
      if (data.storeId) formData.append('storeId', data.storeId);

      try {
        const res = await fetch(url, { 
          method: 'POST', 
          body: formData 
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('API Error Response:', res.status, res.statusText, errorText);
          throw new Error(`API request failed: ${res.status} ${res.statusText} - ${errorText}`);
        }

        return await res.json();
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network error:', error);
          throw new Error(`Failed to connect to API. Check your network connection and CORS settings. URL: ${url}`);
        }
        throw error;
      }
    }

    const requestBody = { action, apiKey, ...data };
    console.log('API Request:', action, JSON.stringify(requestBody, null, 2));
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      // Check if response is ok
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', res.status, res.statusText, errorText);
        throw new Error(`API request failed: ${res.status} ${res.statusText} - ${errorText}`);
      }

      const responseData = await res.json();
      console.log('API Response:', action, JSON.stringify(responseData, null, 2));
      return responseData;
    } catch (error) {
      // Handle network errors, CORS errors, etc.
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network error:', error);
        throw new Error(`Failed to connect to API. Check your network connection and CORS settings. URL: ${url}`);
      }
      throw error;
    }
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
