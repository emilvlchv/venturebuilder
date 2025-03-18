
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { 
  CalendarClock, 
  CheckCircle2, 
  Plus, 
  Calendar, 
  Edit, 
  ListChecks, 
  Info, 
  Lightbulb,
  ArrowLeft,
  Upload,
  FileText,
  Bookmark
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { v4 as uuidv4 } from 'uuid';
import { useJourneyDetails } from '@/hooks/useJourneyDetails';
import { Task } from '@/components/journey/TaskCard';
import { StepDetail } from '@/components/journey/StepDetailsDialog';
import { SkipToContent } from '@/components/ui/skip-to-content';
import { useToast } from '@/components/ui/use-toast';
import TaskDetailSheet from '@/components/journey/TaskDetailSheet';
import { Checkbox } from '@/components/ui/checkbox';
import { TaskCategory } from '@/components/journey/TaskCard';

const StepDetailsPage = () => {
  const { journeyId, stepId } = useParams<{ journeyId: string; stepId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  const {
    tasks,
    stepsDetailsMap,
    handleCreateTaskFromStep,
    getTasksByStepId,
    handleOpenTaskDetails,
    handleTaskStatusChange,
    handleSubtaskToggle,
    handleCategoryToggle,
    handleDeadlineChange,
    handleAddSubtask,
    handleRemoveSubtask
  } = useJourneyDetails();
  
  // Get step details from the step ID
  const stepDetails: StepDetail | undefined = stepId ? stepsDetailsMap[stepId] : undefined;
  const relatedTasks = stepId ? getTasksByStepId(stepId) : [];

  useEffect(() => {
    // Set page title for accessibility
    document.title = stepDetails 
      ? `${stepDetails.title} | Journey Step Details` 
      : 'Step Details';
      
    // Announce page load to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('class', 'sr-only');
    announcer.textContent = `${stepDetails?.title || 'Step'} details page loaded successfully`;
    document.body.appendChild(announcer);
    
    return () => {
      if (document.body.contains(announcer)) {
        document.body.removeChild(announcer);
      }
    };
  }, [stepDetails?.title]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-4 w-4 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500"><Calendar className="h-4 w-4 mr-1" /> In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline"><CalendarClock className="h-4 w-4 mr-1" /> Not Started</Badge>;
      default:
        return null;
    }
  };

  const getCompletionPercentage = (task: Task) => {
    const allSubtasks = task.categories.flatMap(category => category.subtasks);
    if (allSubtasks.length === 0) return 0;
    
    const completedCount = allSubtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / allSubtasks.length) * 100);
  };

  const getCategoryCompletionPercentage = (category: TaskCategory) => {
    if (category.subtasks.length === 0) return 0;
    
    const completedCount = category.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / category.subtasks.length) * 100);
  };

  const handleCreateTask = () => {
    if (handleCreateTaskFromStep && stepId && newTaskTitle.trim()) {
      // Create a deadline 2 weeks from now for the new task
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 14); // Add 14 days

      handleCreateTaskFromStep(stepId, newTaskTitle, stepDetails?.description || '', deadline);
      setNewTaskTitle('');
      setShowTaskForm(false);
      
      toast({
        title: "Task created",
        description: "Your new task has been created successfully with a deadline in 2 weeks.",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...filesArray]);
      
      toast({
        title: "Files uploaded",
        description: `${filesArray.length} file(s) have been uploaded`,
      });
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  const handleGoBack = () => {
    navigate(`/journey-details/${journeyId}`);
  };

  // Handle opening task details
  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  // Handle closing task details
  const closeTaskDetails = () => {
    setIsTaskDetailOpen(false);
  };

  // Format date safely
  const formatDate = (date: Date | undefined | string) => {
    if (!date) return 'No deadline';
    
    try {
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString();
      }
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid date';
    }
  };

  const toggleTaskExpand = (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
    }
  };

  if (!stepDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Step not found</h1>
            <Button onClick={handleGoBack}>Go Back to Journey</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SkipToContent />
      <Navbar />
      <main className="flex-grow container-padding pt-24 pb-16 md:pt-32 md:pb-24" id="main-content">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="mb-6 flex items-center gap-2"
            aria-label="Return to journey details"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Journey
          </Button>
          
          {/* Step Header */}
          <div className="pb-5 mb-8 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold" id="step-details-title">{stepDetails.title}</h1>
              <div className="bg-primary/10 px-4 py-2 rounded-xl flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Est. time: <strong>{stepDetails.timeEstimate}</strong></span>
              </div>
            </div>
            <p className="text-lg mt-2 text-muted-foreground">
              {stepDetails.description}
            </p>
          </div>

          {/* Information Section */}
          <div className="space-y-6 mb-8">
            {/* Step Information Box - Now more compact */}
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <details open>
                <summary className="cursor-pointer mb-2">
                  <h2 className="text-xl font-semibold inline-flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" /> Step Information
                  </h2>
                </summary>
                <p className="text-base leading-relaxed text-muted-foreground">{stepDetails.detailedDescription}</p>
              </details>
            </div>

            {/* Examples Box - Now more compact */}
            {stepDetails.examples && stepDetails.examples.length > 0 && (
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <details open>
                  <summary className="cursor-pointer mb-2">
                    <h2 className="text-xl font-semibold inline-flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" /> Examples
                    </h2>
                  </summary>
                  <div className="bg-muted/20 p-4 rounded-lg space-y-2">
                    {stepDetails.examples.map((example, index) => (
                      <p key={index} className="text-sm italic">{example}</p>
                    ))}
                  </div>
                </details>
              </div>
            )}

            {/* Document Upload Box - Now more compact */}
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <details open>
                <summary className="cursor-pointer mb-2">
                  <h2 className="text-xl font-semibold inline-flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" /> Documents
                  </h2>
                </summary>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mb-3"
                  onClick={() => setShowUploadForm(!showUploadForm)}
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload Documents
                </Button>
                
                {showUploadForm && (
                  <div className="mb-3 p-3 border rounded-lg">
                    <label 
                      htmlFor="file-upload" 
                      className="block w-full cursor-pointer text-center py-3 px-3 border-2 border-dashed rounded-lg hover:bg-muted/20 transition-colors"
                    >
                      <span className="flex flex-col items-center">
                        <Upload className="h-5 w-5 mb-1" />
                        <span className="text-sm font-medium">Click to upload files</span>
                        <span className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, XLS, XLSX up to 10MB</span>
                      </span>
                      <input 
                        id="file-upload" 
                        type="file" 
                        multiple 
                        className="hidden" 
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                      />
                    </label>
                  </div>
                )}
                
                {uploadedFiles.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Uploaded Files</h3>
                    <ul className="space-y-1">
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="flex justify-between items-center p-2 bg-muted/10 rounded text-sm">
                          <span className="truncate">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFile(file.name)}
                            aria-label={`Remove file ${file.name}`}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No documents uploaded yet
                  </p>
                )}
              </details>
            </div>
          </div>
            
          {/* Tasks Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" /> Tasks
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>
            
            {showTaskForm && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/10">
                <h4 className="font-medium mb-3 text-base">Create a new task</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="newTaskTitle" className="block text-sm mb-1 font-medium">Task Title</label>
                    <input
                      id="newTaskTitle"
                      className="w-full p-2 border rounded-lg text-sm"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Enter task title..."
                      aria-label="New task title"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowTaskForm(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleCreateTask}>Create Task</Button>
                  </div>
                </div>
              </div>
            )}
            
            {relatedTasks.length > 0 ? (
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {relatedTasks.map((task) => (
                  <div key={task.id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-card">
                    {/* Task Header */}
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                          <p className="text-muted-foreground text-sm">{task.description}</p>
                        </div>
                        <div className="flex flex-col gap-2 items-end ml-4">
                          {renderStatusBadge(task.status)}
                          {task.deadline && (
                            <span className="text-xs flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-full">
                              <Calendar className="h-3 w-3 text-primary" /> 
                              Due: {formatDate(task.deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${getCompletionPercentage(task)}%` }}
                          role="progressbar"
                          aria-valuenow={getCompletionPercentage(task)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mb-3">
                        {getCompletionPercentage(task)}% complete • {task.categories.flatMap(c => c.subtasks).filter(s => s.completed).length}/{task.categories.flatMap(c => c.subtasks).length} subtasks
                      </div>
                      
                      {/* Task Actions */}
                      <div className="flex flex-wrap gap-2 justify-between">
                        <Button 
                          variant={task.status === 'completed' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleTaskStatusChange(task, task.status === 'completed' ? 'in-progress' : 'completed')}
                          className={`flex items-center ${task.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => toggleTaskExpand(task.id)}
                            className="flex items-center"
                          >
                            {expandedTaskId === task.id ? 'Hide Details' : 'Show Details'}
                          </Button>
                          
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => openTaskDetails(task)}
                            className="flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Content - Subtasks & Resources */}
                    {expandedTaskId === task.id && (
                      <div className="p-4 bg-muted/10">
                        {/* Subtasks */}
                        {task.categories.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-base mb-3">Subtasks</h4>
                            <div className="space-y-3">
                              {task.categories.map((category) => (
                                <div key={category.id} className="border rounded-lg overflow-hidden bg-white">
                                  <div className="bg-muted/30 p-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Bookmark className="h-4 w-4 text-primary" />
                                      <h5 className="font-medium text-sm">{category.title}</h5>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {category.subtasks.filter(s => s.completed).length}/{category.subtasks.length}
                                    </Badge>
                                  </div>
                                  
                                  {/* Category progress bar */}
                                  <div className="w-full bg-gray-200 h-1">
                                    <div 
                                      className="bg-green-500 h-1" 
                                      style={{ width: `${getCategoryCompletionPercentage(category)}%` }}
                                    ></div>
                                  </div>
                                  
                                  <div className="p-2 space-y-1">
                                    {category.subtasks.length > 0 ? (
                                      category.subtasks.map(subtask => (
                                        <div key={subtask.id} className="flex items-start gap-2 p-1 rounded hover:bg-muted/20">
                                          <Checkbox 
                                            id={`inline-subtask-${subtask.id}`}
                                            checked={subtask.completed}
                                            onCheckedChange={(checked) => {
                                              handleSubtaskToggle(task.id, category.id, subtask.id, checked === true);
                                            }}
                                            className="mt-0.5"
                                          />
                                          <label 
                                            htmlFor={`inline-subtask-${subtask.id}`}
                                            className={`text-xs ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                                          >
                                            {subtask.title}
                                          </label>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-xs text-muted-foreground text-center p-1">No subtasks</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Resources */}
                        {task.resources && task.resources.length > 0 && (
                          <div>
                            <h4 className="font-medium text-base mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4" /> Resources
                            </h4>
                            <div className="p-3 bg-accent/30 rounded-lg">
                              <ul className="space-y-1">
                                {task.resources.map((resource, i) => (
                                  <li key={i} className="text-xs flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70 flex-shrink-0"></div>
                                    <span>{resource}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-muted/10 rounded-lg">
                <p className="text-muted-foreground mb-4">No tasks created for this step yet.</p>
                <Button 
                  onClick={() => setShowTaskForm(true)}
                  className="flex items-center mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" /> Create Your First Task
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Task Detail Sheet */}
      {selectedTask && (
        <TaskDetailSheet
          isOpen={isTaskDetailOpen}
          onClose={closeTaskDetails}
          task={selectedTask}
          onStatusChange={handleTaskStatusChange}
          onSubtaskToggle={handleSubtaskToggle}
          onCategoryToggle={handleCategoryToggle}
          onDeadlineChange={handleDeadlineChange}
          onAddSubtask={handleAddSubtask}
          onRemoveSubtask={handleRemoveSubtask}
        />
      )}
    </div>
  );
};

export default StepDetailsPage;
