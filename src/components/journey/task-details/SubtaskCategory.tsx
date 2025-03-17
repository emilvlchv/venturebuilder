
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Bookmark, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { TaskCategory } from '../TaskCard';

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
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-muted/30 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-base">{category.title}</h4>
        </div>
        <Badge variant="outline" className="text-sm">
          {category.subtasks.filter(s => s.completed).length}/{category.subtasks.length}
        </Badge>
      </div>
      
      <div className="p-4 space-y-4">
        {category.subtasks.length > 0 ? (
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {category.subtasks.map(subtask => (
              <div key={subtask.id} className="flex items-center justify-between gap-2 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox 
                    id={`edit-subtask-${subtask.id}`}
                    checked={subtask.completed}
                    onCheckedChange={(checked) => {
                      onSubtaskToggle(taskId, category.id, subtask.id, checked === true);
                    }}
                    className="mt-0.5"
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
                  className="h-9 w-9 p-0 rounded-full" 
                  onClick={() => onRemoveSubtask(category.id, subtask.id)}
                  aria-label="Remove subtask"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base text-muted-foreground text-center py-4">No subtasks yet. Add one below.</p>
        )}
        
        <div className="pt-3">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Add new subtask..." 
              value={newSubtaskValue}
              onChange={(e) => onNewSubtaskChange(category.id, e.target.value)}
              className="text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAddSubtask(category.id);
                }
              }}
            />
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => onAddSubtask(category.id)}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtaskCategory;
