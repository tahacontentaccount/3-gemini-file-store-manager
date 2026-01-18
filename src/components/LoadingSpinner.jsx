const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: { width: '18px', height: '18px', border: '2px' },
    md: { width: '32px', height: '32px', border: '3px' },
    lg: { width: '48px', height: '48px', border: '4px' }
  };

  const s = sizes[size];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          width: s.width,
          height: s.height,
          border: `${s.border} solid #e5e7eb`,
          borderTopColor: '#667eea',
          borderRightColor: '#764ba2',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
