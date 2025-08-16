import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ProductList from '../../components/Products/ProductList';
import ShoppingCart from '../../components/Cart/ShoppingCart';
import * as productService from '../../services/productService';
import * as AuthContext from '../../contexts/AuthContext';

// Mock services and contexts
vi.mock('../../services/productService');
vi.mock('../../contexts/AuthContext');
vi.mock('../../styles/products.css', () => ({}));
vi.mock('../../utils/renderSafe', () => ({
  safeRender: (value, fallback) => value || fallback,
  safePrice: (value) => value || '0.00',
  safeText: (value, fallback) => value || fallback
}));

describe('Cart Integration Tests', () => {
  const mockProduct = {
    id: 'product-123',
    title: 'Test Product for Cart',
    description: 'A product to test cart functionality',
    price: 99.99,
    category: 'electronics',
    image: 'test-product.jpg'
  };

  const mockUser = {
    uid: 'test-user-123',
    email: 'test@example.com'
  };

  let mockLocalStorage;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock localStorage with actual implementation
    mockLocalStorage = {
      store: {},
      getItem: function(key) {
        return this.store[key] || null;
      },
      setItem: function(key, value) {
        this.store[key] = value.toString();
      },
      removeItem: function(key) {
        delete this.store[key];
      },
      clear: function() {
        this.store = {};
      }
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    // Mock AuthContext
    AuthContext.useAuth.mockReturnValue({
      currentUser: mockUser
    });

    // Mock alert
    window.alert = vi.fn();
  });

  test('product is added to cart and cart state is updated', async () => {
    // Mock successful product loading
    productService.getAllProducts.mockResolvedValue({
      success: true,
      data: [mockProduct]
    });

    // Start with empty cart
    mockLocalStorage.setItem('cart', '[]');

    render(<ProductList />);

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByText('Test Product for Cart')).toBeInTheDocument();
    });

    // Check initial cart state
    expect(JSON.parse(mockLocalStorage.getItem('cart'))).toEqual([]);

    // Click "Add to Cart" button
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    // Verify product was added to localStorage
    const cartItems = JSON.parse(mockLocalStorage.getItem('cart'));
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0]).toMatchObject({
      id: 'product-123',
      title: 'Test Product for Cart',
      price: 99.99,
      quantity: 1
    });

    // Verify alert was shown
    expect(window.alert).toHaveBeenCalledWith('Product added to cart!');
  });

  test('adding same product twice increases quantity', async () => {
    // Mock successful product loading
    productService.getAllProducts.mockResolvedValue({
      success: true,
      data: [mockProduct]
    });

    // Start with empty cart
    mockLocalStorage.setItem('cart', '[]');

    render(<ProductList />);

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByText('Test Product for Cart')).toBeInTheDocument();
    });

    const addToCartButton = screen.getByText('Add to Cart');

    // Add product to cart first time
    fireEvent.click(addToCartButton);
    
    let cartItems = JSON.parse(mockLocalStorage.getItem('cart'));
    expect(cartItems[0].quantity).toBe(1);

    // Add same product again
    fireEvent.click(addToCartButton);

    cartItems = JSON.parse(mockLocalStorage.getItem('cart'));
    expect(cartItems).toHaveLength(1); // Still only one item
    expect(cartItems[0].quantity).toBe(2); // But quantity increased
  });

  test('cart displays correct items and calculates total', async () => {
    // Pre-populate cart with test data
    const cartData = [
      { ...mockProduct, quantity: 2 },
      { id: 'product-456', title: 'Second Product', price: 29.99, quantity: 1, category: 'clothing' }
    ];
    mockLocalStorage.setItem('cart', JSON.stringify(cartData));

    render(<ShoppingCart />);

    // Check if cart items are displayed
    await waitFor(() => {
      expect(screen.getByText('Test Product for Cart')).toBeInTheDocument();
      expect(screen.getByText('Second Product')).toBeInTheDocument();
    });

    // Check quantities (cart uses spans, not input fields)
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    // Check total calculation (use regex for flexible matching)
    const expectedTotal = (99.99 * 2 + 29.99 * 1).toFixed(2);
    expect(screen.getByText(/Total:/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(expectedTotal))).toBeInTheDocument();
  });

  test('cart quantity can be updated', async () => {
    // Pre-populate cart
    const cartData = [{ ...mockProduct, quantity: 1 }];
    mockLocalStorage.setItem('cart', JSON.stringify(cartData));

    render(<ShoppingCart />);

    // Wait for cart to load
    await waitFor(() => {
      expect(screen.getByText('Test Product for Cart')).toBeInTheDocument();
    });

    // Find and click increase quantity button
    const increaseButtons = screen.getAllByText('+');
    fireEvent.click(increaseButtons[0]);
    fireEvent.click(increaseButtons[0]); // Click twice to get to quantity 3

    // Verify cart was updated in localStorage
    await waitFor(() => {
      const updatedCart = JSON.parse(mockLocalStorage.getItem('cart'));
      expect(updatedCart[0].quantity).toBe(3);
    });
  });

  test('product can be removed from cart', async () => {
    // Pre-populate cart with multiple items
    const cartData = [
      { ...mockProduct, quantity: 1 },
      { id: 'product-456', title: 'Second Product', price: 29.99, quantity: 1, category: 'clothing' }
    ];
    mockLocalStorage.setItem('cart', JSON.stringify(cartData));

    render(<ShoppingCart />);

    // Wait for cart to load
    await waitFor(() => {
      expect(screen.getByText('Test Product for Cart')).toBeInTheDocument();
      expect(screen.getByText('Second Product')).toBeInTheDocument();
    });

    // Find and click remove button for first item
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    // Verify item was removed from localStorage
    await waitFor(() => {
      const updatedCart = JSON.parse(mockLocalStorage.getItem('cart'));
      expect(updatedCart).toHaveLength(1);
      expect(updatedCart[0].title).toBe('Second Product');
    });
  });

  test('complete cart workflow: add product -> view cart -> update quantity -> remove item', async () => {
    // Start with empty cart
    mockLocalStorage.setItem('cart', '[]');

    // Mock successful product loading
    productService.getAllProducts.mockResolvedValue({
      success: true,
      data: [mockProduct]
    });

    // Step 1: Render ProductList and add product to cart
    const { unmount: unmountProductList } = render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Test Product for Cart')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add to Cart'));

    // Verify product was added
    let cartItems = JSON.parse(mockLocalStorage.getItem('cart'));
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].quantity).toBe(1);

    // Unmount ProductList
    unmountProductList();

    // Step 2: Render ShoppingCart component
    render(<ShoppingCart />);

    await waitFor(() => {
      expect(screen.getByText('Test Product for Cart')).toBeInTheDocument();
    });

    // Step 3: Update quantity by clicking + button
    const increaseButtons = screen.getAllByText('+');
    fireEvent.click(increaseButtons[0]);
    fireEvent.click(increaseButtons[0]);
    fireEvent.click(increaseButtons[0]);
    fireEvent.click(increaseButtons[0]); // Click 4 times to get to quantity 5

    await waitFor(() => {
      cartItems = JSON.parse(mockLocalStorage.getItem('cart'));
      expect(cartItems[0].quantity).toBe(5);
    });

    // Step 4: Remove item
    fireEvent.click(screen.getByText('Remove'));

    await waitFor(() => {
      cartItems = JSON.parse(mockLocalStorage.getItem('cart'));
      expect(cartItems).toHaveLength(0);
    });
  });
});
