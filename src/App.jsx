import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navigation/Navbar';

// Lazy load components for code splitting
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const UserProfile = lazy(() => import('./components/User/UserProfile'));
const ProductList = lazy(() => import('./components/Products/ProductList'));
const ProductForm = lazy(() => import('./components/Products/ProductForm'));
const ShoppingCart = lazy(() => import('./components/Cart/ShoppingCart'));
const OrderHistory = lazy(() => import('./components/Orders/OrderHistory'));

import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import CursorTracker from './components/Effects/CursorTracker';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          
          <main className="main-content">
            <Suspense fallback={<div className="loading-light">Loading...</div>}>
              <Routes>
                <Route path="/" element={<h1>Welcome to Daniel's E-Commerce App</h1>} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/products" element={
                  <ErrorBoundary>
                    <ProductList />
                  </ErrorBoundary>
                } />
                <Route path="/products/new" element={
                  <ErrorBoundary>
                    <ProductForm />
                  </ErrorBoundary>
                } />
                <Route path="/products/edit/:id" element={
                  <ErrorBoundary>
                    <ProductForm />
                  </ErrorBoundary>
                } />
                <Route path="/manage-products" element={
                  <ErrorBoundary>
                    <ProductList showActions={true} />
                  </ErrorBoundary>
                } />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/about" element={<h1>About Us</h1>} />
                <Route path="/contact" element={<h1>Get in touch with us!</h1>} />
              </Routes>
            </Suspense>
          </main>
        </div>
        <CursorTracker />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
