
import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'details' | 'breakdown'>('details');

  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="flex gap-2 mb-2 border-b">
        <button 
          className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('details')}
        >
          Task Details
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'breakdown' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('breakdown')}
        >
          Task Breakdown
        </button>
      </div>

      {activeTab === 'details' ? (
        <TaskDetailsSection
          task={task}
          onStatusChange={onStatusChange}
          onDeadlineChange={onDeadlineChange}
        />
      ) : (
        <TaskBreakdownSection
          task={task}
          onSubtaskToggle={onSubtaskToggle}
          onCategoryToggle={onCategoryToggle}
          onAddSubtask={onAddSubtask}
          onRemoveSubtask={onRemoveSubtask}
          onNewSubtaskChange={onNewSubtaskChange}
          newSubtasks={newSubtasks}
        />
      )}
    </div>
  );
};

export default TaskDetailMainSection;
