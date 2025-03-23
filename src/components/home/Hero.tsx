
import React from 'react';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70" />
      <div className="absolute bottom-10 -left-20 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl opacity-70" />
      
      <div className="container-padding relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Your entrepreneurial journey starts here
          </div>

          {/* Main headline */}
          <h1 className="h1 mb-6 animate-fade-in">
            Build Your Business with Confidence and Clarity
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in delay-[100ms]">
            A personalized journey that guides you from idea to implementation with expert advice,
            educational resources, and community support.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-[200ms]">
            {isAuthenticated ? (
              <Link to="/journey">
                <Button 
                  size="lg" 
                  icon={<ArrowRight size={18} />} 
                  iconPosition="right"
                >
                  Start Your Journey
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button 
                    size="lg" 
                    icon={<UserPlus size={18} />} 
                    iconPosition="left"
                  >
                    Sign Up
                    <ArrowRight size={18} className="ml-1" />
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button variant="outline" size="lg" icon={<LogIn size={18} />} iconPosition="left">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
            
            <Link to="#entrepreneur-quiz">
              <Button variant="outline" size="lg">
                Find Your Entrepreneur Type
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
