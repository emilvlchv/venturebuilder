
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    rating: 5,
    category: "Tech"
  },
  {
    id: 2,
    name: "Sophia Chen",
    role: "CEO",
    company: "Artisan Marketplace",
    content: "As a creative with no business background, I was intimidated by the entrepreneurial process. This platform broke everything down into manageable steps and gave me the confidence to launch my business.",
    rating: 5,
    category: "E-commerce"
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Founder",
    company: "HealthPlus",
    content: "The community aspect of this platform is invaluable. I connected with mentors who helped me navigate the healthcare industry regulations and found partners who complemented my skills.",
    rating: 4,
    category: "Healthcare"
  },
  {
    id: 4,
    name: "Priya Patel",
    role: "Founder & CEO",
    company: "SustainStyle",
    content: "The educational resources helped me understand the complexities of supply chain management for my sustainable fashion brand. I couldn't have done it without this platform's guidance.",
    rating: 5,
    category: "Fashion"
  },
  {
    id: 5,
    name: "David Wilson",
    role: "Co-founder",
    company: "LocalEats",
    content: "From business plan to investor pitch, this platform provided templates and feedback that helped us secure our first round of funding. The journey planning feature kept us on track.",
    rating: 5,
    category: "Food & Beverage"
  },
  {
    id: 6,
    name: "Olivia Martinez",
    role: "Founder",
    company: "EduPlatform",
    content: "The AI-powered business idea generator helped me identify a niche in the education market that I hadn't considered. Now we're growing 20% month over month thanks to that initial insight.",
    rating: 4,
    category: "Education"
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <Card 
      className={cn(
        "h-full border-none shadow-md",
        "bg-gradient-to-br from-white to-secondary/30"
      )}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-muted-foreground text-sm">{testimonial.role}, {testimonial.company}</p>
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
    <section className="py-16 md:py-24 overflow-hidden bg-secondary/10">
      <div className="container-padding">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="h2 mb-4 animate-fade-in">Success Stories from Our Community</h2>
          <p className="text-lg text-muted-foreground animate-fade-in delay-[50ms]">
            Hear from entrepreneurs who transformed their ideas into thriving businesses with our platform
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full" opts={{ loop: true, align: "center" }}>
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-4/5 lg:basis-3/4">
                  <div className="p-1">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
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
