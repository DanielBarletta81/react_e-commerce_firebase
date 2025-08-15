import React, { useState } from 'react';
import { getAllProducts } from '../../services/productService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const ProductDebug = () => {
  const [debugInfo, setDebugInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const testDirectFirestore = async () => {
    setLoading(true);
    setDebugInfo('🔍 Testing direct Firestore access...\n\n');
    
    try {
      // Test 1: Direct Firestore query
      console.log('Testing direct Firestore connection...');
      const querySnapshot = await getDocs(collection(db, 'products'));
      
      let info = `✅ Direct Firestore Connection: SUCCESS\n`;
      info += `📊 Total documents found: ${querySnapshot.size}\n\n`;
      
      if (querySnapshot.size === 0) {
        info += `⚠️  NO PRODUCTS FOUND IN FIRESTORE!\n`;
        info += `This means your database is empty. You need to add sample data.\n\n`;
        info += `🚀 Solutions:\n`;
        info += `1. Visit /test page and click "Add ALL Sample Data"\n`;
        info += `2. Or run: npm run seed (if you have admin setup)\n\n`;
      } else {
        info += `📋 Products found:\n`;
        querySnapshot.forEach((doc, index) => {
          const data = doc.data();
          info += `${index + 1}. ID: ${doc.id}\n`;
          info += `   Title: ${data.title || 'No title'}\n`;
          info += `   Price: $${data.price || 'No price'}\n`;
          info += `   Category: ${data.category || 'No category'}\n\n`;
        });
      }
      
      setDebugInfo(info);
      
    } catch (error) {
      let errorInfo = `❌ Direct Firestore Connection: FAILED\n\n`;
      errorInfo += `Error: ${error.message}\n\n`;
      
      if (error.code === 'permission-denied') {
        errorInfo += `🔒 PERMISSION DENIED - This is the problem!\n\n`;
        errorInfo += `🔧 Fix: Go to Firebase Console → Firestore → Rules\n`;
        errorInfo += `Replace with: allow read, write: if true;\n\n`;
      } else if (error.code === 'unavailable') {
        errorInfo += `🌐 NETWORK ISSUE - Check your internet connection\n\n`;
      } else {
        errorInfo += `🐛 UNKNOWN ERROR - Check console for details\n\n`;
      }
      
      setDebugInfo(errorInfo);
      console.error('Direct Firestore error:', error);
    }
    
    setLoading(false);
  };

  const testProductService = async () => {
    setLoading(true);
    setDebugInfo('🔍 Testing Product Service...\n\n');
    
    try {
      const result = await getAllProducts();
      
      let info = '';
      
      if (result.success) {
        info += `✅ Product Service: SUCCESS\n`;
        info += `📊 Products returned: ${result.data.length}\n`;
        info += `📋 Sample data structure:\n`;
        if (result.data[0]) {
          try {
            info += JSON.stringify(result.data[0], (key, value) => {
              // Handle Firestore timestamps and other objects safely
              if (value && typeof value === 'object' && value.toDate) {
                return value.toDate().toISOString();
              }
              if (value instanceof Date) {
                return value.toISOString();
              }
              return value;
            }, 2);
          } catch (error) {
            info += 'Error serializing data: ' + error.message;
          }
        } else {
          info += 'No data to show';
        }
        info += '\n\n';
      } else {
        info += `❌ Product Service: FAILED\n`;
        info += `Error: ${result.error}\n\n`;
      }
      
      setDebugInfo(info);
      
    } catch (error) {
      setDebugInfo(`❌ Product Service Exception: ${error.message}\n\n`);
      console.error('Product service error:', error);
    }
    
    setLoading(false);
  };

  const checkFirebaseConfig = () => {
    setLoading(true);
    
    let info = `🔧 Firebase Configuration Check:\n\n`;
    
    try {
      info += `✅ Database instance: ${db ? 'Connected' : 'Not connected'}\n`;
      info += `✅ App: ${db.app ? 'Initialized' : 'Not initialized'}\n`;
      info += `📋 Project ID: ${db.app.options.projectId || 'Not found'}\n\n`;
      
      // Check if we can access the products collection reference
      const productsRef = collection(db, 'products');
      info += `✅ Products collection reference: ${productsRef ? 'Created' : 'Failed'}\n\n`;
      
      info += `🎯 Next Steps:\n`;
      info += `1. Test Direct Firestore connection\n`;
      info += `2. If it fails → Fix permissions\n`;
      info += `3. If no data found → Add sample data\n`;
      
    } catch (error) {
      info += `❌ Firebase Config Error: ${error.message}\n`;
    }
    
    setDebugInfo(info);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🐛 Product Debug Console</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={checkFirebaseConfig}
          style={{ marginRight: '10px', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          disabled={loading}
        >
          Check Firebase Config
        </button>
        
        <button 
          onClick={testDirectFirestore}
          style={{ marginRight: '10px', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          disabled={loading}
        >
          Test Direct Firestore
        </button>
        
        <button 
          onClick={testProductService}
          style={{ padding: '10px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
          disabled={loading}
        >
          Test Product Service
        </button>
      </div>
      
      <div style={{ 
        background: '#f8f9fa', 
        border: '1px solid #dee2e6', 
        borderRadius: '4px', 
        padding: '15px',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        minHeight: '200px'
      }}>
        {loading ? 'Running test...' : debugInfo || 'Click a button above to start debugging'}
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '4px' }}>
        <h4>🎯 Common Issues & Solutions:</h4>
        <ul>
          <li><strong>Permission Denied:</strong> Update Firestore rules to allow read access</li>
          <li><strong>No products found:</strong> Add sample data via /test page or npm run seed</li>
          <li><strong>Network errors:</strong> Check internet connection and Firebase project settings</li>
          <li><strong>Config errors:</strong> Verify Firebase config in src/config/firebase.js</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDebug;
