import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserOrders } from '../../services/orderService';
import OrderDetails from './OrderDetails';
import '../../styles/orders.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    loadOrders();
    
    // Check for success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after displaying
      window.history.replaceState({}, document.title);
    }
  }, [currentUser, navigate, location.state]);

  const loadOrders = async () => {
    setLoading(true);
    const result = await getUserOrders(currentUser.uid);
    
    if (result.success) {
      setOrders(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const formatDate = (timestamp) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#6f42c1';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  if (selectedOrder) {
    return (
      <OrderDetails 
        order={selectedOrder} 
        onBack={() => setSelectedOrder(null)} 
      />
    );
  }

  return (
    <div className="order-history">
      <h2>Order History</h2>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button 
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <strong>Order #{order.id.substring(0, 8)}</strong>
                </div>
                <div 
                  className="order-status"
                  style={{ 
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8em'
                  }}
                >
                  {order.status?.toUpperCase() || 'UNKNOWN'}
                </div>
              </div>
              
              <div className="order-info">
                <div className="order-date">
                  <strong>Date:</strong> {formatDate(order.createdAt)}
                </div>
                <div className="order-total">
                  <strong>Total:</strong> ${order.totalAmount?.toFixed(2) || '0.00'}
                </div>
                <div className="order-items-count">
                  <strong>Items:</strong> {order.items?.length || 0} product(s)
                </div>
              </div>
              
              <div className="order-items-preview">
                {order.items?.slice(0, 3).map((item, index) => (
                  <div key={index} className="item-preview">
                    <span>{item.title}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <div className="more-items">
                    +{order.items.length - 3} more items
                  </div>
                )}
              </div>
              
              <div className="order-actions">
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="btn btn-primary"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
