# Sample Data for E-Commerce App

## 📊 **Complete Sample Data Set**

I've created comprehensive sample data to populate your Firestore database with realistic e-commerce data:

### **25 Sample Products**
- **Categories**: Electronics (8), Clothing (4), Home (6), Sports (4), Beauty (1), Toys (1), Other (1)
- **Price Range**: $18.50 - $159.99
- **Featured Products**: 8 products marked as featured
- **Images**: High-quality product images from Unsplash
- **Realistic Descriptions**: Detailed product descriptions for each item

### **5 Sample Customers**
- Complete user profiles with names, emails, phones, and addresses
- Ready for authentication testing and order management
- Includes: John Doe, Jane Smith, Mike Johnson, Sarah Wilson, David Brown

### **5 Sample Orders**
- Various order statuses: Delivered, Shipped, Processing, Pending, Cancelled
- Multiple items per order with realistic quantities
- Different payment methods: Credit Card, PayPal, Debit Card
- Total amounts calculated automatically
- Linked to sample customers

## 🚀 **How to Add Sample Data**

### **Option 1: All Data at Once (Recommended)**
1. Visit: `http://localhost:3000/test`
2. Click **"Add ALL Sample Data"**
3. This will add all 25 products + 5 customers + 5 orders

### **Option 2: Products Only**
1. Visit: `http://localhost:3000/test` 
2. Click **"Add 25 Products Only"**
3. This adds just the product catalog

## 📋 **Sample Data Preview**

### **Products Include:**
- **Electronics**: Bluetooth Headphones ($89.99), Smart Water Bottle ($45.00), Fitness Tracker ($149.99)
- **Clothing**: Organic Cotton T-Shirt ($24.99), Denim Jeans ($69.99), Winter Jacket ($159.99)
- **Home**: Ceramic Coffee Mug Set ($32.99), LED Desk Lamp ($42.00), Kitchen Knife Set ($79.99)
- **Sports**: Yoga Exercise Mat ($35.50), Running Shoes ($129.99), Tennis Racket ($159.99)
- **And many more...**

### **Customer Data:**
```javascript
{
  id: "customer1",
  email: "john.doe@example.com", 
  firstName: "John",
  lastName: "Doe",
  phone: "555-0101",
  displayName: "John Doe",
  address: "123 Main St, Anytown, ST 12345"
}
```

### **Order Data:**
```javascript
{
  userId: "customer1",
  items: [
    { id: "1", title: "Wireless Bluetooth Headphones", price: 89.99, quantity: 1 },
    { id: "2", title: "Organic Cotton T-Shirt", price: 24.99, quantity: 2 }
  ],
  status: "delivered",
  totalAmount: 139.97,
  shippingAddress: "123 Main St, Anytown, ST 12345",
  paymentMethod: "Credit Card"
}
```

## 🔧 **Troubleshooting Your Product Fetch Issues**

If you're having problems fetching products, here's what to check:

### **1. Firebase Setup**
- ✅ Firestore Database is enabled
- ✅ Security rules allow read/write access
- ✅ Products collection exists with data

### **2. Test the Connection**
Visit `/test` and run:
1. **Test Firestore** - Verify database connectivity
2. **Add ALL Sample Data** - Populate with realistic data  
3. Check browser console for any errors

### **3. Verify Data in Firebase Console**
- Go to [Firebase Console](https://console.firebase.google.com)
- Navigate to Firestore Database
- Check that collections exist: `products`, `users`, `orders`

### **4. Test Product Fetching**
- Visit `/products` to see the product list
- Visit `/manage-products` for admin view with CRUD operations

## 🎯 **What This Gives You**

After running the sample data script, you'll have:

- **✅ Fully populated product catalog** with 25 diverse items
- **✅ Customer database** ready for authentication testing  
- **✅ Order history** with realistic transaction data
- **✅ All CRUD operations** ready to test
- **✅ Shopping cart functionality** ready to use
- **✅ Complete e-commerce workflow** from browse to purchase

## 🔐 **Firebase Security Rules**

Make sure your Firestore rules allow the operations:

```javascript
// Test mode (for development)
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 📈 **Next Steps**

1. **Add the sample data** using the test page
2. **Test product browsing** at `/products`
3. **Try the shopping cart** - add items and checkout
4. **Check order history** after placing orders
5. **Test product management** at `/manage-products`

This comprehensive sample data set will help you verify that all your Firestore operations are working correctly and give you a realistic dataset to work with during development!
