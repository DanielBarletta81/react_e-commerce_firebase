#!/usr/bin/env node

// Node.js script to seed Firestore with admin privileges
// Run with: node scripts/seed-data.js

const { getAdminFirestore } = require('../src/config/firebase-admin');

// Sample data (same as in your React app but for server-side seeding)
const sampleProducts = [
  {
    title: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 89.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    featured: true
  },
  {
    title: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    price: 24.99,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    featured: false
  },
  {
    title: "Smart Water Bottle",
    description: "Insulated smart water bottle that tracks your hydration and temperature.",
    price: 45.00,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    featured: true
  },
  {
    title: "Yoga Exercise Mat",
    description: "Non-slip, eco-friendly yoga mat perfect for all types of exercise and meditation.",
    price: 35.50,
    category: "sports",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    featured: false
  },
  {
    title: "Ceramic Coffee Mug Set",
    description: "Beautiful handcrafted ceramic coffee mugs, set of 4 in assorted colors.",
    price: 32.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400",
    featured: true
  }
  // Add more products as needed...
];

const sampleCustomers = [
  {
    id: "customer1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    phone: "555-0101",
    displayName: "John Doe",
    address: "123 Main St, Anytown, ST 12345"
  },
  {
    id: "customer2", 
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    phone: "555-0102",
    displayName: "Jane Smith",
    address: "456 Oak Ave, Somewhere, ST 67890"
  }
  // Add more customers as needed...
];

const seedData = async () => {
  try {
    console.log('🌱 Starting to seed Firestore with admin privileges...');
    
    const db = getAdminFirestore();
    
    // Add products
    console.log('📦 Adding products...');
    const productPromises = sampleProducts.map((product, index) => {
      return db.collection('products').add({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    const productResults = await Promise.all(productPromises);
    console.log(`✅ Added ${productResults.length} products`);
    
    // Add customers
    console.log('👥 Adding customers...');
    const customerPromises = sampleCustomers.map(customer => {
      return db.collection('users').doc(customer.id).set({
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        displayName: customer.displayName,
        address: customer.address,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    await Promise.all(customerPromises);
    console.log(`✅ Added ${sampleCustomers.length} customers`);
    
    // Add sample orders
    console.log('📋 Adding sample orders...');
    const sampleOrders = [
      {
        userId: "customer1",
        items: [
          { id: "1", title: "Wireless Bluetooth Headphones", price: 89.99, quantity: 1, category: "electronics" },
          { id: "2", title: "Organic Cotton T-Shirt", price: 24.99, quantity: 2, category: "clothing" }
        ],
        status: "delivered",
        shippingAddress: "123 Main St, Anytown, ST 12345",
        paymentMethod: "Credit Card"
      }
    ];
    
    const orderPromises = sampleOrders.map(order => {
      const totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return db.collection('orders').add({
        ...order,
        totalAmount,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    const orderResults = await Promise.all(orderPromises);
    console.log(`✅ Added ${orderResults.length} orders`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   Products: ${productResults.length}`);
    console.log(`   Customers: ${sampleCustomers.length}`);
    console.log(`   Orders: ${orderResults.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('✨ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedData };
