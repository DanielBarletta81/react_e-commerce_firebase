import { 
  collection,
  doc, 
  addDoc,
  getDoc,
  getDocs,
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  startAfter
} from "firebase/firestore";
import { db } from "../config/firebase";

const PRODUCTS_COLLECTION = "products";

// Helper function to convert Firestore Timestamps to JavaScript Dates
const convertFirestoreData = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
  };
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
};

// Read all products with optional pagination and filtering
export const getAllProducts = async (options = {}) => {
  try {
    const { 
      limitCount = null, 
      orderByField = "createdAt", 
      orderDirection = "desc",
      startAfterDoc = null 
    } = options;
    
    let q = query(collection(db, PRODUCTS_COLLECTION));
    
    // Add ordering
    q = query(q, orderBy(orderByField, orderDirection));
    
    // Add pagination
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }
    
    // Add limit
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push(convertFirestoreData(doc));
    });
    
    return { 
      success: true, 
      data: products,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
      count: products.length
    };
  } catch (error) {
    console.error("Error getting products:", error);
    return { success: false, error: error.message };
  }
};

// Read a single product by ID
export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return { success: true, data: convertFirestoreData(productSnap) };
    } else {
      return { success: false, error: "Product not found" };
    }
  } catch (error) {
    console.error("Error getting product:", error);
    return { success: false, error: error.message };
  }
};

// Update a product
export const updateProduct = async (productId, updates) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
};

// Search products by category
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION), 
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push(convertFirestoreData(doc));
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error("Error getting products by category:", error);
    return { success: false, error: error.message };
  }
};

// Get featured products (limited number)
export const getFeaturedProducts = async (limitCount = 6) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION), 
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push(convertFirestoreData(doc));
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error("Error getting featured products:", error);
    return { success: false, error: error.message };
  }
};

// Search products by name or description
export const searchProducts = async (searchTerm) => {
  try {
    // Note: For better search, consider using Algolia or similar
    // This is a basic implementation
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    const products = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchString = `${data.title} ${data.description}`.toLowerCase();
      if (searchString.includes(searchTerm.toLowerCase())) {
        products.push(convertFirestoreData(doc));
      }
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error("Error searching products:", error);
    return { success: false, error: error.message };
  }
};
