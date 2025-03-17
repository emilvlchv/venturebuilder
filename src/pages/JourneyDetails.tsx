
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionCheck from '@/components/auth/SubscriptionCheck';
import StepDetailsDialog from '@/components/journey/StepDetailsDialog';
import TaskDetailSheet from '@/components/journey/TaskDetailSheet';
import JourneyHeader from '@/components/journey/JourneyHeader';
import JourneyProgress from '@/components/journey/JourneyProgress';
import { useJourneyDetails } from '@/hooks/useJourneyDetails';

const JourneyDetails = () => {
  const { user } = useAuth();
  const {
    journey,
    businessData,
    activeTab,
    setActiveTab,
    selectedStep,
    isDialogOpen,
    isTaskDetailOpen,
    tasks,
    selectedTask,
    handleTaskStatusChange,
    handleSubtaskToggle,
    handleCategoryToggle,
    handleDeadlineChange,
    handleOpenTaskDetails,
    handleAddSubtask,
    handleRemoveSubtask,
    handleCreateTaskFromStep,
    getTasksByStepId,
    handleOpenStepDetails,
    handleCloseDialog,
    handleCloseTaskDetail,
    journeyPhases
  } = useJourneyDetails();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container-padding">
          <SubscriptionCheck>
            <div className="max-w-5xl mx-auto">
              <JourneyHeader
                title={journey?.title || 'Your Entrepreneurial Journey'}
                description={journey?.description || 'Follow this personalized roadmap to turn your business idea into reality. Each phase contains actionable steps and resources to help you succeed.'}
                businessData={businessData}
              />

              <JourneyProgress
                phases={journeyPhases}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                getTasksByStepId={getTasksByStepId}
                onOpenStepDetails={handleOpenStepDetails}
                onOpenTaskDetails={handleOpenTaskDetails}
              />
            </div>
          </SubscriptionCheck>
        </div>
      </main>
      
      <Footer />
      
      {selectedStep && (
        <StepDetailsDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          stepDetails={selectedStep}
          onCreateTask={handleCreateTaskFromStep}
          tasks={getTasksByStepId(selectedStep.stepId || '')}
          onTaskOpen={handleOpenTaskDetails}
        />
      )}
      
      {selectedTask && (
        <TaskDetailSheet
          isOpen={isTaskDetailOpen}
          onClose={handleCloseTaskDetail}
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

export default JourneyDetails;
