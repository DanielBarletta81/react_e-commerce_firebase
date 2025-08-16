import '@testing-library/jest-dom';
import React from 'react';

// Mock Firebase
const mockFirestore = {
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn()
};

vi.mock('../config/firebase', () => ({
  db: mockFirestore,
  auth: {}
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn()
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  Link: ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children),
  BrowserRouter: ({ children }) => React.createElement('div', null, children),
  Routes: ({ children }) => React.createElement('div', null, children),
  Route: () => null
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock window.alert
global.alert = vi.fn();
global.confirm = vi.fn(() => true);
