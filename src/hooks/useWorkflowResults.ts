import { useState, useEffect, useCallback } from 'react';

export interface WorkflowResult {
  stepId: string;
  result: any;
  displayContent: string;
  generatedAt: string;
}

export interface WorkflowResultsState {
  P1?: WorkflowResult;
  P2?: WorkflowResult;
  P3?: WorkflowResult;
  P4?: WorkflowResult;
  P5?: WorkflowResult;
  P6?: WorkflowResult;
  P7?: WorkflowResult;
  P8?: WorkflowResult;
  P9?: WorkflowResult;
  P10?: WorkflowResult;
  P11?: WorkflowResult;
  P12?: WorkflowResult;
  P13?: WorkflowResult;
  P14?: WorkflowResult;
}

const WORKFLOW_RESULTS_KEY = 'ebook_workflow_results';

export const useWorkflowResults = () => {
  const [results, setResults] = useState<WorkflowResultsState>({});

  // Load results from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WORKFLOW_RESULTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setResults(parsed);
      }
    } catch (e) {
      console.error('Error loading workflow results:', e);
    }
  }, []);

  // Save a single step result
  const saveStepResult = useCallback((stepId: string, result: any, displayContent: string) => {
    const workflowResult: WorkflowResult = {
      stepId,
      result,
      displayContent,
      generatedAt: new Date().toISOString()
    };

    setResults(prev => {
      const updated = { ...prev, [stepId]: workflowResult };
      try {
        localStorage.setItem(WORKFLOW_RESULTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving workflow result:', e);
      }
      return updated;
    });
  }, []);

  // Save all results at once (from complete workflow)
  const saveAllResults = useCallback((allResults: Record<string, { result: any; displayContent: string }>) => {
    const timestamp = new Date().toISOString();
    const formattedResults: WorkflowResultsState = {};
    
    Object.entries(allResults).forEach(([stepId, data]) => {
      formattedResults[stepId as keyof WorkflowResultsState] = {
        stepId,
        result: data.result,
        displayContent: data.displayContent,
        generatedAt: timestamp
      };
    });

    setResults(formattedResults);
    try {
      localStorage.setItem(WORKFLOW_RESULTS_KEY, JSON.stringify(formattedResults));
    } catch (e) {
      console.error('Error saving all workflow results:', e);
    }
  }, []);

  // Get result for a specific step
  const getStepResult = useCallback((stepId: string): WorkflowResult | undefined => {
    return results[stepId as keyof WorkflowResultsState];
  }, [results]);

  // Check if a step has been generated
  const hasStepResult = useCallback((stepId: string): boolean => {
    return !!results[stepId as keyof WorkflowResultsState];
  }, [results]);

  // Clear all results
  const clearResults = useCallback(() => {
    setResults({});
    localStorage.removeItem(WORKFLOW_RESULTS_KEY);
  }, []);

  // Get count of completed steps
  const getCompletedStepsCount = useCallback((): number => {
    return Object.keys(results).length;
  }, [results]);

  return {
    results,
    saveStepResult,
    saveAllResults,
    getStepResult,
    hasStepResult,
    clearResults,
    getCompletedStepsCount
  };
};
