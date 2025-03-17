
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Task } from './TaskCard';
import { useToast } from '@/hooks/use-toast';
import TaskDetailPageHeader from './task-details/TaskDetailPageHeader';
import TaskDetailMainSection from './task-details/TaskDetailMainSection';
import TaskDetailSidebar from './task-details/TaskDetailSidebar';

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
          <TaskDetailPageHeader title={currentTask.title} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <TaskDetailMainSection 
              task={currentTask}
              onStatusChange={handleStatusChange}
              onDeadlineChange={handleDeadlineChange}
              onSubtaskToggle={handleSubtaskToggle}
              onCategoryToggle={handleCategoryToggle}
              onAddSubtask={handleAddSubtask}
              onRemoveSubtask={handleRemoveSubtask}
              onNewSubtaskChange={handleNewSubtaskChange}
              newSubtasks={newSubtasks}
            />
            
            <TaskDetailSidebar 
              task={currentTask}
              onSaveChanges={handleSaveChanges}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TaskDetailPage;
