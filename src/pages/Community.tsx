import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CommunityCard from '@/components/community/CommunityCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface CommunityPost {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  replies: number;
  likes: number;
}

const Community = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 1,
      title: "Best Resources for New Entrepreneurs",
      author: "Daria Lazarova",
      date: "2024-03-15",
      content: "I've compiled a list of the best free resources that helped me when I was starting my first business. Check it out and let me know what you think!",
      replies: 15,
      likes: 42
    },
    {
      id: 2,
      title: "Seeking Feedback on My Business Plan",
      author: "Emil Valchev",
      date: "2024-03-10",
      content: "I'm looking for constructive criticism on my business plan. Any advice on market analysis or financial projections would be greatly appreciated!",
      replies: 8,
      likes: 28
    },
    {
      id: 3,
      title: "How to Overcome Imposter Syndrome",
      author: "Dimitrina Pashova",
      date: "2024-03-05",
      content: "Imposter syndrome can be a real challenge for entrepreneurs. Here are some strategies that have helped me build confidence and stay motivated.",
      replies: 22,
      likes: 61
    },
    {
      id: 4,
      title: "Networking Opportunities for Startups",
      author: "Filip Andonov",
      date: "2024-02-28",
      content: "I'm sharing a list of upcoming networking events and conferences for startups. These are great opportunities to connect with investors, mentors, and potential partners.",
      replies: 12,
      likes: 35
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          <div className="max-w-5xl mx-auto">
            <h1 className="h2 mb-8 md:mb-12 text-center animate-fade-in">
              Connect, Share, and Grow Together
            </h1>

            {/* Search Bar */}
            <div className="mb-6 md:mb-8 animate-fade-in delay-[50ms]">
              <Input
                type="text"
                placeholder="Search for posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2 mx-auto"
              />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="recent" className="w-full animate-fade-in delay-[100ms]">
              <TabsList className="w-full md:w-1/2 mx-auto bg-secondary/50 rounded-lg p-1 flex justify-between">
                <TabsTrigger value="recent" className="data-[state=active]:bg-background">
                  Recent
                </TabsTrigger>
                <TabsTrigger value="popular" className="data-[state=active]:bg-background">
                  Popular
                </TabsTrigger>
              </TabsList>
              <TabsContent value="recent" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <CommunityCard key={post.id} post={post} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="popular" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Display popular posts here (e.g., based on likes or replies) */}
                  {filteredPosts
                    .sort((a, b) => b.likes - a.likes) // Sort by likes
                    .map((post) => (
                      <CommunityCard key={post.id} post={post} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* CTA for creating a post */}
            <div className="text-center mt-12 animate-fade-in delay-[150ms]">
              <Button variant="primary" size="lg" icon={<MessageSquare size={20} />} iconPosition="left">
                Start a Discussion
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
