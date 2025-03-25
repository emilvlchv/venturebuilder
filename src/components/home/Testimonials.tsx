
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';

type TestimonialProps = {
  quote: string;
  name: string;
  title: string;
  company?: string;
  avatarUrl?: string;
  initials: string;
};

const testimonials: TestimonialProps[] = [
  {
    quote: "VentureWay helped me transform my side hustle into a thriving business. The step-by-step guidance made complex business concepts easy to understand and implement.",
    name: "Sarah Johnson",
    title: "Founder",
    company: "EcoStyle Living",
    initials: "SJ",
    avatarUrl: "/lovable-uploads/5ca2a881-98be-484e-bdce-0e5588eeb74a.png"
  },
  {
    quote: "As a first-time entrepreneur, I was overwhelmed by everything I needed to do. VentureWay broke it down into manageable steps and their AI assistant was there whenever I had questions.",
    name: "Michael Rodriguez",
    title: "CEO",
    company: "TechBridge Solutions",
    initials: "MR",
    avatarUrl: "/lovable-uploads/397b5fd1-2dde-4adf-b3cf-9ae9e5f2a93e.png"
  },
  {
    quote: "The personalized journey mapped out for my business idea was incredibly valuable. It saved me months of research and helped me avoid common pitfalls.",
    name: "Lisa Chen",
    title: "Co-founder",
    company: "Wellness Collective",
    initials: "LC",
    avatarUrl: "/lovable-uploads/fed329d4-6ab4-4c2e-bbf3-12167f17f15b.png"
  }
];

const TestimonialCard: React.FC<TestimonialProps> = ({
  quote,
  name,
  title,
  company,
  avatarUrl,
  initials
}) => (
  <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-border/50 h-full flex flex-col">
    <div className="mb-6 text-accent opacity-80">
      <Quote size={32} />
    </div>
    
    <p className="mb-6 italic text-muted-foreground flex-grow">{quote}</p>
    
    <div className="flex items-center">
      <Avatar className="h-12 w-12 mr-4">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
      </Avatar>
      
      <div>
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">
          {title}{company ? `, ${company}` : ''}
        </p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="h2 mb-4">What Our Entrepreneurs Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have turned their ideas into thriving businesses with our guidance.
          </p>
        </div>
        
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
        
        {/* Mobile carousel view */}
        <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <TestimonialCard {...testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-6">
              <CarouselPrevious className="relative static mr-2" />
              <CarouselNext className="relative static ml-2" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
