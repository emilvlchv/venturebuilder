
import React from 'react';
import { Task } from '../types';
import SubtaskCategory from './SubtaskCategory';

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
  return (
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
  );
};

export default TaskBreakdownSection;
