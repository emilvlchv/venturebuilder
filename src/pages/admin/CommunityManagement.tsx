
import React, { useState, useEffect } from 'react';
import { SAMPLE_POSTS } from '@/data/communityPosts';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Edit,
  MoreHorizontal,
  Trash2,
  Plus,
  Search,
  Eye,
  Tags,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import the CommunityPost type
import { CommunityPost } from '@/components/community/types';

const CommunityManagement: React.FC = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newTags, setNewTags] = useState('');
  const [newPost, setNewPost] = useState<Partial<CommunityPost>>({
    title: '',
    description: '',
    content: '',
    author: {
      name: '',
      role: ''
    },
    tags: [],
    featured: false
  });

  // Load posts on component mount
  useEffect(() => {
    // If in a real app, we'd load from an API or database
    // For now, we'll use the sample data
    setPosts(SAMPLE_POSTS);
    
    // Attempt to load from localStorage if available
    const storedPosts = localStorage.getItem('community_posts');
    if (storedPosts) {
      try {
        const parsedPosts = JSON.parse(storedPosts);
        // Ensure each post has the required structure
        const validatedPosts = parsedPosts.map((post: any) => ({
          ...post,
          id: post.id || Math.floor(Math.random() * 1000),
          likes: Number(post.likes || 0),
          comments: Number(post.comments || 0),
          featured: Boolean(post.featured || false),
          author: typeof post.author === 'string' 
            ? { name: post.author, role: '' } 
            : post.author || { name: 'Anonymous', role: '' }
        }));
        setPosts(validatedPosts);
      } catch (error) {
        console.error('Error loading community posts:', error);
        setPosts(SAMPLE_POSTS);
      }
    } else {
      // Initialize localStorage with sample data
      localStorage.setItem('community_posts', JSON.stringify(SAMPLE_POSTS));
    }
  }, []);

  // Filter posts based on search
  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.author.name.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  // Save posts to localStorage
  const savePosts = (updatedPosts: CommunityPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
  };

  // Handle creating a new post
  const handleCreatePost = () => {
    try {
      // Validate required fields
      if (!newPost.title || !newPost.description || !newPost.author?.name) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields.",
        });
        return;
      }

      // Parse tags from the input
      const tags = newTags.split(',').map(tag => tag.trim()).filter(tag => tag);

      // Create a new post object
      const post: CommunityPost = {
        id: Date.now(),
        title: newPost.title || '',
        description: newPost.description || '',
        content: newPost.content || '',
        author: newPost.author,
        date: new Date().toISOString(),
        tags: tags,
        comments: 0,
        likes: 0,
        featured: newPost.featured || false,
      };

      // Add to post list
      const updatedPosts = [...posts, post];
      savePosts(updatedPosts);

      // Reset form
      setNewPost({
        title: '',
        description: '',
        content: '',
        author: {
          name: '',
          role: ''
        },
        tags: [],
        featured: false
      });
      setNewTags('');
      setIsCreateDialogOpen(false);

      toast({
        title: "Post created",
        description: "The community post has been successfully created.",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: "There was an error creating the post.",
      });
    }
  };

  // Handle updating an existing post
  const handleUpdatePost = () => {
    try {
      if (!selectedPost) return;

      // Validate required fields
      if (!selectedPost.title || !selectedPost.description || !selectedPost.author.name) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields.",
        });
        return;
      }

      // Update the post in the list
      const updatedPosts = posts.map(post => 
        post.id === selectedPost.id ? selectedPost : post
      );
      
      savePosts(updatedPosts);
      setIsEditDialogOpen(false);

      toast({
        title: "Post updated",
        description: "The community post has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the post.",
      });
    }
  };

  // Handle deleting a post
  const handleDeletePost = () => {
    try {
      if (!selectedPost) return;

      // Remove the post from the list
      const updatedPosts = posts.filter(post => post.id !== selectedPost.id);
      savePosts(updatedPosts);
      setIsDeleteDialogOpen(false);

      toast({
        title: "Post deleted",
        description: "The community post has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the post.",
      });
    }
  };

  // Toggle the featured status of a post
  const toggleFeaturedStatus = (postId: number | string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, featured: !post.featured };
      }
      return post;
    });
    
    savePosts(updatedPosts);
    toast({
      title: "Post updated",
      description: `Post is now ${updatedPosts.find(p => p.id === postId)?.featured ? 'featured' : 'unfeatured'}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Community Management</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search posts..." 
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
          <Button variant="outline" onClick={() => window.open('/community', '_blank')} title="View community page">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Community Posts Table */}
      <Table>
        <TableCaption>A list of all community posts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <TableRow key={post.id.toString()}>
                <TableCell className="font-medium max-w-xs truncate">
                  {post.title}
                  <p className="text-xs text-muted-foreground truncate">{post.description}</p>
                </TableCell>
                <TableCell>{post.author.name}</TableCell>
                <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {post.featured ? (
                    <Badge className="bg-green-500">Featured</Badge>
                  ) : (
                    <Badge variant="outline">Regular</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{post.tags.length - 3}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => {
                        setSelectedPost(post);
                        setIsEditDialogOpen(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleFeaturedStatus(post.id)}>
                        {post.featured ? (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Unfeature
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Make Featured
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => {
                          setSelectedPost(post);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                <div className="flex flex-col items-center text-muted-foreground">
                  <AlertTriangle className="h-10 w-10 mb-2" />
                  <p>No posts found</p>
                  {searchQuery ? (
                    <p className="text-sm">Try adjusting your search query</p>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add a post
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Community Post</DialogTitle>
            <DialogDescription>
              Update the details of this community post.
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title*</Label>
                <Input 
                  id="title" 
                  value={selectedPost.title}
                  onChange={(e) => setSelectedPost({...selectedPost, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short Description*</Label>
                <Textarea 
                  id="description" 
                  value={selectedPost.description}
                  onChange={(e) => setSelectedPost({...selectedPost, description: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content*</Label>
                <Textarea 
                  id="content" 
                  value={selectedPost.content || ''}
                  onChange={(e) => setSelectedPost({...selectedPost, content: e.target.value})}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author*</Label>
                <Input 
                  id="author" 
                  value={selectedPost.author.name}
                  onChange={(e) => setSelectedPost({
                    ...selectedPost, 
                    author: {...selectedPost.author, name: e.target.value}
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author-role">Author Role</Label>
                <Input 
                  id="author-role" 
                  value={selectedPost.author.role || ''}
                  onChange={(e) => setSelectedPost({
                    ...selectedPost, 
                    author: {...selectedPost.author, role: e.target.value}
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <div className="flex items-center space-x-2">
                  <Tags className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="tags" 
                    value={selectedPost.tags.join(', ')}
                    onChange={(e) => {
                      const tagArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                      setSelectedPost({...selectedPost, tags: tagArray});
                    }}
                    placeholder="business, startup, marketing"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={selectedPost.featured || false}
                  onChange={(e) => setSelectedPost({...selectedPost, featured: e.target.checked})}
                  className="h-4 w-4"
                />
                <Label htmlFor="featured">Featured post</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdatePost}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Community Post</DialogTitle>
            <DialogDescription>
              Add a new post to the community discussions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-title">Title*</Label>
              <Input 
                id="new-title" 
                value={newPost.title || ''}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-description">Short Description*</Label>
              <Textarea 
                id="new-description" 
                value={newPost.description || ''}
                onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-content">Content*</Label>
              <Textarea 
                id="new-content" 
                value={newPost.content || ''}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-author">Author Name*</Label>
              <Input 
                id="new-author" 
                value={newPost.author?.name || ''}
                onChange={(e) => setNewPost({
                  ...newPost, 
                  author: {...(newPost.author || {}), name: e.target.value}
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-author-role">Author Role</Label>
              <Input 
                id="new-author-role" 
                value={newPost.author?.role || ''}
                onChange={(e) => setNewPost({
                  ...newPost, 
                  author: {...(newPost.author || {}), role: e.target.value}
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-tags">Tags (comma separated)</Label>
              <div className="flex items-center space-x-2">
                <Tags className="h-4 w-4 text-muted-foreground" />
                <Input 
                  id="new-tags" 
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="business, startup, marketing"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="new-featured"
                checked={newPost.featured || false}
                onChange={(e) => setNewPost({...newPost, featured: e.target.checked})}
                className="h-4 w-4"
              />
              <Label htmlFor="new-featured">Featured post</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreatePost}>
              Create Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Post Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Community Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="py-4">
              <p className="text-sm">
                You are about to delete <span className="font-semibold">{selectedPost.title}</span>
              </p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={handleDeletePost}
            >
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityManagement;

