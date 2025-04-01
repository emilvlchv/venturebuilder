
import React from 'react';
import { Route, Lightbulb, Users, BadgeCheck, Bell, BarChart, CheckCircle, Search, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: string;
}

const FeatureCard = ({ title, description, icon, delay = '0ms' }: FeatureCardProps) => (
  <div 
    className={cn(
      "p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all",
      "animate-fade-in"
    )}
    style={{ animationDelay: delay }}
  >
    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      title: "Idea Validation",
      description: "Test and validate your business concept with structured frameworks and expert guidance.",
      icon: <CheckCircle size={24} />,
      delay: "50ms"
    },
    {
      title: "Find Your First Customers",
      description: "Follow actionable steps to identify, reach, and convert your first 10 customers.",
      icon: <Target size={24} />,
      delay: "100ms"
    },
    {
      title: "Market Research Tools",
      description: "Access specialized tools to understand your market and validate demand for your product.",
      icon: <Search size={24} />,
      delay: "150ms"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your validation milestones with intuitive tracking and clear next steps.",
      icon: <BarChart size={24} />,
      delay: "200ms"
    },
    {
      title: "Educational Resources",
      description: "Learn essential entrepreneurship concepts through practical, easy-to-understand content.",
      icon: <Lightbulb size={24} />,
      delay: "250ms"
    },
    {
      title: "Community Support",
      description: "Connect with fellow entrepreneurs who are also working to validate their business ideas.",
      icon: <Users size={24} />,
      delay: "300ms"
    }
  ];

  return (
    <div className="py-16 md:py-24 bg-secondary/30">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="h2 mb-4 animate-fade-in">How VentureWay Helps You Succeed</h2>
          <p className="text-lg text-muted-foreground animate-fade-in delay-[50ms]">
            Our platform combines structured guidance, validation tools, and community support to help you find your first 10 customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
