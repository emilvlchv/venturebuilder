
import React from 'react';
import { Users, Award, TrendingUp, Sparkles, Star } from 'lucide-react';

const SocialProof = () => {
  return (
    <section className="py-12 bg-white border-y border-border/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="h3 mb-2">Trusted by Entrepreneurs Worldwide</h2>
          <div className="w-20 h-1 bg-primary/20 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-primary/5 rounded-full p-4 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">10,000+</h3>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-primary/5 rounded-full p-4 mb-4">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">4.8/5</h3>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-primary/5 rounded-full p-4 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">85%</h3>
            <p className="text-muted-foreground">Success Rate</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-primary/5 rounded-full p-4 mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">15+</h3>
            <p className="text-muted-foreground">Industry Awards</p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-lg font-medium mb-6">Featured In</h3>
          <div className="flex justify-center flex-wrap gap-8 items-center opacity-70">
            <div className="grayscale hover:grayscale-0 transition-all">
              <img 
                src="/lovable-uploads/e992d80e-c485-491a-90a1-e77c7f9a396d.png" 
                alt="Forbes" 
                className="h-8 object-contain"
              />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all">
              <img 
                src="/lovable-uploads/cae0f508-f4c9-45e7-ab61-8073354f43fa.png" 
                alt="TechCrunch" 
                className="h-8 object-contain" 
              />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all">
              <img 
                src="/lovable-uploads/4e9daaea-6b6d-4f93-9b88-36c9f40790b8.png" 
                alt="Entrepreneur" 
                className="h-8 object-contain" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
