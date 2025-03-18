
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  // Redirect admin users to the admin dashboard
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* Testimonials section could go here */}
        
        {/* How it works section could go here */}
        
        {/* CTA section could go here */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
