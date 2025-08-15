import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const FirebaseTest = () => {
  const [status, setStatus] = useState('Testing Firebase connection...');
  const [data, setData] = useState([]);

  useEffect(() => {
    testFirestore();
  }, []);

  const testFirestore = async () => {
    try {
      // Test writing to Firestore
      const docRef = await addDoc(collection(db, 'test'), {
        message: 'Hello Firestore!',
        timestamp: new Date()
      });
      
      console.log('Document written with ID: ', docRef.id);
      
      // Test reading from Firestore
      const querySnapshot = await getDocs(collection(db, 'test'));
      const testData = [];
      querySnapshot.forEach((doc) => {
        testData.push({ id: doc.id, ...doc.data() });
      });
      
      setData(testData);
      setStatus('✅ Firestore connection successful!');
    } catch (error) {
      console.error('Firebase error:', error);
      setStatus(`❌ Firebase error: ${error.message}`);
    }
  };

  const testAuth = async () => {
    try {
      const { registerUser } = await import('../../services/authService');
      const testEmail = `test${Date.now()}@example.com`;
      const result = await registerUser(testEmail, 'test123456', {
        firstName: 'Test',
        lastName: 'User'
      });
      
      if (result.success) {
        setStatus('✅ Auth and Firestore working!');
      } else {
        setStatus(`❌ Auth error: ${result.error}`);
      }
    } catch (error) {
      console.error('Auth test error:', error);
      setStatus(`❌ Auth test failed: ${error.message}`);
    }
  };

  const addSampleData = async () => {
    try {
      setStatus('Adding sample products...');
      const { addSampleProducts } = await import('../../utils/sampleData');
      const results = await addSampleProducts();
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      setStatus(`✅ Added ${successful} products successfully${failed > 0 ? `, ${failed} failed` : ''}`);
    } catch (error) {
      console.error('Sample data error:', error);
      setStatus(`❌ Failed to add sample data: ${error.message}`);
    }
  };

  const addAllSampleData = async () => {
    try {
      setStatus('Adding all sample data (products, customers, orders)...');
      const { addAllSampleData } = await import('../../utils/sampleData');
      const result = await addAllSampleData();
      
      if (result.success) {
        const { summary } = result;
        setStatus(`✅ Sample data added successfully! Products: ${summary.products.successful}/${summary.products.total}, Customers: ${summary.customers.successful}/${summary.customers.total}, Orders: ${summary.orders.successful}/${summary.orders.total}`);
      } else {
        setStatus(`❌ Failed to add sample data: ${result.error}`);
      }
    } catch (error) {
      console.error('All sample data error:', error);
      setStatus(`❌ Failed to add all sample data: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Firebase Connection Test</h2>
      <p><strong>Status:</strong> {status}</p>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={testFirestore} style={{ marginRight: '10px' }}>
          Test Firestore
        </button>
        <button onClick={testAuth} style={{ marginRight: '10px' }}>
          Test Auth + User Creation
        </button>
        <button onClick={addSampleData} style={{ marginRight: '10px' }}>
          Add 25 Products Only
        </button>
        <button onClick={addAllSampleData} style={{ marginBottom: '10px' }}>
          Add ALL Sample Data
        </button>
      </div>
      
      {data.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Test Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FirebaseTest;
