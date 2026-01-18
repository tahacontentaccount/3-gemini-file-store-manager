import { useState, useRef } from 'react';

const UploadZone = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>Upload Document</h2>
      </div>
      <div
        style={{
          border: `3px dashed ${isDragging ? '#667eea' : '#d1d5db'}`,
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: isDragging ? 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)' : '#fafafa',
          transform: isDragging ? 'scale(1.01)' : 'scale(1)'
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileInput}
          accept=".pdf,.txt,.md,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.csv,.json,.xml,.html,.png,.jpg,.jpeg"
        />
        <div style={{
          width: '72px',
          height: '72px',
          background: isDragging ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e5e7eb',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          transition: 'all 0.3s ease'
        }}>
          <svg style={{ width: '36px', height: '36px', color: isDragging ? 'white' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
          {isDragging ? 'Drop your file here' : 'Drag & drop a file here'}
        </p>
        <p style={{ color: '#9ca3af', marginBottom: '16px' }}>or</p>
        <p style={{ color: '#667eea', fontWeight: '600' }}>Click to browse</p>
        
        {selectedFile && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
            borderRadius: '12px',
            border: '2px solid #667eea',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <svg style={{ width: '24px', height: '24px', color: '#667eea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{selectedFile.name}</p>
              <p style={{ fontSize: '12px', color: '#667eea' }}>{(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        )}
        
        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '24px' }}>
          Supported: PDF, TXT, MD, DOCX, PPTX, XLSX, CSV, JSON, XML, HTML, PNG, JPG
        </p>
      </div>
    </div>
  );
};

export default UploadZone;
