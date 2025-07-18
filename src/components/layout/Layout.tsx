import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatBot from '../chat/ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-8 sm:py-4">
        {children}
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Layout;
