import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import EnvCheck from './components/EnvCheck';
import ApiKeyPage from './pages/ApiKeyPage';
import StoresPage from './pages/StoresPage';
import StoreDetailPage from './pages/StoreDetailPage';
import ChatPage from './pages/ChatPage';

const ProtectedRoute = ({ children }) => {
  const apiKey = localStorage.getItem('gemini_api_key');
  return apiKey ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <EnvCheck>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
        <Route path="/" element={<ApiKeyPage />} />
        <Route
          path="/stores"
          element={
            <ProtectedRoute>
              <StoresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores/:storeId"
          element={
            <ProtectedRoute>
              <StoreDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores/:storeId/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      </BrowserRouter>
    </EnvCheck>
  );
}

export default App;
