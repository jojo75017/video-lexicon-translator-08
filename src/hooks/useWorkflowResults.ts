import { useState, useEffect, useCallback } from 'react';
import { useWorkflowCloudSync } from './useWorkflowCloudSync';

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
  const { saveStepToCloud, loadFromCloud } = useWorkflowCloudSync();

  // Load results from localStorage on mount, fallback to cloud
  useEffect(() => {
    const loadResults = async () => {
      try {
        const saved = localStorage.getItem(WORKFLOW_RESULTS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Object.keys(parsed).length > 0) {
            setResults(parsed);
            return;
          }
        }
      } catch (e) {
        console.error('Error loading workflow results from localStorage:', e);
      }

      // localStorage vide ou invalide — tenter le cloud
      try {
        const projectTitle = (() => {
          try {
            const raw = localStorage.getItem('ebook_planner_data');
            if (raw) return JSON.parse(raw).ebookTitle;
          } catch {}
          return null;
        })();

        if (projectTitle) {
          const cloudResults = await loadFromCloud(projectTitle);
          if (cloudResults.length > 0) {
            const restored: WorkflowResultsState = {};
            cloudResults.forEach((cr) => {
              restored[cr.step_id as keyof WorkflowResultsState] = {
                stepId: cr.step_id,
                result: cr.step_result,
                displayContent: cr.display_content || '',
                generatedAt: cr.generated_at,
              };
            });
            setResults(restored);
            localStorage.setItem(WORKFLOW_RESULTS_KEY, JSON.stringify(restored));
            console.log('☁️ Workflow restauré depuis le cloud:', Object.keys(restored).length, 'étapes');
          }
        }
      } catch (e) {
        console.error('Error loading workflow results from cloud:', e);
      }
    };
    loadResults();
  }, []);

  // Save a single step result — localStorage + cloud
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

    // Sync to cloud in background
    const projectTitle = (() => {
      try {
        const raw = localStorage.getItem('ebook_planner_data');
        if (raw) return JSON.parse(raw).ebookTitle;
      } catch {}
      return null;
    })();

    if (projectTitle) {
      saveStepToCloud(projectTitle, stepId, result, displayContent).then(ok => {
        if (ok) console.log(`☁️ Étape ${stepId} synchronisée`);
      });
    }
  }, [saveStepToCloud]);

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
