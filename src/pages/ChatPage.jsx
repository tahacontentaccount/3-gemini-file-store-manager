import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import useApi from '../hooks/useApi';

const ChatPage = () => {
  const { storeId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      navigate('/');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    const newUserMessage = {
      text: userMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await api.chat(decodeURIComponent(storeId), userMessage);
      if (response.success) {
        const aiMessage = {
          text: response.answer || 'No response received',
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        toast.error('Failed to get response');
        const errorMessage = {
          text: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      <Header
        title={`Chat: ${decodeURIComponent(storeId).split('/').pop() || 'Store'}`}
        showBack={true}
        backPath={`/stores/${encodeURIComponent(storeId)}`}
        backText="Back to Store"
      />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '24px'
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '20px',
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e5e7eb',
          minHeight: '400px'
        }}>
          {messages.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              padding: '40px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <svg style={{ width: '40px', height: '40px', color: '#667eea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Start a conversation</h3>
              <p style={{ color: '#6b7280' }}>Ask a question about your documents</p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.text}
                  isUser={msg.isUser}
                  timestamp={msg.timestamp}
                />
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '18px',
                    borderBottomLeftRadius: '4px',
                    padding: '14px 18px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                  }}>
                    <LoadingSpinner size="sm" />
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        <div style={{
          display: 'flex',
          gap: '12px',
          background: 'white',
          borderRadius: '20px',
          padding: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e5e7eb'
        }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your message..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px 18px',
              border: `2px solid ${isFocused ? '#667eea' : '#e5e7eb'}`,
              borderRadius: '14px',
              fontSize: '15px',
              outline: 'none',
              transition: 'all 0.2s ease',
              backgroundColor: '#f9fafb',
              color: '#111827',
              boxShadow: isFocused ? '0 0 0 4px rgba(102, 126, 234, 0.1)' : 'none'
            }}
          />
          <Button onClick={handleSend} disabled={loading || !inputMessage.trim()}>
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
