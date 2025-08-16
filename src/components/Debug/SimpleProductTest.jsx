import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const SimpleProductTest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    testProducts();
  }, []);

  const clearAndSeed = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🗑️ Clearing existing products...');
      
      // Clear existing products
      const querySnapshot = await getDocs(collection(db, 'products'));
      const deletePromises = [];
      querySnapshot.forEach((document) => {
        deletePromises.push(deleteDoc(doc(db, 'products', document.id)));
      });
      await Promise.all(deletePromises);
      console.log(`✅ Deleted ${deletePromises.length} existing products`);
      
      // Add fresh sample data
      console.log('🌱 Adding fresh sample products...');
      const sampleProducts = [
        {
          title: "Wireless Bluetooth Headphones",
          description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
          price: 89.99,
          category: "electronics",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
          featured: true,
          stock: 50
        },
        {
          title: "Organic Cotton T-Shirt",
          description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
          price: 24.99,
          category: "clothing",
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
          featured: false,
          stock: 100
        },
        {
          title: "Smart Water Bottle",
          description: "Insulated smart water bottle that tracks your hydration and temperature.",
          price: 45.00,
          category: "electronics",
          image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
          featured: true,
          stock: 30
        }
      ];
      
      const addPromises = sampleProducts.map(product => 
        addDoc(collection(db, 'products'), {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      );
      
      await Promise.all(addPromises);
      console.log(`✅ Added ${sampleProducts.length} fresh products`);
      
      // Reload to show new data
      await testProducts();
      
    } catch (err) {
      console.error('❌ Error during clear and seed:', err);
      setError(err.message);
    }
    
    setLoading(false);
  };

  const testProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Simple product test starting...');
      
      const querySnapshot = await getDocs(collection(db, 'products'));
      console.log(`📊 Found ${querySnapshot.size} products`);
      
      const productsList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`📄 Raw product data:`, doc.id, data);
        productsList.push({
          id: doc.id,
          title: data.title || 'No title',
          price: data.price || 0,
          category: data.category || 'No category',
          rawData: JSON.stringify(data, null, 2)
        });
      });
      
      setProducts(productsList);
      console.log('✅ Products loaded:', productsList.length);
      
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
    }
    
    setLoading(false);
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Simple Product Test</h2>
      <p>Found {products.length} products:</p>
      
      {products.length === 0 ? (
        <p>No products found in database</p>
      ) : (
        <div>
          {products.map((product) => (
            <div key={product.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc' }}>
              <strong>{product.title}</strong> - ${product.price} ({product.category})
              <pre style={{ background: '#f5f5f5', padding: '5px', fontSize: '12px', marginTop: '5px' }}>
                {product.rawData}
              </pre>
            </div>
          ))}
        </div>
      )}
      
      <button onClick={testProducts} style={{ marginTop: '10px', padding: '10px', marginRight: '10px' }}>
        Reload Products
      </button>
      
      <button onClick={clearAndSeed} style={{ marginTop: '10px', padding: '10px', background: '#dc3545', color: 'white' }}>
        🗑️ Clear & Re-seed Database
      </button>
    </div>
  );
};

export default SimpleProductTest;
