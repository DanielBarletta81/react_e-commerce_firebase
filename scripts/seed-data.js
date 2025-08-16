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
  },
  {
    title: "Yoga Exercise Mat",
    description: "Non-slip, eco-friendly yoga mat perfect for all types of exercise and meditation.",
    price: 35.50,
    category: "sports",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    featured: false,
    stock: 25
  },
  {
    title: "Ceramic Coffee Mug Set",
    description: "Beautiful handcrafted ceramic coffee mugs, set of 4 in assorted colors.",
    price: 32.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400",
    featured: true,
    stock: 40
  },
  {
    title: "Laptop Stand Adjustable",
    description: "Ergonomic aluminum laptop stand with adjustable height and angle.",
    price: 59.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    featured: false,
    stock: 35
  },
  {
    title: "Running Shoes",
    description: "Lightweight running shoes with advanced cushioning technology.",
    price: 129.99,
    category: "sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    featured: true,
    stock: 60
  },
  {
    title: "Kitchen Knife Set",
    description: "Professional-grade stainless steel kitchen knives with wooden block.",
    price: 149.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400",
    featured: false,
    stock: 20
  },
  {
    title: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 29.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
    featured: false,
    stock: 80
  },
  {
    title: "Denim Jacket",
    description: "Classic denim jacket with vintage wash and comfortable fit.",
    price: 79.99,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400",
    featured: false,
    stock: 45
  },
  {
    title: "Fitness Resistance Bands",
    description: "Set of 5 resistance bands with different resistance levels for strength training.",
    price: 19.99,
    category: "sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    featured: false,
    stock: 75
  },
  {
    title: "Essential Oil Diffuser",
    description: "Ultrasonic aromatherapy diffuser with LED lighting and timer function.",
    price: 39.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=400",
    featured: true,
    stock: 30
  },
  {
    title: "Smartphone Case",
    description: "Protective phone case with card holder and magnetic car mount compatibility.",
    price: 14.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1520207418977-9d95d3c9ff81?w=400",
    featured: false,
    stock: 120
  },
  {
    title: "Casual Sneakers",
    description: "Comfortable everyday sneakers made with sustainable materials.",
    price: 69.99,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    featured: false,
    stock: 55
  },
  {
    title: "Camping Backpack",
    description: "Large capacity hiking backpack with multiple compartments and rain cover.",
    price: 99.99,
    category: "sports",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    featured: true,
    stock: 15
  }
];

const sampleUsers = [
  {
    uid: "user1_auth_id",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    phone: "555-0101",
    displayName: "John Doe",
    address: "123 Main St, Anytown, ST 12345",
    city: "Anytown",
    state: "ST",
    zipCode: "12345",
    dateOfBirth: "1990-05-15",
    preferences: {
      newsletter: true,
      notifications: true,
      favoriteCategories: ["electronics", "sports"]
    }
  },
  {
    uid: "user2_auth_id",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    phone: "555-0102",
    displayName: "Jane Smith",
    address: "456 Oak Ave, Somewhere, ST 67890",
    city: "Somewhere",
    state: "ST",
    zipCode: "67890",
    dateOfBirth: "1988-09-22",
    preferences: {
      newsletter: false,
      notifications: true,
      favoriteCategories: ["clothing", "home"]
    }
  },
  {
    uid: "user3_auth_id",
    email: "mike.johnson@example.com",
    firstName: "Mike",
    lastName: "Johnson",
    phone: "555-0103",
    displayName: "Mike Johnson",
    address: "789 Pine St, Elsewhere, ST 11111",
    city: "Elsewhere",
    state: "ST",
    zipCode: "11111",
    dateOfBirth: "1992-03-08",
    preferences: {
      newsletter: true,
      notifications: false,
      favoriteCategories: ["electronics", "home"]
    }
  },
  {
    uid: "user4_auth_id",
    email: "sarah.wilson@example.com",
    firstName: "Sarah",
    lastName: "Wilson",
    phone: "555-0104",
    displayName: "Sarah Wilson",
    address: "321 Elm St, Newtown, ST 22222",
    city: "Newtown",
    state: "ST",
    zipCode: "22222",
    dateOfBirth: "1985-12-03",
    preferences: {
      newsletter: true,
      notifications: true,
      favoriteCategories: ["clothing", "sports"]
    }
  },
  {
    uid: "user5_auth_id",
    email: "alex.brown@example.com",
    firstName: "Alex",
    lastName: "Brown",
    phone: "555-0105",
    displayName: "Alex Brown",
    address: "654 Maple Dr, Oldtown, ST 33333",
    city: "Oldtown",
    state: "ST",
    zipCode: "33333",
    dateOfBirth: "1995-07-18",
    preferences: {
      newsletter: false,
      notifications: false,
      favoriteCategories: ["electronics", "clothing"]
    }
  }
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
    
    // Add users
    console.log('👥 Adding users...');
    const userPromises = sampleUsers.map(user => {
      return db.collection('users').doc(user.uid).set({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        displayName: user.displayName,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        dateOfBirth: user.dateOfBirth,
        preferences: user.preferences,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    await Promise.all(userPromises);
    console.log(`✅ Added ${sampleUsers.length} users`);
    
    // Add sample orders with realistic data
    console.log('📋 Adding sample orders...');
    const sampleOrders = [
      {
        userId: "user1_auth_id",
        items: [
          { id: "prod_1", title: "Wireless Bluetooth Headphones", price: 89.99, quantity: 1, category: "electronics" },
          { id: "prod_2", title: "Smartphone Case", price: 14.99, quantity: 2, category: "electronics" }
        ],
        status: "delivered",
        shippingAddress: "123 Main St, Anytown, ST 12345",
        paymentMethod: "Credit Card",
        trackingNumber: "TRK001234567890"
      },
      {
        userId: "user2_auth_id",
        items: [
          { id: "prod_3", title: "Organic Cotton T-Shirt", price: 24.99, quantity: 3, category: "clothing" },
          { id: "prod_4", title: "Denim Jacket", price: 79.99, quantity: 1, category: "clothing" }
        ],
        status: "shipped",
        shippingAddress: "456 Oak Ave, Somewhere, ST 67890",
        paymentMethod: "PayPal",
        trackingNumber: "TRK001234567891"
      },
      {
        userId: "user3_auth_id",
        items: [
          { id: "prod_5", title: "Laptop Stand Adjustable", price: 59.99, quantity: 1, category: "electronics" },
          { id: "prod_6", title: "Essential Oil Diffuser", price: 39.99, quantity: 1, category: "home" },
          { id: "prod_7", title: "Ceramic Coffee Mug Set", price: 32.99, quantity: 1, category: "home" }
        ],
        status: "processing",
        shippingAddress: "789 Pine St, Elsewhere, ST 11111",
        paymentMethod: "Credit Card",
        trackingNumber: "TRK001234567892"
      },
      {
        userId: "user4_auth_id",
        items: [
          { id: "prod_8", title: "Running Shoes", price: 129.99, quantity: 1, category: "sports" },
          { id: "prod_9", title: "Fitness Resistance Bands", price: 19.99, quantity: 2, category: "sports" }
        ],
        status: "delivered",
        shippingAddress: "321 Elm St, Newtown, ST 22222",
        paymentMethod: "Credit Card",
        trackingNumber: "TRK001234567893"
      },
      {
        userId: "user5_auth_id",
        items: [
          { id: "prod_10", title: "Smart Water Bottle", price: 45.00, quantity: 1, category: "electronics" },
          { id: "prod_11", title: "Yoga Exercise Mat", price: 35.50, quantity: 1, category: "sports" }
        ],
        status: "pending",
        shippingAddress: "654 Maple Dr, Oldtown, ST 33333",
        paymentMethod: "Debit Card",
        trackingNumber: null
      },
      {
        userId: "user1_auth_id",
        items: [
          { id: "prod_12", title: "Kitchen Knife Set", price: 149.99, quantity: 1, category: "home" }
        ],
        status: "cancelled",
        shippingAddress: "123 Main St, Anytown, ST 12345",
        paymentMethod: "Credit Card",
        trackingNumber: null
      },
      {
        userId: "user2_auth_id",
        items: [
          { id: "prod_13", title: "Casual Sneakers", price: 69.99, quantity: 1, category: "clothing" },
          { id: "prod_14", title: "Wireless Charging Pad", price: 29.99, quantity: 1, category: "electronics" }
        ],
        status: "delivered",
        shippingAddress: "456 Oak Ave, Somewhere, ST 67890",
        paymentMethod: "Credit Card",
        trackingNumber: "TRK001234567894"
      }
    ];
    
    const orderPromises = sampleOrders.map((order, index) => {
      const totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
      
      return db.collection('orders').add({
        ...order,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        createdAt: orderDate,
        updatedAt: new Date()
      });
    });
    
    const orderResults = await Promise.all(orderPromises);
    console.log(`✅ Added ${orderResults.length} orders`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   Products: ${productResults.length}`);
    console.log(`   Users: ${sampleUsers.length}`);
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
