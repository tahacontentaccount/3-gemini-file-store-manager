const ChatMessage = ({ message, isUser, timestamp }) => {
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div 
      className="animate-fadeIn"
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '20px'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        maxWidth: '75%',
        flexDirection: isUser ? 'row-reverse' : 'row'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: isUser 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)'
        }}>
          {isUser ? (
            <svg style={{ width: '18px', height: '18px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg style={{ width: '18px', height: '18px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )}
        </div>
        <div style={{
          borderRadius: '18px',
          padding: '14px 18px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          ...(isUser 
            ? {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderBottomRightRadius: '4px'
              }
            : {
                background: 'white',
                color: '#111827',
                border: '1px solid #e5e7eb',
                borderBottomLeftRadius: '4px'
              })
        }}>
          <p style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontSize: '14px',
            lineHeight: '1.6',
            margin: 0
          }}>
            {message}
          </p>
          {timestamp && (
            <p style={{
              fontSize: '11px',
              marginTop: '8px',
              marginBottom: 0,
              color: isUser ? 'rgba(255,255,255,0.7)' : '#9ca3af'
            }}>
              {formatTime(timestamp)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
