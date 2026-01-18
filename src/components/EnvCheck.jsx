const EnvCheck = ({ children }) => {
  const baseUrl = import.meta.env.VITE_N8N_BASE_URL;

  // If baseUrl is missing or undefined, show error
  if (!baseUrl || baseUrl === 'undefined') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '600px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '2px solid #ef4444'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              background: '#fee2e2',
              borderRadius: '16px',
              marginBottom: '16px'
            }}>
              <svg style={{ width: '32px', height: '32px', color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ef4444',
              marginBottom: '12px'
            }}>
              Configuration Error
            </h1>
            <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '24px' }}>
              The API endpoint is not configured. This is a deployment configuration issue.
            </p>
          </div>

          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#991b1b',
              marginBottom: '12px'
            }}>
              For AWS Amplify Deployment:
            </h2>
            <ol style={{
              color: '#7f1d1d',
              fontSize: '14px',
              lineHeight: '1.8',
              paddingLeft: '20px',
              margin: 0
            }}>
              <li style={{ marginBottom: '8px' }}>Go to AWS Amplify Console → Your App</li>
              <li style={{ marginBottom: '8px' }}>Navigate to <strong>"Environment variables"</strong></li>
              <li style={{ marginBottom: '8px' }}>Add variable: <code style={{ background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>VITE_N8N_BASE_URL</code></li>
              <li style={{ marginBottom: '8px' }}>Set value to your n8n webhook URL (e.g., <code style={{ background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>https://tahayt.app.n8n.cloud/webhook</code>)</li>
              <li style={{ marginBottom: '8px' }}>Click <strong>"Redeploy this version"</strong> to rebuild with the new variable</li>
            </ol>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            color: '#0c4a6e'
          }}>
            <strong>Current Status:</strong> VITE_N8N_BASE_URL = {baseUrl || '(not set)'}
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default EnvCheck;

