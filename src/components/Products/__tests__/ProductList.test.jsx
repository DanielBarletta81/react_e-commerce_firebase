import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ProductList from '../ProductList';
import * as productService from '../../../services/productService';
import * as AuthContext from '../../../contexts/AuthContext';

// Mock the product service
vi.mock('../../../services/productService');
vi.mock('../../../contexts/AuthContext');

// Mock CSS imports
vi.mock('../../../styles/products.css', () => ({}));
vi.mock('../../../utils/renderSafe', () => ({
  safeRender: (value, fallback) => value || fallback,
  safePrice: (value) => value || '0.00',
  safeText: (value, fallback) => value || fallback
}));

describe('ProductList Component', () => {
  const mockProducts = [
    {
      id: '1',
      title: 'Test Product 1',
      description: 'Test description 1',
      price: 29.99,
      category: 'electronics',
      image: 'test-image-1.jpg'
    },
    {
      id: '2',
      title: 'Test Product 2',
      description: 'Test description 2',
      price: 49.99,
      category: 'clothing',
      image: 'test-image-2.jpg'
    }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => '[]'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true
    });

    // Mock AuthContext
    AuthContext.useAuth.mockReturnValue({
      currentUser: { uid: 'test-user-id' }
    });
  });

  test('renders loading state initially', () => {
    // Mock getAllProducts to return a promise that doesn't resolve immediately
    productService.getAllProducts.mockReturnValue(new Promise(() => {}));

    render(<ProductList />);
    
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  test('renders products when loaded successfully', async () => {
    // Mock successful product loading
    productService.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });

    render(<ProductList />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    // Check if prices are displayed
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();

    // Check if categories are displayed
    expect(screen.getByText('electronics')).toBeInTheDocument();
    expect(screen.getByText('clothing')).toBeInTheDocument();
  });

  test('renders error message when product loading fails', async () => {
    // Mock failed product loading
    productService.getAllProducts.mockResolvedValue({
      success: false,
      error: 'Failed to load products'
    });

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load products')).toBeInTheDocument();
    });
  });

  test('renders "no products" message when product list is empty', async () => {
    // Mock empty product list
    productService.getAllProducts.mockResolvedValue({
      success: true,
      data: []
    });

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('No products available.')).toBeInTheDocument();
    });
  });

  test('adds product to cart when "Add to Cart" button is clicked', async () => {
    // Mock successful product loading
    productService.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });

    // Mock alert
    window.alert = vi.fn();

    render(<ProductList />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    // Click "Add to Cart" button for first product
    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);

    // Check if localStorage.setItem was called
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      expect.stringContaining('Test Product 1')
    );

    // Check if alert was shown
    expect(window.alert).toHaveBeenCalledWith('Product added to cart!');
  });

  test('shows actions when showActions prop is true and user is logged in', async () => {
    // Mock successful product loading
    productService.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });

    render(<ProductList showActions={true} />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Add New Product')).toBeInTheDocument();
    });

    // Check if Edit and Delete buttons are present
    expect(screen.getAllByText('Edit')).toHaveLength(mockProducts.length);
    expect(screen.getAllByText('Delete')).toHaveLength(mockProducts.length);
  });

  test('deletes product when delete button is clicked and confirmed', async () => {
    // Mock successful product loading
    productService.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });

    // Mock successful product deletion
    productService.deleteProduct.mockResolvedValue({
      success: true
    });

    // Mock window.confirm to return true
    window.confirm = vi.fn(() => true);

    render(<ProductList showActions={true} />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    // Click delete button for first product
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this product?');

    // Check if deleteProduct service was called
    expect(productService.deleteProduct).toHaveBeenCalledWith('1');
  });
});
