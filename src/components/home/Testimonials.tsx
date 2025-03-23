
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
  rating: number;
  category: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Founder",
    company: "EcoTech Solutions",
    content: "This platform guided me from a vague idea to a validated business model in just two months. The personalized journey and AI suggestions were game-changers for my startup.",
    avatar: "/lovable-uploads/397b5fd1-2dde-4adf-b3cf-9ae9e5f2a93e.png",
    rating: 5,
    category: "Tech"
  },
  {
    id: 2,
    name: "Sophia Chen",
    role: "CEO",
    company: "Artisan Marketplace",
    content: "As a creative with no business background, I was intimidated by the entrepreneurial process. This platform broke everything down into manageable steps and gave me the confidence to launch my business.",
    avatar: "/lovable-uploads/5ca2a881-98be-484e-bdce-0e5588eeb74a.png",
    rating: 5,
    category: "E-commerce"
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Founder",
    company: "HealthPlus",
    content: "The community aspect of this platform is invaluable. I connected with mentors who helped me navigate the healthcare industry regulations and found partners who complemented my skills.",
    avatar: "/lovable-uploads/cae0f508-f4c9-45e7-ab61-8073354f43fa.png",
    rating: 4,
    category: "Healthcare"
  },
  {
    id: 4,
    name: "Priya Patel",
    role: "Founder & CEO",
    company: "SustainStyle",
    content: "The educational resources helped me understand the complexities of supply chain management for my sustainable fashion brand. I couldn't have done it without this platform's guidance.",
    avatar: "/lovable-uploads/4e9daaea-6b6d-4f93-9b88-36c9f40790b8.png",
    rating: 5,
    category: "Fashion"
  },
  {
    id: 5,
    name: "David Wilson",
    role: "Co-founder",
    company: "LocalEats",
    content: "From business plan to investor pitch, this platform provided templates and feedback that helped us secure our first round of funding. The journey planning feature kept us on track.",
    avatar: "/lovable-uploads/e992d80e-c485-491a-90a1-e77c7f9a396d.png",
    rating: 5,
    category: "Food & Beverage"
  },
  {
    id: 6,
    name: "Olivia Martinez",
    role: "Founder",
    company: "EduPlatform",
    content: "The AI-powered business idea generator helped me identify a niche in the education market that I hadn't considered. Now we're growing 20% month over month thanks to that initial insight.",
    avatar: "/lovable-uploads/fed329d4-6ab4-4c2e-bbf3-12167f17f15b.png",
    rating: 4,
    category: "Education"
  }
];

const TestimonialCard = ({ testimonial, delay = '0ms' }: { testimonial: Testimonial; delay?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), parseInt(delay));
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <Card 
      className={cn(
        "h-full border-none shadow-md hover:shadow-lg transition-all duration-500",
        "bg-gradient-to-br from-white to-secondary/30",
        "opacity-0 translate-y-4",
        isVisible && "opacity-100 translate-y-0"
      )}
      style={{ 
        transitionDelay: delay,
        transitionProperty: 'all',
        transitionDuration: '0.5s',
        transitionTimingFunction: 'ease-out',
      }}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/10">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{testimonial.name}</p>
              <p className="text-muted-foreground text-xs">{testimonial.role}, {testimonial.company}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            {testimonial.category}
          </Badge>
        </div>
        
        <p className="text-muted-foreground italic flex-grow mb-4">"{testimonial.content}"</p>
        
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < testimonial.rating ? "text-amber-500 fill-amber-500" : "text-muted"} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="h2 mb-4 animate-fade-in">Success Stories from Our Community</h2>
          <p className="text-lg text-muted-foreground animate-fade-in delay-[50ms]">
            Hear from entrepreneurs who transformed their ideas into thriving businesses with our platform
          </p>
        </div>
        
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.id} 
                testimonial={testimonial} 
                delay={`${index * 100}ms`}
              />
            ))}
          </div>
        </div>
        
        {/* Mobile carousel */}
        <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious className="relative static left-auto translate-y-0 rounded-full" />
              <CarouselNext className="relative static right-auto translate-y-0 rounded-full" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
