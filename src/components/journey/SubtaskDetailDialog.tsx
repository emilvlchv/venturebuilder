import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Save, CheckCircle2, Trash2 } from 'lucide-react';
import { Subtask } from './types';

interface SubtaskDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subtask: Subtask;
  onToggleComplete: (completed: boolean) => void;
  onUpdateTitle: (title: string) => void;
  onDelete: () => void;
}

const SubtaskDetailDialog: React.FC<SubtaskDetailDialogProps> = ({
  isOpen,
  onClose,
  subtask,
  onToggleComplete,
  onUpdateTitle,
  onDelete
}) => {
  const [title, setTitle] = useState(subtask.title);
  const [completed, setCompleted] = useState(subtask.completed);
  
  const handleSave = () => {
    if (title.trim() !== subtask.title) {
      onUpdateTitle(title);
    }
    
    if (completed !== subtask.completed) {
      onToggleComplete(completed);
    }
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Subtask Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label htmlFor="subtask-title" className="text-sm font-medium">
              Subtask Title
            </label>
            <Input
              id="subtask-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="subtask-completed"
              checked={completed}
              onCheckedChange={(checked) => setCompleted(checked === true)}
            />
            <label
              htmlFor="subtask-completed"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mark as completed
            </label>
          </div>
          
          <Separator />
          
          <Button
            variant="outline"
            className="w-full text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Subtask
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubtaskDetailDialog;
