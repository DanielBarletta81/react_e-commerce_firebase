// Utility functions to safely render values in React

// Safely render any value - converts objects to strings, handles null/undefined
export const safeRender = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  if (typeof value === 'object') {
    // If it's a Firestore timestamp
    if (value.toDate && typeof value.toDate === 'function') {
      return value.toDate().toLocaleDateString();
    }
    
    // For other objects, convert to string safely
    try {
      return JSON.stringify(value);
    } catch (error) {
      return '[Object]';
    }
  }
  
  return String(value);
};

// Safely render a price
export const safePrice = (price) => {
  if (price === null || price === undefined) {
    return '0.00';
  }
  
  const numPrice = typeof price === 'number' ? price : parseFloat(price);
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
};

// Safely render a date
export const safeDate = (date) => {
  if (!date) return '';
  
  if (date instanceof Date) {
    return date.toLocaleDateString();
  }
  
  if (typeof date === 'object' && date.toDate) {
    return date.toDate().toLocaleDateString();
  }
  
  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? date : parsedDate.toLocaleDateString();
  }
  
  return String(date);
};

// Safely render text with fallback
export const safeText = (text, fallback = '') => {
  if (!text) return fallback;
  return String(text);
};
