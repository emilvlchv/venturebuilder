
import React from 'react';
import { Task } from '../types';
import TaskDetailsSection from './TaskDetailsSection';
import TaskBreakdownSection from './TaskBreakdownSection';

interface TaskDetailMainSectionProps {
  task: Task;
  onStatusChange: (status: 'completed' | 'in-progress' | 'pending') => void;
  onDeadlineChange: (date: Date | undefined) => void;
  onSubtaskToggle: (taskId: string, categoryId: string, subtaskId: string, completed: boolean) => void;
  onCategoryToggle: (taskId: string, categoryId: string) => void;
  onAddSubtask: (categoryId: string) => void;
  onRemoveSubtask: (categoryId: string, subtaskId: string) => void;
  onNewSubtaskChange: (categoryId: string, value: string) => void;
  newSubtasks: {[key: string]: string};
}

const TaskDetailMainSection: React.FC<TaskDetailMainSectionProps> = ({
  task,
  onStatusChange,
  onDeadlineChange,
  onSubtaskToggle,
  onCategoryToggle,
  onAddSubtask,
  onRemoveSubtask,
  onNewSubtaskChange,
  newSubtasks
}) => {
  return (
    <div className="lg:col-span-2 space-y-8">
      <TaskDetailsSection
        task={task}
        onStatusChange={onStatusChange}
        onDeadlineChange={onDeadlineChange}
      />
      
      <TaskBreakdownSection
        task={task}
        onSubtaskToggle={onSubtaskToggle}
        onCategoryToggle={onCategoryToggle}
        onAddSubtask={onAddSubtask}
        onRemoveSubtask={onRemoveSubtask}
        onNewSubtaskChange={onNewSubtaskChange}
        newSubtasks={newSubtasks}
      />
    </div>
  );
};

export default TaskDetailMainSection;
