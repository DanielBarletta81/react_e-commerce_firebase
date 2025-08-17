import React, { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct } from '../../services/productService';
import { useAuth } from '../../contexts/AuthContext';
import { useToastContext } from '../../contexts/ToastContext';
import { Link } from 'react-router-dom';
import { safeRender, safePrice, safeText } from '../../utils/renderSafe';
import '../../styles/products.css';

const ProductList = ({ showActions = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToastContext();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const result = await getAllProducts();
    
    if (result.success) {
      setProducts(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    const result = await deleteProduct(productId);
    if (result.success) {
      setProducts(products.filter(p => p.id !== productId));
      showSuccess('Product deleted successfully!');
    } else {
      showError(`Failed to delete product: ${result.error}`);
    }
  };

  const addToCart = (product) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(existingCart));
    showSuccess(`🛒 ${product.title} added to cart!`, 2500);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Products</h2>
        {showActions && currentUser && (
          <Link to="/products/new" className="btn btn-primary">
            Add New Product
          </Link>
        )}
      </div>
      
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.title} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              
              <div className="product-info">
              <h3 className="product-title">{safeText(product.title, 'No Title')}</h3>
              <p className="product-category">{safeText(product.category, 'No Category')}</p>
              <p className="product-description">
              {safeText(product.description?.substring(0, 100), 'No Description')}...
              </p>
              <div className="product-price">${safePrice(product.price)}</div>
                
                <div className="product-actions">
                  {currentUser && (
                    <button 
                      onClick={() => addToCart(product)}
                      className="btn btn-primary"
                    >
                      Add to Cart
                    </button>
                  )}
                  
                  {showActions && (
                    <>
                      <Link 
                        to={`/products/edit/${product.id}`}
                        className="btn btn-secondary"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
