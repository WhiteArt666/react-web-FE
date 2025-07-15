import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkWrapper } from './components/auth/ClerkWrapper';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/layout/Layout';
import GlobalToast from './components/ui/GlobalToast';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CategoryPage from './pages/CategoryPage';
import CourseDetailPage from './pages/CourseDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import CartPage from './pages/CartPage';
import './App.css';

function App() {
  return (
    <ClerkWrapper>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <ToastProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/course/:courseId" element={<CourseDetailPage />} />
                    <Route path="/category/:categoryName" element={<CategoryPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/cart" element={<CartPage />} />
                  </Routes>
                </Layout>
              </Router>
              <GlobalToast />
            </ToastProvider>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ClerkWrapper>
  );
}

export default App;
