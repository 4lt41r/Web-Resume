import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>
        🚀 Resume Builder Test
      </h1>
      <p style={{ fontSize: '18px', color: '#333' }}>
        React is working! This is a test to verify the app is loading.
      </p>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Test Data:</h2>
        <p>✅ React rendering</p>
        <p>✅ Styles working</p>
        <p>✅ Development server active</p>
        <button 
          onClick={() => alert('Button clicked! React events are working.')}
          style={{
            background: '#2563eb',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App;
