
import React from 'react';
import TaskProgressDisplay from './TaskProgressDisplay';
import TaskStatusSelector from './TaskStatusSelector';
import DeadlineSelector from './DeadlineSelector';
import SubtaskCategory from './SubtaskCategory';
import { Task } from '../TaskCard';

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
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Task Details</h2>
        <p className="text-muted-foreground mb-6">{task.description}</p>
        
        <TaskProgressDisplay task={task} />
        
        <div className="mt-6">
          <h3 className="text-base font-medium mb-3">Task Status</h3>
          <TaskStatusSelector 
            status={task.status} 
            onStatusChange={onStatusChange} 
          />
        </div>
        
        <div className="mt-6">
          <DeadlineSelector 
            deadline={task.deadline} 
            onDeadlineChange={onDeadlineChange}
            taskId={task.id}
          />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Task Breakdown</h2>
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
    </div>
  );
};

export default TaskDetailMainSection;
