
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';

const Index = () => {
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
