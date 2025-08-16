import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navigation/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfile from './components/User/UserProfile';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import ShoppingCart from './components/Cart/ShoppingCart';
import OrderHistory from './components/Orders/OrderHistory';

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
          </main>
        </div>
        <CursorTracker />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
