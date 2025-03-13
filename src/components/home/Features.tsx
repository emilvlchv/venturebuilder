
import React from 'react';
import { Route, Lightbulb, Users, BadgeCheck, Bell, BarChart } from 'lucide-react';
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
      title: "Personalized Journey",
      description: "Get a customized step-by-step roadmap tailored to your business idea and personal strengths.",
      icon: <Route size={24} />,
      delay: "50ms"
    },
    {
      title: "Educational Hub",
      description: "Access curated resources, guides, and courses designed for entrepreneurs at any stage.",
      icon: <Lightbulb size={24} />,
      delay: "100ms"
    },
    {
      title: "Community Support",
      description: "Connect with fellow entrepreneurs, mentors, and experts who can provide guidance and feedback.",
      icon: <Users size={24} />,
      delay: "150ms"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your growth with intuitive progress visualizations and milestone tracking.",
      icon: <BarChart size={24} />,
      delay: "200ms"
    },
    {
      title: "Achievement Badges",
      description: "Earn recognition for completing key steps in your entrepreneurial journey.",
      icon: <BadgeCheck size={24} />,
      delay: "250ms"
    },
    {
      title: "Smart Notifications",
      description: "Stay motivated with timely reminders and updates about your progress and new opportunities.",
      icon: <Bell size={24} />,
      delay: "300ms"
    }
  ];

  return (
    <div className="py-16 md:py-24 bg-secondary/30">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="h2 mb-4 animate-fade-in">Everything You Need to Succeed</h2>
          <p className="text-lg text-muted-foreground animate-fade-in delay-[50ms]">
            Our platform combines AI-powered guidance, educational resources, and community support to help you navigate the challenges of entrepreneurship.
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
