import { useState } from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, showPasswordToggle = false, onKeyDown, style = {} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          padding: '14px 18px',
          paddingRight: showPasswordToggle ? '70px' : '18px',
          border: `2px solid ${isFocused ? '#667eea' : '#e5e7eb'}`,
          borderRadius: '14px',
          fontSize: '15px',
          outline: 'none',
          transition: 'all 0.2s ease',
          backgroundColor: '#f9fafb',
          color: '#111827',
          boxShadow: isFocused ? '0 0 0 4px rgba(102, 126, 234, 0.1)' : 'none',
          ...style
        }}
      />
      {showPasswordToggle && type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6b7280',
            fontWeight: '500',
            fontSize: '13px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      )}
    </div>
  );
};

export default Input;
