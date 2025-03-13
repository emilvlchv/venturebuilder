
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Search, BookOpen, FileText, PlayCircle, BookMarked, ChevronRight } from 'lucide-react';
import Button from '@/components/shared/Button';
import { cn } from '@/lib/utils';

interface ResourceCardProps {
  title: string;
  description: string;
  category: string;
  image: string;
  type: 'article' | 'video' | 'guide';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
}

const ResourceCard = ({ title, description, category, image, type, level, duration }: ResourceCardProps) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'article': return <FileText size={16} />;
      case 'video': return <PlayCircle size={16} />;
      case 'guide': return <BookMarked size={16} />;
      default: return <FileText size={16} />;
    }
  };
  
  const getLevelColor = () => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card overflow-hidden transition-all hover:shadow-md animate-fade-in">
      <div className="aspect-video bg-secondary relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <div className="absolute top-3 left-3 flex space-x-2">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            getLevelColor()
          )}>
            {level}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">{category}</span>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {getTypeIcon()}
            <span>{duration}</span>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <Button
          variant="outline"
          size="sm"
          icon={<ChevronRight size={14} />}
          iconPosition="right"
          className="w-full"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};

const Education = () => {
  // Mock data for resources
  const resources: ResourceCardProps[] = [
    {
      title: "Validating Your Business Idea",
      description: "Learn how to test and validate your business idea before investing time and money.",
      category: "Market Research",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      type: "guide",
      level: "beginner",
      duration: "15 min read"
    },
    {
      title: "Creating Your First Business Plan",
      description: "A step-by-step approach to writing a business plan that will help you secure funding.",
      category: "Planning",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      type: "article",
      level: "beginner",
      duration: "10 min read"
    },
    {
      title: "Finding Your Target Audience",
      description: "Strategies for identifying and connecting with your ideal customers.",
      category: "Marketing",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      type: "video",
      level: "intermediate",
      duration: "25 min watch"
    },
    {
      title: "Effective Social Media Marketing",
      description: "Learn how to leverage social media platforms to grow your business.",
      category: "Marketing",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      type: "guide",
      level: "intermediate",
      duration: "20 min read"
    },
    {
      title: "Fundraising Strategies for Startups",
      description: "Explore different funding options to help your business get off the ground.",
      category: "Finance",
      image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      type: "article",
      level: "advanced",
      duration: "12 min read"
    },
    {
      title: "Building a Minimum Viable Product",
      description: "How to create an MVP that validates your business idea with minimal resources.",
      category: "Product Development",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      type: "video",
      level: "intermediate",
      duration: "30 min watch"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="h2 mb-4 animate-fade-in">Educational Resources</h1>
            <p className="text-lg text-muted-foreground animate-fade-in delay-[50ms]">
              Curated content to help you learn everything you need to know about starting and growing your business.
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="relative animate-fade-in delay-[100ms]">
              <input
                type="text"
                placeholder="Search for resources..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-card-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-fade-in delay-[150ms]">
            {['All Topics', 'Marketing', 'Finance', 'Product Development', 'Planning', 'Leadership'].map((category) => (
              <button
                key={category}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm transition-all",
                  category === 'All Topics' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Featured resources */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Popular Resources</h2>
              <Button variant="ghost" size="sm" icon={<ChevronRight size={16} />} iconPosition="right">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <ResourceCard key={index} {...resource} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Education;
