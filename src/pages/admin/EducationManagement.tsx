
import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  RefreshCw,
  Tags,
  FileText,
  PlayCircle,
  BookMarked,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define resource types and levels for educational content
type ResourceType = 'article' | 'video' | 'guide';
type ResourceLevel = 'beginner' | 'intermediate' | 'advanced';

// Define interface for educational resources
interface EducationalResource {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  type: ResourceType;
  level: ResourceLevel;
  duration: string;
  content?: string;
  url?: string;
  featured?: boolean;
  dateAdded: string;
}

const EducationManagement: React.FC = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<EducationalResource | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newResource, setNewResource] = useState<Partial<EducationalResource>>({
    title: '',
    description: '',
    category: '',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    type: 'article',
    level: 'beginner',
    duration: '',
    content: '',
    url: '',
    featured: false
  });

  // Sample categories
  const categories = [
    'Market Research', 
    'Planning', 
    'Marketing', 
    'Finance', 
    'Product Development', 
    'Leadership',
    'Legal',
    'Sales',
    'Operations'
  ];

  // Load resources on component mount
  useEffect(() => {
    // Initialize with sample data if nothing exists in localStorage
    const storedResources = localStorage.getItem('educational_resources');
    if (storedResources) {
      try {
        setResources(JSON.parse(storedResources));
      } catch (error) {
        console.error('Error loading educational resources:', error);
        initializeWithSampleData();
      }
    } else {
      initializeWithSampleData();
    }
  }, []);

  // Initialize with sample data
  const initializeWithSampleData = () => {
    const sampleResources: EducationalResource[] = [
      {
        id: "edu_1",
        title: "Validating Your Business Idea",
        description: "Learn how to test and validate your business idea before investing time and money.",
        category: "Market Research",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        type: "guide",
        level: "beginner",
        duration: "15 min read",
        featured: true,
        dateAdded: new Date().toISOString()
      },
      {
        id: "edu_2",
        title: "Creating Your First Business Plan",
        description: "A step-by-step approach to writing a business plan that will help you secure funding.",
        category: "Planning",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        type: "article",
        level: "beginner",
        duration: "10 min read",
        dateAdded: new Date().toISOString()
      },
      {
        id: "edu_3",
        title: "Finding Your Target Audience",
        description: "Strategies for identifying and connecting with your ideal customers.",
        category: "Marketing",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        type: "video",
        level: "intermediate",
        duration: "25 min watch",
        url: "https://www.youtube.com/watch?v=example",
        dateAdded: new Date().toISOString()
      }
    ];

    setResources(sampleResources);
    localStorage.setItem('educational_resources', JSON.stringify(sampleResources));
  };

  // Save resources to localStorage
  const saveResources = (updatedResources: EducationalResource[]) => {
    setResources(updatedResources);
    localStorage.setItem('educational_resources', JSON.stringify(updatedResources));
  };

  // Filter resources based on search
  const filteredResources = resources.filter(resource => {
    const query = searchQuery.toLowerCase();
    return (
      resource.title.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query) ||
      resource.category.toLowerCase().includes(query) ||
      resource.level.toLowerCase().includes(query) ||
      resource.type.toLowerCase().includes(query)
    );
  });

  // Handle creating a new resource
  const handleCreateResource = () => {
    try {
      // Validate required fields
      if (!newResource.title || !newResource.description || !newResource.category || !newResource.duration) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields.",
        });
        return;
      }

      // Create a new resource object
      const resource: EducationalResource = {
        id: `edu_${Date.now()}`,
        title: newResource.title || '',
        description: newResource.description || '',
        category: newResource.category || '',
        image: newResource.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        type: newResource.type as ResourceType || 'article',
        level: newResource.level as ResourceLevel || 'beginner',
        duration: newResource.duration || '',
        content: newResource.content || '',
        url: newResource.url || '',
        featured: newResource.featured || false,
        dateAdded: new Date().toISOString()
      };

      // Add to resource list
      const updatedResources = [...resources, resource];
      saveResources(updatedResources);

      // Reset form
      setNewResource({
        title: '',
        description: '',
        category: '',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        type: 'article',
        level: 'beginner',
        duration: '',
        content: '',
        url: '',
        featured: false
      });
      setIsCreateDialogOpen(false);

      toast({
        title: "Resource created",
        description: "The educational resource has been successfully created.",
      });
    } catch (error) {
      console.error('Error creating resource:', error);
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: "There was an error creating the resource.",
      });
    }
  };

  // Handle updating an existing resource
  const handleUpdateResource = () => {
    try {
      if (!selectedResource) return;

      // Validate required fields
      if (!selectedResource.title || !selectedResource.description || !selectedResource.category) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields.",
        });
        return;
      }

      // Update the resource in the list
      const updatedResources = resources.map(resource => 
        resource.id === selectedResource.id ? selectedResource : resource
      );
      
      saveResources(updatedResources);
      setIsEditDialogOpen(false);

      toast({
        title: "Resource updated",
        description: "The educational resource has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating resource:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the resource.",
      });
    }
  };

  // Handle deleting a resource
  const handleDeleteResource = () => {
    try {
      if (!selectedResource) return;

      // Remove the resource from the list
      const updatedResources = resources.filter(resource => resource.id !== selectedResource.id);
      saveResources(updatedResources);
      setIsDeleteDialogOpen(false);

      toast({
        title: "Resource deleted",
        description: "The educational resource has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the resource.",
      });
    }
  };

  // Toggle the featured status of a resource
  const toggleFeaturedStatus = (resourceId: string) => {
    const updatedResources = resources.map(resource => {
      if (resource.id === resourceId) {
        return { ...resource, featured: !resource.featured };
      }
      return resource;
    });
    
    saveResources(updatedResources);
    toast({
      title: "Resource updated",
      description: `Resource is now ${updatedResources.find(r => r.id === resourceId)?.featured ? 'featured' : 'unfeatured'}.`,
    });
  };

  // Get icon for resource type
  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'article': return <FileText size={16} />;
      case 'video': return <PlayCircle size={16} />;
      case 'guide': return <BookMarked size={16} />;
      default: return <FileText size={16} />;
    }
  };

  // Get color for resource level
  const getLevelBadge = (level: ResourceLevel) => {
    switch (level) {
      case 'beginner':
        return <Badge className="bg-green-500">Beginner</Badge>;
      case 'intermediate':
        return <Badge className="bg-blue-500">Intermediate</Badge>;
      case 'advanced':
        return <Badge className="bg-purple-500">Advanced</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Educational Content</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search resources..." 
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
          <Button variant="outline" onClick={() => window.open('/education', '_blank')} title="View education page">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Educational Resources Table */}
      <Table>
        <TableCaption>A list of all educational resources.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium max-w-xs truncate">
                  {resource.title}
                  <p className="text-xs text-muted-foreground truncate">{resource.description}</p>
                </TableCell>
                <TableCell>{resource.category}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {getTypeIcon(resource.type)}
                    <span className="capitalize">{resource.type}</span>
                  </div>
                </TableCell>
                <TableCell>{getLevelBadge(resource.level)}</TableCell>
                <TableCell>{resource.duration}</TableCell>
                <TableCell>
                  {resource.featured ? (
                    <Badge className="bg-green-500">Featured</Badge>
                  ) : (
                    <Badge variant="outline">Regular</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(resource.dateAdded).toLocaleDateString()}</TableCell>
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
                        setSelectedResource(resource);
                        setIsEditDialogOpen(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleFeaturedStatus(resource.id)}>
                        {resource.featured ? (
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
                          setSelectedResource(resource);
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
              <TableCell colSpan={8} className="text-center py-4">
                <div className="flex flex-col items-center text-muted-foreground">
                  <AlertTriangle className="h-10 w-10 mb-2" />
                  <p>No resources found</p>
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
                      Add a resource
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Resource Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Educational Resource</DialogTitle>
            <DialogDescription>
              Update the details of this educational resource.
            </DialogDescription>
          </DialogHeader>
          {selectedResource && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title*</Label>
                <Input 
                  id="title" 
                  value={selectedResource.title}
                  onChange={(e) => setSelectedResource({...selectedResource, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea 
                  id="description" 
                  value={selectedResource.description}
                  onChange={(e) => setSelectedResource({...selectedResource, description: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select 
                    value={selectedResource.category} 
                    onValueChange={(value) => setSelectedResource({...selectedResource, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Resource Type*</Label>
                  <Select 
                    value={selectedResource.type} 
                    onValueChange={(value) => setSelectedResource({...selectedResource, type: value as ResourceType})}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level*</Label>
                  <Select 
                    value={selectedResource.level} 
                    onValueChange={(value) => setSelectedResource({...selectedResource, level: value as ResourceLevel})}
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration*</Label>
                  <Input 
                    id="duration" 
                    value={selectedResource.duration}
                    onChange={(e) => setSelectedResource({...selectedResource, duration: e.target.value})}
                    placeholder="10 min read, 15 min watch"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input 
                  id="image" 
                  value={selectedResource.image}
                  onChange={(e) => setSelectedResource({...selectedResource, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {selectedResource.type === 'video' && (
                <div className="space-y-2">
                  <Label htmlFor="url">Video URL</Label>
                  <Input 
                    id="url" 
                    value={selectedResource.url || ''}
                    onChange={(e) => setSelectedResource({...selectedResource, url: e.target.value})}
                    placeholder="https://youtube.com/watch?v=example"
                  />
                </div>
              )}
              {(selectedResource.type === 'article' || selectedResource.type === 'guide') && (
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content" 
                    value={selectedResource.content || ''}
                    onChange={(e) => setSelectedResource({...selectedResource, content: e.target.value})}
                    rows={5}
                    placeholder="Content of the article or guide..."
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={selectedResource.featured || false}
                  onChange={(e) => setSelectedResource({...selectedResource, featured: e.target.checked})}
                  className="h-4 w-4"
                />
                <Label htmlFor="featured">Featured resource</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateResource}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Resource Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Educational Resource</DialogTitle>
            <DialogDescription>
              Add a new educational resource to the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-title">Title*</Label>
              <Input 
                id="new-title" 
                value={newResource.title}
                onChange={(e) => setNewResource({...newResource, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-description">Description*</Label>
              <Textarea 
                id="new-description" 
                value={newResource.description}
                onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-category">Category*</Label>
                <Select 
                  value={newResource.category} 
                  onValueChange={(value) => setNewResource({...newResource, category: value})}
                >
                  <SelectTrigger id="new-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-type">Resource Type*</Label>
                <Select 
                  value={newResource.type as string} 
                  onValueChange={(value) => setNewResource({...newResource, type: value as ResourceType})}
                >
                  <SelectTrigger id="new-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-level">Difficulty Level*</Label>
                <Select 
                  value={newResource.level as string} 
                  onValueChange={(value) => setNewResource({...newResource, level: value as ResourceLevel})}
                >
                  <SelectTrigger id="new-level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-duration">Duration*</Label>
                <Input 
                  id="new-duration" 
                  value={newResource.duration}
                  onChange={(e) => setNewResource({...newResource, duration: e.target.value})}
                  placeholder="10 min read, 15 min watch"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-image">Image URL</Label>
              <Input 
                id="new-image" 
                value={newResource.image}
                onChange={(e) => setNewResource({...newResource, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {newResource.type === 'video' && (
              <div className="space-y-2">
                <Label htmlFor="new-url">Video URL</Label>
                <Input 
                  id="new-url" 
                  value={newResource.url || ''}
                  onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                  placeholder="https://youtube.com/watch?v=example"
                />
              </div>
            )}
            {(newResource.type === 'article' || newResource.type === 'guide') && (
              <div className="space-y-2">
                <Label htmlFor="new-content">Content</Label>
                <Textarea 
                  id="new-content" 
                  value={newResource.content || ''}
                  onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                  rows={5}
                  placeholder="Content of the article or guide..."
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="new-featured"
                checked={newResource.featured || false}
                onChange={(e) => setNewResource({...newResource, featured: e.target.checked})}
                className="h-4 w-4"
              />
              <Label htmlFor="new-featured">Featured resource</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateResource}>
              Create Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Resource Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Educational Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedResource && (
            <div className="py-4">
              <p className="text-sm">
                You are about to delete <span className="font-semibold">{selectedResource.title}</span>
              </p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={handleDeleteResource}
            >
              Delete Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationManagement;
