import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkWrapper } from './components/auth/ClerkWrapper';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/layout/Layout';
import GlobalToast from './components/ui/GlobalToast';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CategoryPage from './pages/CategoryPage';
import CourseDetailPage from './pages/CourseDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import './App.css';

function App() {
  return (
    <ClerkWrapper>
      <AuthProvider>
        <FavoritesProvider>
          <ToastProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/course/:courseId" element={<CourseDetailPage />} />
                  <Route path="/category/:categoryName" element={<CategoryPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                </Routes>
              </Layout>
            </Router>
            <GlobalToast />
          </ToastProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ClerkWrapper>
  );
}

export default App;
