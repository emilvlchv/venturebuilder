
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CommunityCard from '@/components/community/CommunityCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CommunityPost {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  image?: string;
}

const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: 1,
    title: 'How I Secured My First Investor',
    description: 'After months of pitching, I finally got my first yes! Here are the lessons I learned along the way...',
    author: 'Alex Johnson',
    date: '2 days ago',
    likes: 48,
    comments: 12,
    tags: ['Fundraising', 'Pitch Deck'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Marketing on a Zero Budget',
    description: 'Discover how I grew my customer base without spending a dime on marketing...',
    author: 'Sam Wilson',
    date: '1 week ago',
    likes: 124,
    comments: 35,
    tags: ['Marketing', 'Bootstrapping'],
  },
  {
    id: 3,
    title: 'The MVP Mindset: Build Less, Learn More',
    description: 'Why building a minimal viable product saved my startup from failure...',
    author: 'Taylor Smith',
    date: '2 weeks ago',
    likes: 87,
    comments: 19,
    tags: ['Product Development', 'MVP'],
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2940&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Finding Co-Founders: My Journey',
    description: 'The story of how I met my co-founders and built a successful team...',
    author: 'Jordan Lee',
    date: '3 weeks ago',
    likes: 63,
    comments: 22,
    tags: ['Team Building', 'Co-Founders'],
  },
  {
    id: 5,
    title: 'Legal Essentials for New Startups',
    description: 'A beginner\'s guide to the legal requirements when starting your business...',
    author: 'Casey Morgan',
    date: '1 month ago',
    likes: 105,
    comments: 41,
    tags: ['Legal', 'Business Formation'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2940&auto=format&fit=crop'
  },
];

const Community = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(SAMPLE_POSTS.flatMap(post => post.tags))
  );
  
  // Filter posts based on search and tag
  const filteredPosts = SAMPLE_POSTS.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });
  
  // Split posts into featured and regular
  const featuredPosts = filteredPosts.slice(0, 2);
  const regularPosts = filteredPosts.slice(2);

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Community Hub</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with fellow entrepreneurs, share experiences, and learn from each other's journeys.
        </p>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedTag === null ? "default" : "outline"}
            onClick={() => setSelectedTag(null)}
            size="sm"
          >
            All
          </Button>
          {allTags.map((tag, index) => (
            <Button
              key={index}
              variant={selectedTag === tag ? "default" : "outline"}
              onClick={() => setSelectedTag(tag)}
              size="sm"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Featured posts */}
      <h2 className="text-2xl font-semibold mb-4">Featured Discussions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {featuredPosts.map((post) => (
          <CommunityCard 
            key={post.id}
            title={post.title}
            description={post.description}
            author={post.author}
            date={post.date}
            likes={post.likes}
            comments={post.comments}
            tags={post.tags}
            image={post.image}
          />
        ))}
      </div>
      
      {/* Regular posts */}
      <h2 className="text-2xl font-semibold mb-4">Recent Discussions</h2>
      <div className="grid grid-cols-1 gap-6">
        {regularPosts.map((post) => (
          <CommunityCard 
            key={post.id}
            title={post.title}
            description={post.description}
            author={post.author}
            date={post.date}
            likes={post.likes}
            comments={post.comments}
            tags={post.tags}
            image={post.image}
          />
        ))}
      </div>
      
      {/* Call to action */}
      <div className="mt-12 text-center">
        <p className="mb-4 text-muted-foreground">Have something to share with the community?</p>
        <Button variant="default">Start a Discussion</Button>
      </div>
    </div>
  );
};

export default Community;
