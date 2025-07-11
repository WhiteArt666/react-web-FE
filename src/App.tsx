import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkWrapper } from './components/auth/ClerkWrapper';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CategoryPage from './pages/CategoryPage';
import CourseDetailPage from './pages/CourseDetailPage';
import './App.css';

function App() {
  return (
    <ClerkWrapper>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/course/:courseId" element={<CourseDetailPage />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
              </Routes>
            </Layout>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </ClerkWrapper>
  );
}

export default App;
