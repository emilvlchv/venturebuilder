
import React from 'react';
import { Task } from '../types';
import SubtaskCategory from './SubtaskCategory';
import { AlertCircle } from 'lucide-react';

interface TaskBreakdownSectionProps {
  task: Task;
  onSubtaskToggle: (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => void;
  onCategoryToggle: (taskId: string, categoryId: string) => void;
  onAddSubtask: (categoryId: string) => void;
  onRemoveSubtask: (categoryId: string, subtaskId: string) => void;
  onNewSubtaskChange: (categoryId: string, value: string) => void;
  newSubtasks: {[key: string]: string};
}

const TaskBreakdownSection: React.FC<TaskBreakdownSectionProps> = ({
  task,
  onSubtaskToggle,
  onCategoryToggle,
  onAddSubtask,
  onRemoveSubtask,
  onNewSubtaskChange,
  newSubtasks
}) => {
  const totalSubtasks = task.categories.reduce((sum, category) => sum + category.subtasks.length, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Task Breakdown</h2>
      
      {task.categories.length === 0 && (
        <div className="flex items-center justify-center p-6 bg-muted/10 rounded-lg border border-dashed">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No categories defined for this task yet.</p>
          </div>
        </div>
      )}
      
      {totalSubtasks === 0 && task.categories.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <p className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>No subtasks added yet. Add subtasks to track your progress.</span>
          </p>
        </div>
      )}
      
      <div className="space-y-6">
        {task.categories?.map(category => (
          <SubtaskCategory
            key={category.id}
            category={category}
            taskId={task.id}
            newSubtaskValue={newSubtasks[category.id] || ''}
            onSubtaskToggle={onSubtaskToggle}
            onCategoryToggle={onCategoryToggle}
            onAddSubtask={onAddSubtask}
            onRemoveSubtask={onRemoveSubtask}
            onNewSubtaskChange={onNewSubtaskChange}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskBreakdownSection;
