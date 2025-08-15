import React from 'react';

const OrderDetails = ({ order, onBack }) => {
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

  const calculateItemTotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  return (
    <div className="order-details">
      <div className="order-details-header">
        <button onClick={onBack} className="back-btn">
          ← Back to Orders
        </button>
        <h2>Order Details</h2>
      </div>
      
      <div className="order-summary">
        <div className="order-info-grid">
          <div className="info-item">
            <label>Order ID:</label>
            <span>#{order.id}</span>
          </div>
          <div className="info-item">
            <label>Status:</label>
            <span 
              className="status-badge"
              style={{ 
                backgroundColor: getStatusColor(order.status),
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              {order.status?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
          <div className="info-item">
            <label>Order Date:</label>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="info-item">
            <label>Total Amount:</label>
            <span className="total-amount">${order.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>
      
      {order.shippingAddress && (
        <div className="shipping-info">
          <h3>Shipping Information</h3>
          <p>{order.shippingAddress}</p>
        </div>
      )}
      
      {order.paymentMethod && (
        <div className="payment-info">
          <h3>Payment Method</h3>
          <p>{order.paymentMethod}</p>
        </div>
      )}
      
      <div className="order-items-section">
        <h3>Order Items</h3>
        <div className="items-table">
          <div className="table-header">
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total</div>
          </div>
          
          {order.items?.map((item, index) => (
            <div key={index} className="table-row">
              <div className="item-info">
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.title} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="item-details">
                  <h4>{item.title}</h4>
                  <p className="item-category">{item.category}</p>
                </div>
              </div>
              <div className="item-price">${item.price}</div>
              <div className="item-quantity">{item.quantity}</div>
              <div className="item-total">${calculateItemTotal(item)}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="order-total-section">
        <div className="total-breakdown">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>${order.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="total-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="total-row final-total">
            <strong>
              <span>Total:</span>
              <span>${order.totalAmount?.toFixed(2) || '0.00'}</span>
            </strong>
          </div>
        </div>
      </div>
      
      {order.orderNotes && (
        <div className="order-notes">
          <h3>Order Notes</h3>
          <p>{order.orderNotes}</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
