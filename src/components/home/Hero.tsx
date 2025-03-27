
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';

const Hero = () => {
  return (
    <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-b from-[#7563E3] via-[#5E49DD] to-[#0a254d]">
      <div className="container-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
          {/* Left content - Text */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-6 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-white mr-2"></span>
              Your entrepreneurial journey starts here
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              BUILD YOUR<br />
              BUSINESS WITH<br />
              <span className="text-white">CONFIDENCE<br />
              AND CLARITY</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-white/80 mb-8 max-w-lg animate-fade-in delay-[100ms]">
              A personalized journey that guides you from idea to implementation with expert advice,
              educational resources, and community support.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 animate-fade-in delay-[200ms]">
              <Link to="/journey">
                <Button 
                  size="lg" 
                  icon={<ArrowRight size={18} />} 
                  iconPosition="right"
                  className="bg-white text-brand-main hover:bg-white/90"
                >
                  Start Your Journey
                </Button>
              </Link>
              <a href="#interactive-tools">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Find Your Entrepreneur Type
                </Button>
              </a>
            </div>
          </div>
          
          {/* Right content - Image */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in delay-[300ms]">
            <img 
              src="/public/lovable-uploads/f41dc001-eb62-448a-b6c1-566feab5513a.png" 
              alt="Rocket illustration representing business growth" 
              className="w-full max-w-md lg:max-w-lg xl:max-w-xl object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
