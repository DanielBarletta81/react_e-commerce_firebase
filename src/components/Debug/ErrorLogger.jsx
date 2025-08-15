import React, { useEffect, useState } from 'react';

const ErrorLogger = () => {
  const [errors, setErrors] = useState([]);
  const [networkRequests, setNetworkRequests] = useState([]);

  useEffect(() => {
    // Log console errors
    const originalError = console.error;
    console.error = (...args) => {
      setErrors(prev => [...prev, {
        type: 'console.error',
        message: args.join(' '),
        timestamp: new Date().toLocaleTimeString()
      }]);
      originalError.apply(console, args);
    };

    // Monitor network requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0];
      const options = args[1] || {};
      
      setNetworkRequests(prev => [...prev, {
        url,
        method: options.method || 'GET',
        timestamp: new Date().toLocaleTimeString(),
        status: 'pending'
      }]);

      try {
        const response = await originalFetch.apply(window, args);
        
        setNetworkRequests(prev => 
          prev.map((req, index) => 
            index === prev.length - 1 
              ? { ...req, status: response.status, statusText: response.statusText }
              : req
          )
        );
        
        if (!response.ok) {
          setErrors(prev => [...prev, {
            type: 'network',
            message: `${response.status} ${response.statusText} - ${url}`,
            timestamp: new Date().toLocaleTimeString()
          }]);
        }
        
        return response;
      } catch (error) {
        setNetworkRequests(prev => 
          prev.map((req, index) => 
            index === prev.length - 1 
              ? { ...req, status: 'error', error: error.message }
              : req
          )
        );
        
        setErrors(prev => [...prev, {
          type: 'network_error',
          message: `Network Error: ${error.message} - ${url}`,
          timestamp: new Date().toLocaleTimeString()
        }]);
        
        throw error;
      }
    };

    // Cleanup
    return () => {
      console.error = originalError;
      window.fetch = originalFetch;
    };
  }, []);

  const clearLogs = () => {
    setErrors([]);
    setNetworkRequests([]);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      right: 0, 
      width: '400px', 
      maxHeight: '300px', 
      backgroundColor: 'white', 
      border: '1px solid #ccc',
      borderRadius: '8px',
      overflow: 'auto',
      zIndex: 1000,
      fontSize: '12px',
      padding: '10px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0 }}>Debug Console</h4>
        <button onClick={clearLogs} style={{ padding: '2px 8px', fontSize: '10px' }}>Clear</button>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Recent Errors ({errors.length}):</strong>
        {errors.slice(-5).map((error, index) => (
          <div key={index} style={{ 
            color: 'red', 
            backgroundColor: '#ffe6e6', 
            padding: '2px 4px', 
            margin: '2px 0',
            borderRadius: '2px',
            fontSize: '10px'
          }}>
            [{error.timestamp}] {error.type}: {error.message}
          </div>
        ))}
      </div>
      
      <div>
        <strong>Network Requests ({networkRequests.length}):</strong>
        {networkRequests.slice(-5).map((req, index) => (
          <div key={index} style={{ 
            color: req.status >= 400 ? 'red' : req.status >= 300 ? 'orange' : 'green',
            backgroundColor: '#f0f0f0',
            padding: '2px 4px',
            margin: '2px 0',
            borderRadius: '2px',
            fontSize: '10px'
          }}>
            [{req.timestamp}] {req.method} {req.status} - {req.url}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorLogger;
