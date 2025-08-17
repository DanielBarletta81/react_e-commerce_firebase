/**
 * Converts Firestore document to plain JavaScript object
 * Handles Timestamp conversion and ensures consistent data structure
 */
export const convertFirestoreDoc = (doc) => {
  if (!doc.exists()) {
    return null;
  }
  
  const data = doc.data();
  const converted = { id: doc.id };
  
  // Convert all fields, handling special Firestore types
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (value && typeof value === 'object') {
      // Handle Firestore Timestamp
      if (value.toDate && typeof value.toDate === 'function') {
        converted[key] = value.toDate();
      }
      // Handle Firestore GeoPoint
      else if (value.latitude !== undefined && value.longitude !== undefined) {
        converted[key] = {
          latitude: value.latitude,
          longitude: value.longitude
        };
      }
      // Handle arrays and nested objects
      else if (Array.isArray(value)) {
        converted[key] = value.map(item => 
          item && typeof item === 'object' && item.toDate ? item.toDate() : item
        );
      }
      // Handle nested objects
      else {
        converted[key] = value;
      }
    } else {
      converted[key] = value;
    }
  });
  
  return converted;
};

/**
 * Converts multiple Firestore documents to plain JavaScript objects
 */
export const convertFirestoreDocs = (querySnapshot) => {
  return querySnapshot.docs.map(doc => convertFirestoreDoc(doc));
};

/**
 * Prepares data for Firestore by adding timestamps
 */
export const prepareForFirestore = (data, isUpdate = false) => {
  const prepared = { ...data };
  
  if (!isUpdate) {
    prepared.createdAt = new Date();
  }
  prepared.updatedAt = new Date();
  
  return prepared;
};
