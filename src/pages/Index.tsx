
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  
  // Only redirect admin users to the admin dashboard if they're not coming from admin panel
  // This is determined by checking if there's a fromAdmin state in the location
  const shouldRedirect = isAuthenticated && isAdmin && !location.state?.fromAdmin;
  
  if (shouldRedirect) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* Admin-specific welcome if the user is an admin coming from admin panel */}
        {isAdmin && location.state?.fromAdmin && (
          <div className="bg-primary/5 p-6 my-8 rounded-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-2">Welcome to the Main Site, Administrator</h2>
            <p className="text-muted-foreground">
              You are currently viewing the main site as an administrator. You can return to your 
              admin dashboard using the "Admin Panel" button in the navigation bar.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
