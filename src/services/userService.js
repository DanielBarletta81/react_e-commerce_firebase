import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db, auth } from "../config/firebase";


const USERS_COLLECTION = "users";

// Create user document in Firestore
export const createUserDocument = async (userId, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, userData);
    return { success: true };
  } catch (error) {
    console.error("Error creating user document:", error);
    return { success: false, error: error.message };
  }
};

// Read user data from Firestore
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return { success: false, error: error.message };
  }
};

// Update user data in Firestore
export const updateUserData = async (userId, updates) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user data:", error);
    return { success: false, error: error.message };
  }
};

// Delete user account and data
export const deleteUserAccount = async (userId) => {
  try {
    // Delete user document from Firestore
    const userRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userRef);
    
    // Delete user authentication account
    const user = auth.currentUser;
    if (user && user.uid === userId) {
      await deleteUser(user);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return { success: false, error: error.message };
  }
};

// Get all users (admin function - optional)
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const querySnapshot = await getDocs(usersRef);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    
    return { success: true, data: users };
  } catch (error) {
    console.error("Error getting all users:", error);
    return { success: false, error: error.message };
  }
};

// Search users by email (admin function - optional)
export const searchUsersByEmail = async (email) => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    if (users.length === 0) {
      return { success: false, error: "No users found with that email" };
    }
    
    return { success: true, data: users };
  } catch (error) {
    console.error("Error searching users:", error);
    return { success: false, error: error.message };
  }
};
