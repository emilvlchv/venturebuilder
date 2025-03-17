
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Edit,
  MoreHorizontal,
  Trash2,
  UserPlus,
  Search,
  ShieldCheck,
  User as UserIcon,
  Filter,
  RefreshCw,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define User type
interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  password?: string;
  businessIdea?: string;
  createdAt?: string;
  status?: 'active' | 'inactive' | 'pending';
}

const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newUser, setNewUser] = useState<AdminUser>({
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: 'user',
    password: '',
    status: 'active'
  });
  
  // Load real users from localStorage
  useEffect(() => {
    const loadUsers = () => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Map to ensure consistent structure and add missing properties
        // Also ensure proper type casting for role and status
        const formattedUsers = storedUsers.map((user: any) => {
          // Ensure role is either 'admin' or 'user'
          const safeRole: 'admin' | 'user' = user.role === 'admin' ? 'admin' : 'user';
          
          // Ensure status is one of the allowed values
          const safeStatus: 'active' | 'inactive' | 'pending' = 
            ['active', 'inactive', 'pending'].includes(user.status) 
              ? (user.status as 'active' | 'inactive' | 'pending') 
              : 'active';
              
          return {
            ...user,
            role: safeRole,
            status: safeStatus,
            createdAt: user.createdAt || new Date().toISOString().split('T')[0]
          };
        });
        
        setUsers(formattedUsers as AdminUser[]);
      } catch (error) {
        console.error('Error loading users:', error);
        toast({
          variant: "destructive",
          title: "Failed to load users",
          description: "There was an error loading the user data.",
        });
      }
    };
    
    loadUsers();
  }, [toast]);

  const handleDeleteUser = (userId: string) => {
    try {
      // First update state
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      
      // Then persist to localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the user.",
      });
    }
  };

  const handleUpdateUser = (updatedUser: AdminUser) => {
    try {
      // Remove password if it's empty (don't update password)
      if (updatedUser.password === '') {
        // Find current user to get the existing password
        const currentUser = users.find(u => u.id === updatedUser.id);
        if (currentUser && currentUser.password) {
          updatedUser.password = currentUser.password;
        }
      }
      
      // Update state
      const updatedUsers = users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
      
      // Update localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast({
        title: "User updated",
        description: "The user information has been updated.",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the user information.",
      });
    }
  };

  const handleCreateUser = () => {
    try {
      // Validate required fields
      if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.username || !newUser.password) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields.",
        });
        return;
      }
      
      // Check if email already exists
      if (users.some(user => user.email === newUser.email)) {
        toast({
          variant: "destructive",
          title: "Email already exists",
          description: "A user with this email already exists.",
        });
        return;
      }
      
      // Check if username already exists
      if (users.some(user => user.username === newUser.username)) {
        toast({
          variant: "destructive",
          title: "Username already exists",
          description: "This username is already taken.",
        });
        return;
      }
      
      // Create a new user with an ID and current date
      const createdUser = {
        ...newUser,
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      // Update state
      const updatedUsers = [...users, createdUser];
      setUsers(updatedUsers);
      
      // Update localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Reset new user form
      setNewUser({
        id: '',
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        role: 'user',
        password: '',
        status: 'active'
      });
      
      toast({
        title: "User created",
        description: "The user has been successfully created.",
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: "There was an error creating the user.",
      });
    }
  };

  const toggleUserRole = (userId: string) => {
    try {
      // Update state
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          // Count admins to ensure at least one remains
          const adminCount = users.filter(u => u.role === 'admin').length;
          if (user.role === 'admin' && adminCount <= 1) {
            throw new Error('Cannot remove the last admin user');
          }
          
          // Use type assertion to ensure type safety
          const newRole: 'admin' | 'user' = user.role === 'admin' ? 'user' : 'admin';
          return { ...user, role: newRole };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      // Update localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast({
        title: `User role updated`,
        description: `User is now a ${updatedUsers.find(u => u.id === userId)?.role}.`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        variant: "destructive",
        title: "Role update failed",
        description: error instanceof Error ? error.message : "There was an error updating the user role.",
      });
    }
  };

  const toggleUserStatus = (userId: string) => {
    try {
      // Update state with proper type casting
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          // Ensure status is a valid option with type assertion
          const newStatus: 'active' | 'inactive' | 'pending' = 
            user.status === 'active' ? 'inactive' : 'active';
          return { ...user, status: newStatus };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      // Update localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast({
        title: `User status updated`,
        description: `User is now ${updatedUsers.find(u => u.id === userId)?.status}.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        variant: "destructive",
        title: "Status update failed",
        description: "There was an error updating the user status.",
      });
    }
  };
  
  const refreshUserList = () => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Ensure proper typing when refreshing users
      const typedUsers = storedUsers.map((user: any) => {
        // Explicitly handle type conversion for role
        const safeRole: 'admin' | 'user' = user.role === 'admin' ? 'admin' : 'user';
        
        // Explicitly handle type conversion for status
        const safeStatus: 'active' | 'inactive' | 'pending' = 
          ['active', 'inactive', 'pending'].includes(user.status) 
            ? (user.status as 'active' | 'inactive' | 'pending') 
            : 'active';
            
        return {
          ...user,
          role: safeRole,
          status: safeStatus
        };
      });
      
      setUsers(typedUsers as AdminUser[]);
      
      toast({
        title: "User list refreshed",
        description: "The user list has been successfully refreshed.",
      });
    } catch (error) {
      console.error('Error refreshing user list:', error);
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "There was an error refreshing the user list.",
      });
    }
  };

  const getRoleChip = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-500"><ShieldCheck className="h-3 w-3 mr-1" /> Admin</Badge>;
      default:
        return <Badge variant="outline"><UserIcon className="h-3 w-3 mr-1" /> User</Badge>;
    }
  };

  const getStatusChip = (status: string = 'active') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      default:
        return <Badge className="bg-green-500">Active</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="whitespace-nowrap" onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button variant="outline" onClick={refreshUserList} title="Refresh user list">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Total Users</h3>
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Admin Users</h3>
            <ShieldCheck className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Active Users</h3>
            <Check className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold">{users.filter(u => u.status === 'active' || !u.status).length}</p>
        </div>
      </div>
      
      {/* User Table */}
      <Table>
        <TableCaption>A list of all users on the platform.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Business Idea</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                <TableCell>@{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleChip(user.role)}</TableCell>
                <TableCell>{getStatusChip(user.status)}</TableCell>
                <TableCell>{user.businessIdea || '—'}</TableCell>
                <TableCell>{user.createdAt || '—'}</TableCell>
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
                        setSelectedUser(user);
                        setIsEditDialogOpen(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleUserRole(user.id)}>
                        {user.role === 'admin' ? (
                          <>
                            <UserIcon className="h-4 w-4 mr-2" />
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Make Admin
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                        {user.status === 'active' || !user.status ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Deactivate User
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Activate User
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => {
                          setSelectedUser(user);
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
                  <p>No users found</p>
                  {searchQuery ? (
                    <p className="text-sm">Try adjusting your search query</p>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add a user
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name*</Label>
                <Input 
                  id="firstName" 
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name*</Label>
                <Input 
                  id="lastName" 
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username*</Label>
              <Input 
                id="username" 
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input 
                id="email" 
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password*</Label>
              <Input 
                id="password" 
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value) => setNewUser({...newUser, role: value as 'admin' | 'user'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessIdea">Business Idea</Label>
              <Input 
                id="businessIdea" 
                value={newUser.businessIdea || ''}
                onChange={(e) => setNewUser({...newUser, businessIdea: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateUser}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user's information.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input 
                    id="firstName" 
                    value={selectedUser.firstName}
                    onChange={(e) => setSelectedUser({...selectedUser, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input 
                    id="lastName" 
                    value={selectedUser.lastName}
                    onChange={(e) => setSelectedUser({...selectedUser, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={selectedUser.username}
                  onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password (leave empty to keep current)</Label>
                <Input 
                  id="password" 
                  type="password"
                  placeholder="••••••••"
                  value={selectedUser.password || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={selectedUser.role} 
                  onValueChange={(value) => setSelectedUser({...selectedUser, role: value as 'admin' | 'user'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={selectedUser.status || 'active'} 
                  onValueChange={(value) => setSelectedUser({...selectedUser, status: value as 'active' | 'inactive' | 'pending'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessIdea">Business Idea</Label>
                <Input 
                  id="businessIdea" 
                  value={selectedUser.businessIdea || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, businessIdea: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => selectedUser && handleUpdateUser(selectedUser)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p className="text-sm">
                You are about to delete <span className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</span> ({selectedUser.email}).
              </p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
