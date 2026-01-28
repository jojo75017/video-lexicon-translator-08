import React from 'react';
import { WorkflowNavigation, TAB_TO_STEP } from './WorkflowNavigation';

interface WorkflowStepWrapperProps {
  currentTabId: string;
  onNavigate: (tabId: string) => void;
  isGenerating?: boolean;
  children: React.ReactNode;
}

/**
 * Wrapper component that adds navigation controls to workflow steps (P1-P14).
 * This component wraps individual workflow modules and provides:
 * - Progress bar showing completion status
 * - Previous/Next navigation buttons
 * - Step indicators with prerequisites
 * - Current step guidance
 */
export const WorkflowStepWrapper: React.FC<WorkflowStepWrapperProps> = ({
  currentTabId,
  onNavigate,
  isGenerating = false,
  children,
}) => {
  const isWorkflowTab = !!TAB_TO_STEP[currentTabId];

  // Only render navigation for workflow tabs
  if (!isWorkflowTab) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-0">
      <WorkflowNavigation
        currentTabId={currentTabId}
        onNavigate={onNavigate}
        isGenerating={isGenerating}
      />
      {children}
    </div>
  );
};

export default WorkflowStepWrapper;
