
import React from 'react';
import { Users, Star, TrendingUp } from 'lucide-react';

const SocialProof = () => {
  return (
    <section className="py-12 bg-white border-y border-border/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="h3 mb-2">Trusted by Entrepreneurs Worldwide</h2>
          <div className="w-20 h-1 bg-primary/20 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-primary/5 rounded-full p-4 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">1,000+</h3>
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
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
