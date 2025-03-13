
import React, { useState } from 'react';
import { SAMPLE_POSTS } from '@/data/communityPosts';
import SearchBar from '@/components/community/SearchBar';
import TagFilter from '@/components/community/TagFilter';
import PostsSection from '@/components/community/PostsSection';
import CallToAction from '@/components/community/CallToAction';
import Layout from '@/components/layout/Layout';

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
    <Layout>
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Community Hub</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow entrepreneurs, share experiences, and learn from each other's journeys.
          </p>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearch={setSearchTerm} 
          />
          <TagFilter 
            tags={allTags} 
            selectedTag={selectedTag} 
            onSelectTag={setSelectedTag} 
          />
        </div>
        
        {/* Featured posts */}
        <PostsSection 
          title="Featured Discussions" 
          posts={featuredPosts} 
          layout="grid" 
        />
        
        {/* Regular posts */}
        <PostsSection 
          title="Recent Discussions" 
          posts={regularPosts} 
        />
        
        {/* Call to action */}
        <CallToAction />
      </div>
    </Layout>
  );
};

export default Community;
