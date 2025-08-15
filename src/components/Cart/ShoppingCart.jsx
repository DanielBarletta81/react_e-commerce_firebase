import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearCart } from '../../services/orderService';
import '../../styles/cart.css';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    const orderData = {
      shippingAddress: 'Default Address', // You can expand this
      paymentMethod: 'Credit Card', // You can expand this
      orderNotes: ''
    };

    const result = await createOrder(currentUser.uid, cartItems, orderData);
    
    if (result.success) {
      // Clear cart after successful order
      setCartItems([]);
      localStorage.removeItem('cart');
      
      // Clear cart in Firestore as well
      await clearCart(currentUser.uid);
      
      navigate('/orders', { 
        state: { message: 'Order placed successfully!' } 
      });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  if (!currentUser) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <p>Please log in to view your cart.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart ({getTotalItems()} items)</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.title} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="item-category">{item.category}</p>
                  <div className="item-price">${item.price}</div>
                </div>
                
                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="total-price">
              <strong>Total: ${getTotalPrice()}</strong>
            </div>
            
            <div className="cart-actions">
              <button 
                onClick={() => navigate('/products')}
                className="btn btn-secondary"
              >
                Continue Shopping
              </button>
              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
