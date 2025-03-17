
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Bookmark,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TaskProgressDisplay from './task-details/TaskProgressDisplay';
import TaskStatusSelector from './task-details/TaskStatusSelector';
import DeadlineSelector from './task-details/DeadlineSelector';
import SubtaskCategory from './task-details/SubtaskCategory';
import ResourcesList from './task-details/ResourcesList';
import { Task } from './TaskCard';
import { useToast } from '@/hooks/use-toast';

const TaskDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get task from location state or redirect back if none
  const task = location.state?.task as Task;
  if (!task) {
    navigate('/journey');
    return null;
  }
  
  const [currentTask, setCurrentTask] = useState<Task>(task);
  const [newSubtasks, setNewSubtasks] = useState<{[key: string]: string}>({});
  
  const handleStatusChange = (status: 'completed' | 'in-progress' | 'pending') => {
    setCurrentTask(prev => ({
      ...prev,
      status
    }));
  };
  
  const handleDeadlineChange = (date: Date | undefined) => {
    setCurrentTask(prev => ({
      ...prev,
      deadline: date
    }));
  };
  
  const handleSubtaskToggle = (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => {
    setCurrentTask(prev => {
      const updatedCategories = prev.categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            subtasks: category.subtasks.map(subtask => 
              subtask.id === subtaskId ? { ...subtask, completed } : subtask
            )
          };
        }
        return category;
      });
      
      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };
  
  const handleCategoryToggle = (taskId: string, categoryId: string) => {
    setCurrentTask(prev => {
      const updatedCategories = prev.categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            collapsed: !category.collapsed
          };
        }
        return category;
      });
      
      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };
  
  const handleAddSubtask = (categoryId: string) => {
    const subtaskTitle = newSubtasks[categoryId]?.trim();
    if (subtaskTitle) {
      setCurrentTask(prev => {
        const updatedCategories = prev.categories.map(category => {
          if (category.id === categoryId) {
            return {
              ...category,
              subtasks: [
                ...category.subtasks,
                {
                  id: Date.now().toString(),
                  title: subtaskTitle,
                  completed: false
                }
              ]
            };
          }
          return category;
        });
        
        return {
          ...prev,
          categories: updatedCategories
        };
      });
      
      setNewSubtasks(prev => ({
        ...prev,
        [categoryId]: ''
      }));
    }
  };
  
  const handleNewSubtaskChange = (categoryId: string, value: string) => {
    setNewSubtasks(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };
  
  const handleRemoveSubtask = (categoryId: string, subtaskId: string) => {
    setCurrentTask(prev => {
      const updatedCategories = prev.categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            subtasks: category.subtasks.filter(subtask => subtask.id !== subtaskId)
          };
        }
        return category;
      });
      
      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };
  
  const handleSaveChanges = () => {
    // In a real app, you would save to database here
    localStorage.setItem(`task_${currentTask.id}`, JSON.stringify(currentTask));
    
    toast({
      title: "Changes saved",
      description: "Your task has been updated successfully.",
    });
    
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" /> Back
            </Button>
            <h1 className="text-3xl font-bold">{currentTask.title}</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Task Details</h2>
                <p className="text-muted-foreground mb-6">{currentTask.description}</p>
                
                <TaskProgressDisplay task={currentTask} />
                
                <div className="mt-6">
                  <h3 className="text-base font-medium mb-3">Task Status</h3>
                  <TaskStatusSelector 
                    status={currentTask.status} 
                    onStatusChange={handleStatusChange} 
                  />
                </div>
                
                <div className="mt-6">
                  <DeadlineSelector 
                    deadline={currentTask.deadline} 
                    onDeadlineChange={handleDeadlineChange}
                    taskId={currentTask.id}
                  />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Task Breakdown</h2>
                <div className="space-y-6">
                  {currentTask.categories?.map(category => (
                    <SubtaskCategory
                      key={category.id}
                      category={category}
                      taskId={currentTask.id}
                      newSubtaskValue={newSubtasks[category.id] || ''}
                      onSubtaskToggle={handleSubtaskToggle}
                      onCategoryToggle={handleCategoryToggle}
                      onAddSubtask={handleAddSubtask}
                      onRemoveSubtask={handleRemoveSubtask}
                      onNewSubtaskChange={handleNewSubtaskChange}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                <div className="space-y-4">
                  <Button 
                    className="w-full flex items-center justify-center"
                    onClick={handleSaveChanges}
                  >
                    <Save className="h-5 w-5 mr-2" /> Save Changes
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" /> Cancel
                  </Button>
                  
                  <Separator className="my-4" />
                  
                  <Button 
                    variant={currentTask.status === 'completed' ? 'default' : 'outline'}
                    className={`w-full flex items-center justify-center ${currentTask.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    onClick={() => handleStatusChange(currentTask.status === 'completed' ? 'in-progress' : 'completed')}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    {currentTask.status === 'completed' ? 'Completed' : 'Mark Complete'}
                  </Button>
                </div>
              </div>
              
              {currentTask.resources && currentTask.resources.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <ResourcesList resources={currentTask.resources} />
                </div>
              )}
              
              {currentTask.stepId && (
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Related Step</h2>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center"
                    onClick={() => navigate(`/journey-details/${currentTask.stepId}`)}
                  >
                    <Bookmark className="h-5 w-5 mr-2" /> View Related Step
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TaskDetailPage;
