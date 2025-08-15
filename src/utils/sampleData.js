import { createProduct } from '../services/productService';
import { createUserDocument } from '../services/userService';
import { createOrder } from '../services/orderService';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const sampleProducts = [
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
  },
  {
    title: "LED Desk Lamp",
    description: "Adjustable LED desk lamp with multiple brightness levels and USB charging port.",
    price: 42.00,
    category: "home",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400",
    featured: false
  },
  {
    title: "Smartphone Case",
    description: "Durable protective case for smartphones with wireless charging compatibility.",
    price: 19.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
    featured: false
  },
  {
    title: "Running Shoes",
    description: "Lightweight running shoes with advanced cushioning and breathable mesh upper.",
    price: 129.99,
    category: "sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    featured: true
  },
  {
    title: "Backpack Laptop Bag",
    description: "Spacious laptop backpack with multiple compartments and anti-theft design.",
    price: 59.99,
    category: "other",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    featured: false
  },
  {
    title: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking and long battery life.",
    price: 29.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
    featured: false
  },
  {
    title: "Kitchen Knife Set",
    description: "Professional chef knife set with wooden block and sharpening steel.",
    price: 79.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400",
    featured: true
  },
  {
    title: "Bluetooth Speaker",
    description: "Portable waterproof Bluetooth speaker with 360-degree sound and bass boost.",
    price: 54.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    featured: false
  },
  {
    title: "Denim Jeans",
    description: "Classic straight-fit denim jeans made from premium cotton blend.",
    price: 69.99,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    featured: false
  },
  {
    title: "Indoor Plant Pot",
    description: "Modern ceramic plant pot with drainage hole and matching saucer.",
    price: 18.50,
    category: "home",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400",
    featured: false
  },
  {
    title: "Fitness Tracker",
    description: "Advanced fitness tracker with heart rate monitoring and sleep tracking.",
    price: 149.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400",
    featured: true
  },
  {
    title: "Hoodie Sweatshirt",
    description: "Comfortable cotton blend hoodie with kangaroo pocket and drawstring hood.",
    price: 39.99,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1556821840-3a9fbc0cd86b?w=400",
    featured: false
  },
  {
    title: "Board Game",
    description: "Strategic board game for 2-4 players, perfect for family game nights.",
    price: 34.99,
    category: "toys",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400",
    featured: false
  },
  {
    title: "Skincare Set",
    description: "Complete skincare routine set with cleanser, toner, serum, and moisturizer.",
    price: 89.99,
    category: "beauty",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
    featured: true
  },
  {
    title: "Wall Clock",
    description: "Modern minimalist wall clock with silent movement and wooden frame.",
    price: 24.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400",
    featured: false
  },
  {
    title: "Tennis Racket",
    description: "Professional tennis racket with graphite frame and comfortable grip.",
    price: 159.99,
    category: "sports",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
    featured: false
  },
  {
    title: "Reading Glasses",
    description: "Stylish reading glasses with anti-blue light coating and flexible frames.",
    price: 29.99,
    category: "other",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400",
    featured: false
  },
  {
    title: "Camping Tent",
    description: "2-person camping tent with waterproof coating and easy setup design.",
    price: 119.99,
    category: "sports",
    image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400",
    featured: true
  },
  {
    title: "Notebook Set",
    description: "Set of 3 premium notebooks with dotted pages and elastic closure.",
    price: 19.99,
    category: "other",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    featured: false
  },
  {
    title: "Essential Oil Diffuser",
    description: "Ultrasonic aromatherapy diffuser with color-changing LED lights.",
    price: 44.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    featured: false
  },
  {
    title: "Winter Jacket",
    description: "Insulated winter jacket with water-resistant fabric and adjustable hood.",
    price: 159.99,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    featured: true
  }
];

export const sampleCustomers = [
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
  },
  {
    id: "customer3",
    email: "mike.johnson@example.com", 
    firstName: "Mike",
    lastName: "Johnson",
    phone: "555-0103",
    displayName: "Mike Johnson",
    address: "789 Pine St, Elsewhere, ST 11223"
  },
  {
    id: "customer4",
    email: "sarah.wilson@example.com",
    firstName: "Sarah", 
    lastName: "Wilson",
    phone: "555-0104",
    displayName: "Sarah Wilson",
    address: "321 Elm St, Nowhere, ST 44556"
  },
  {
    id: "customer5",
    email: "david.brown@example.com",
    firstName: "David",
    lastName: "Brown", 
    phone: "555-0105",
    displayName: "David Brown",
    address: "654 Cedar Ave, Anywhere, ST 77889"
  }
];

export const addSampleProducts = async () => {
  const results = [];
  
  for (const product of sampleProducts) {
    try {
      const result = await createProduct(product);
      results.push(result);
      console.log(`Added product: ${product.title}`, result);
    } catch (error) {
      console.error(`Failed to add product: ${product.title}`, error);
      results.push({ success: false, error: error.message });
    }
  }
  
  return results;
};

export const addSampleCustomers = async () => {
  const results = [];
  
  for (const customer of sampleCustomers) {
    try {
      const result = await createUserDocument(customer.id, {
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        displayName: customer.displayName,
        address: customer.address,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      results.push(result);
      console.log(`Added customer: ${customer.displayName}`, result);
    } catch (error) {
      console.error(`Failed to add customer: ${customer.displayName}`, error);
      results.push({ success: false, error: error.message });
    }
  }
  
  return results;
};

export const addSampleOrders = async () => {
  const results = [];
  
  // Sample order data
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
    },
    {
      userId: "customer2", 
      items: [
        { id: "3", title: "Smart Water Bottle", price: 45.00, quantity: 1, category: "electronics" },
        { id: "4", title: "Yoga Exercise Mat", price: 35.50, quantity: 1, category: "sports" }
      ],
      status: "shipped",
      shippingAddress: "456 Oak Ave, Somewhere, ST 67890",
      paymentMethod: "PayPal"
    },
    {
      userId: "customer3",
      items: [
        { id: "5", title: "Ceramic Coffee Mug Set", price: 32.99, quantity: 1, category: "home" },
        { id: "6", title: "LED Desk Lamp", price: 42.00, quantity: 1, category: "home" },
        { id: "7", title: "Smartphone Case", price: 19.99, quantity: 3, category: "electronics" }
      ],
      status: "processing", 
      shippingAddress: "789 Pine St, Elsewhere, ST 11223",
      paymentMethod: "Credit Card"
    },
    {
      userId: "customer4",
      items: [
        { id: "8", title: "Running Shoes", price: 129.99, quantity: 1, category: "sports" },
        { id: "9", title: "Fitness Tracker", price: 149.99, quantity: 1, category: "electronics" }
      ],
      status: "pending",
      shippingAddress: "321 Elm St, Nowhere, ST 44556", 
      paymentMethod: "Debit Card"
    },
    {
      userId: "customer5",
      items: [
        { id: "10", title: "Winter Jacket", price: 159.99, quantity: 1, category: "clothing" },
        { id: "11", title: "Backpack Laptop Bag", price: 59.99, quantity: 1, category: "other" }
      ],
      status: "cancelled",
      shippingAddress: "654 Cedar Ave, Anywhere, ST 77889",
      paymentMethod: "Credit Card"
    }
  ];

  for (const order of sampleOrders) {
    try {
      // Add order directly to Firestore (bypassing auth requirement)
      const docRef = await addDoc(collection(db, "orders"), {
        ...order,
        totalAmount: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      results.push({ success: true, id: docRef.id });
      console.log(`Added order for customer: ${order.userId}`, { success: true, id: docRef.id });
    } catch (error) {
      console.error(`Failed to add order for customer: ${order.userId}`, error);
      results.push({ success: false, error: error.message });
    }
  }
  
  return results;
};

export const addAllSampleData = async () => {
  console.log("Starting to add all sample data...");
  
  try {
    // Add products first
    console.log("Adding 25 sample products...");
    const productResults = await addSampleProducts();
    
    // Add customers
    console.log("Adding 5 sample customers...");
    const customerResults = await addSampleCustomers();
    
    // Add orders
    console.log("Adding 5 sample orders...");
    const orderResults = await addSampleOrders();
    
    const summary = {
      products: {
        total: productResults.length,
        successful: productResults.filter(r => r.success).length,
        failed: productResults.filter(r => !r.success).length
      },
      customers: {
        total: customerResults.length,
        successful: customerResults.filter(r => r.success).length,
        failed: customerResults.filter(r => !r.success).length
      },
      orders: {
        total: orderResults.length,
        successful: orderResults.filter(r => r.success).length,
        failed: orderResults.filter(r => !r.success).length
      }
    };
    
    console.log("Sample data summary:", summary);
    return { success: true, summary };
    
  } catch (error) {
    console.error("Failed to add sample data:", error);
    return { success: false, error: error.message };
  }
};
