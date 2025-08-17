# 🛒 React E-Commerce Firebase App

A modern, full-stack e-commerce application built with React 19 and Firebase, featuring a stunning cyberpunk-inspired design with interactive cursor effects.

## 🚀 [Live Demo](https://react-e-commerce-firebase.vercel.app/)

## ✨ Features

- **🛍️ Product Catalog** - Browse and manage products with advanced filtering
- **🛒 Shopping Cart** - Add, remove, and update quantities with persistent storage
- **👤 User Authentication** - Secure login/register with Firebase Auth
- **📱 Responsive Design** - Mobile-friendly with modern CSS animations
- **🎨 Interactive UI** - Cursor-tracking effects and raised card animations
- **📊 Order Management** - Complete order history and tracking
- **🧪 Test Coverage** - 20 comprehensive tests with TDD approach

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router
- **Backend**: Firebase Firestore, Firebase Auth
- **Styling**: Custom CSS with CSS Variables, Inter Font
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel, GitHub Actions CI/CD

## 🎮 Quick Start

```bash
# Clone repository
git clone https://github.com/DanielBarletta81/react_e-commerce_firebase.git
cd react_e-commerce_firebase

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your Firebase configuration

# Start development server
npm run dev
```

## 🧪 Testing

```bash
# Run all tests
npm test -- --run

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🔧 Environment Variables

Create a `.env.local` file with your Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🎯 Key Routes

- `/` - Welcome page
- `/products` - Product catalog
- `/cart` - Shopping cart
- `/profile` - User profile management
- `/orders` - Order history

## 📱 Design Features

- **Dark Theme**: Cyberpunk-inspired with neon accents
- **Light Theme**: Clean profile sections with soft gradients
- **Animations**: Cursor-tracking ripples and hover effects
- **Typography**: Modern Inter font with gradient text effects
- **Responsive**: Optimized for all screen sizes

## 🔒 Security

- Environment-based configuration
- Cleaned git history (no exposed secrets)
- Firebase security rules
- Secure authentication flow

---

Built with ❤️ by [Daniel Barletta](https://github.com/DanielBarletta81)
