import{
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { db } from "../config/firebase";
import { convertFirestoreDoc, prepareForFirestore } from '../utils/firestoreUtils.js';


const ORDERS_COLLECTION = "orders";
const CARTS_COLLECTION = "carts";

// Create a new order from cart
export const createOrder = async (userId, cartItems, orderData) => {
  try {
    const order = {
      userId,
      items: cartItems,
      status: 'pending',
      totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...orderData
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), order);
    return { success: true, id: docRef.id, order };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
};

// Get all orders for a specific user
export const getUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    
    return { success: true, data: orders };
  } catch (error) {
    console.error("Error getting user orders:", error);
    return { success: false, error: error.message };
  }
};

// Get a specific order by ID
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      
      return { success: true, data: { id: orderSnap.id, ...orderSnap.data() } };
    } else {
      return { success: false, error: "Order not found" };
    }
  } catch (error) {
    console.error("Error getting order:", error);
    return { success: false, error: error.message };
  }
};



// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }
};

// Save cart (for persistent cart functionality)
export const saveCart = async (userId, cartItems) => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    await updateDoc(cartRef, {
      items: cartItems,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    // If cart doesn't exist, create it
    try {
      await addDoc(collection(db, CARTS_COLLECTION), {
        userId,
        items: cartItems,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true };
    } catch (createError) {
      console.error("Error saving cart:", createError);
      return { success: false, error: createError.message };
    }
  }
};

// Load cart for user
export const loadCart = async (userId) => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      return { success: true, data: cartSnap.data() };
    } else {
      return { success: true, data: { items: [] } };
    }
  } catch (error) {
    console.error("Error loading cart:", error);
    return { success: false, error: error.message };
  }
};

// Clear cart after order placement
export const clearCart = async (userId) => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    await updateDoc(cartRef, {
      items: [],
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: error.message };
  }
};

// Get all orders (admin function)
export const getAllOrders = async () => {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: orders };
  } catch (error) {
    console.error("Error getting all orders:", error);
    return { success: false, error: error.message };
  }
};

// Delete an order (admin function)
export const deleteOrder = async (orderId) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(orderRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: error.message };
  }
};
