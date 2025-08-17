import { collection,
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

const PRODUCTS_COLLECTION = "products";

// Helper function to convert Firestore Timestamps to JavaScript Dates
export const convertFirestoreDocToJSObject = convertFirestoreDoc;

// Create a new product
export const createProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), 
      prepareForFirestore(productData)
    );
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
};

// Read all products
export const getAllProducts = async () => {
try {
console.log('🔍 Starting getAllProducts...');

// Simple query - just get all products
const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));

console.log('📊 Found', querySnapshot.size, 'documents');

const products = [];
querySnapshot.forEach((doc) => {
  const productData = doc.data();
  console.log('📄 Product:', doc.id, productData.title);
  products.push(convertFirestoreDoc(doc));
});

console.log('✅ Returning', products.length, 'products');
return { 
  success: true, 
  data: products,
  count: products.length
};
} catch (error) {
console.error("❌ Error getting products:", error);
return { success: false, error: error.message };
}
};

// Read a single product by ID
export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return { success: true, data: productSnap.data() };
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
    await updateDoc(productRef, prepareForFirestore(updates, true));
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
      products.push(convertFirestoreDoc(doc));
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error("Error getting products by category:", error);
    return { success: false, error: error.message };
  }
};

// Search products by name or description
export const searchProducts = async (searchTerm) => {
  try {
    if (!searchTerm || searchTerm.trim() === "") {
      return { success: false, error: "Search term cannot be empty" };
    }
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products = [];

    // Iterate through all products and filter by search term
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchString = `${data.title} ${data.description}`.toLowerCase();

      if (searchString.includes(searchTerm.toLowerCase())) {
        products.push(convertFirestoreDoc(doc));
      }
    });
    if (products.length === 0) {
      return { success: false, error: "No products found matching the search term" };
    }
    return { success: true, data: products };
  } catch (error) {
    console.error("Error searching products:", error);
    return { success: false, error: error.message };
  }
};
