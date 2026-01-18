const Button = ({ children, variant = 'primary', onClick, disabled, className = '', type = 'button', style = {} }) => {
  const baseStyle = {
    padding: '14px 28px',
    borderRadius: '14px',
    fontWeight: '600',
    fontSize: '15px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
    ...style
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
    },
    secondary: {
      background: 'white',
      color: '#374151',
      border: '2px solid #e5e7eb',
      boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{ ...baseStyle, ...variants[variant] }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 8px 20px 0 rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.1)';
      }}
    >
      {children}
    </button>
  );
};

export default Button;
