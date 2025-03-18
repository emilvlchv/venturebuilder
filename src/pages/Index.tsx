
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  
  // Admin redirect logic
  const fromAdmin = location.state?.fromAdmin === true;
  const shouldRedirect = isAuthenticated && isAdmin && !fromAdmin;
  
  if (shouldRedirect) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* Admin welcome message */}
        {isAdmin && fromAdmin && (
          <div className="container-padding my-8">
            <Alert className="bg-primary/5 border-primary/20">
              <AlertTitle className="text-xl font-bold text-primary">
                Welcome to the Main Site, Administrator
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">
                You are currently viewing the main site as an administrator. You can return to your
                admin dashboard using the "Admin Panel" button in the navigation bar.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
