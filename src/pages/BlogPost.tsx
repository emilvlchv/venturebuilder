
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, ThumbsUp } from 'lucide-react';
import { blogPosts, BlogPost as BlogPostType } from '@/data/blogPosts';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  
  useEffect(() => {
    // Find the post by slug
    const foundPost = blogPosts.find(p => p.slug === slug);
    
    if (foundPost) {
      setPost(foundPost);
      
      // Find related posts (same category)
      const related = blogPosts
        .filter(p => 
          p.slug !== slug && 
          p.categories.some(cat => foundPost.categories.includes(cat))
        )
        .slice(0, 3);
      
      setRelatedPosts(related);
    } else {
      // Redirect to blog page if post not found
      navigate('/blog');
    }
  }, [slug, navigate]);
  
  if (!post) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
          </Button>
          
          <div className="mb-8">
            <div className="flex gap-2 flex-wrap mb-4">
              {post.categories.map(category => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.authorAvatar} alt={post.author} />
                  <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
          
          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          <div className="flex items-center justify-between mt-8 py-4 border-t border-b">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <ThumbsUp className="mr-1 h-4 w-4" /> Like
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-1 h-4 w-4" /> Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="mr-1 h-4 w-4" /> Save
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{post.likes || 0} likes</span>
            </div>
          </div>
          
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <div key={relatedPost.id} className="bg-secondary/30 rounded-lg overflow-hidden">
                    {relatedPost.image && (
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title} 
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">
                        <Link 
                          to={`/blog/${relatedPost.slug}`} 
                          className="hover:text-primary transition-colors"
                        >
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {relatedPost.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {relatedPost.readTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
