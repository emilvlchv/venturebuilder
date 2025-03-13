
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Get unique categories
  const categories = Array.from(
    new Set(blogPosts.flatMap(post => post.categories))
  );
  
  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      activeCategory === 'all' || 
      post.categories.includes(activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Entrepreneurship Education Hub</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, guides, and resources to help you navigate your entrepreneurial journey
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <div className="w-full md:w-2/3">
              {/* Search and filter */}
              <div className="mb-8">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Tabs defaultValue="all" onValueChange={setActiveCategory}>
                  <TabsList className="mb-4 flex flex-wrap h-auto">
                    <TabsTrigger value="all">All Posts</TabsTrigger>
                    {categories.map(category => (
                      <TabsTrigger key={category} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredPosts.map(post => (
                        <BlogCard key={post.slug} post={post} />
                      ))}
                    </div>
                  </TabsContent>
                  
                  {categories.map(category => (
                    <TabsContent key={category} value={category} className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPosts.map(post => (
                          <BlogCard key={post.slug} post={post} />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <div className="bg-secondary/50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge 
                      key={category}
                      variant="outline" 
                      className="cursor-pointer"
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Subscribe to Our Newsletter</h3>
                <p className="text-muted-foreground mb-4">
                  Get the latest entrepreneurship tips and resources directly in your inbox.
                </p>
                <div className="space-y-3">
                  <Input placeholder="Your email" type="email" />
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const BlogCard = ({ post }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {post.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex gap-2 flex-wrap mb-2">
          {post.categories.map(category => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-xl">
          <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {post.date}
          </span>
          <span className="flex items-center gap-1">
            <User size={14} /> {post.author}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Link 
          to={`/blog/${post.slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Blog;
