
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Bookmark, Plus, Trash2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { TaskCategory } from '../types';

interface SubtaskCategoryProps {
  category: TaskCategory;
  taskId: string;
  onSubtaskToggle: (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => void;
  onCategoryToggle: (taskId: string, categoryId: string) => void;
  onAddSubtask: (categoryId: string) => void;
  onRemoveSubtask: (categoryId: string, subtaskId: string) => void;
  onNewSubtaskChange: (categoryId: string, value: string) => void;
  newSubtaskValue: string;
}

const SubtaskCategory: React.FC<SubtaskCategoryProps> = ({
  category,
  taskId,
  onSubtaskToggle,
  onCategoryToggle,
  onAddSubtask,
  onRemoveSubtask,
  onNewSubtaskChange,
  newSubtaskValue
}) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleCollapse = () => {
    setCollapsed(prev => !prev);
    onCategoryToggle(taskId, category.id);
  };
  
  const handleAddSubtask = () => {
    if (newSubtaskValue.trim()) {
      onAddSubtask(category.id);
    }
  };
  
  const completedCount = category.subtasks.filter(s => s.completed).length;
  const totalCount = category.subtasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Get the background color based on completion percentage
  const getProgressColor = () => {
    if (completionPercentage >= 100) return 'bg-green-500';
    if (completionPercentage >= 70) return 'bg-emerald-500';
    if (completionPercentage >= 30) return 'bg-blue-500';
    if (completionPercentage > 0) return 'bg-amber-500';
    return 'bg-slate-200'; // Light visible background for 0%
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow">
      <div 
        className="bg-muted/20 p-4 flex items-center justify-between cursor-pointer"
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-base">{category.title}</h4>
          <div className="ml-1 w-16 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div 
              className={`h-full ${getProgressColor()}`} 
              style={{ 
                width: completionPercentage > 0 ? `${completionPercentage}%` : '100%', 
                opacity: completionPercentage > 0 ? 1 : 0.4 
              }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-sm ${completionPercentage > 0 ? 'bg-primary/10' : 'bg-slate-50'} text-foreground`}>
            {completedCount}/{totalCount} ({completionPercentage}%)
          </Badge>
          {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </div>
      </div>
      
      {!collapsed && (
        <div className="p-4 space-y-4">
          {category.subtasks.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {category.subtasks.map(subtask => (
                <div 
                  key={subtask.id} 
                  className={`flex items-center justify-between gap-2 p-3 rounded-lg transition-colors ${
                    subtask.completed 
                      ? 'bg-green-50 border border-green-100' 
                      : 'bg-muted/10 border border-muted/30 hover:bg-muted/20'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox 
                      id={`edit-subtask-${subtask.id}`}
                      checked={subtask.completed}
                      onCheckedChange={(checked) => {
                        onSubtaskToggle(taskId, category.id, subtask.id, checked === true);
                      }}
                      className={`mt-0.5 ${subtask.completed ? 'bg-green-500 border-green-500' : ''}`}
                    />
                    <label 
                      htmlFor={`edit-subtask-${subtask.id}`}
                      className={`text-base cursor-pointer ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {subtask.title}
                    </label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 w-9 p-0 rounded-full opacity-70 hover:opacity-100" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSubtask(category.id, subtask.id);
                    }}
                    aria-label="Remove subtask"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="text-sm">No subtasks yet. Add one below.</p>
            </div>
          )}
          
          <div className="pt-3">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Add new subtask..." 
                value={newSubtaskValue}
                onChange={(e) => onNewSubtaskChange(category.id, e.target.value)}
                className="text-base border-primary/30 focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSubtask();
                  }
                }}
              />
              <Button 
                variant="default" 
                size="lg"
                onClick={handleAddSubtask}
                className="shrink-0 bg-primary hover:bg-primary/90"
                disabled={!newSubtaskValue.trim()}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtaskCategory;
