// Quick test script to check if products are being fetched correctly
import { getAllProducts } from './src/services/productService.js';

console.log('🧪 Testing product service...');

getAllProducts()
  .then(result => {
    console.log('📊 Result:', result);
    if (result.success) {
      console.log('✅ Products fetched successfully!');
      console.log('📈 Count:', result.data.length);
      if (result.data.length > 0) {
        console.log('🎯 First product:', result.data[0]);
      }
    } else {
      console.log('❌ Failed to fetch products:', result.error);
    }
  })
  .catch(error => {
    console.error('💥 Exception:', error);
  });
