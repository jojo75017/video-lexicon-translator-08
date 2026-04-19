// v3 - Phase C1: cloud reconciliation + legacy migration
import { useState, useEffect, useCallback, useRef } from 'react';
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
const LEGACY_PROGRESS_KEY = 'ebook_workflow_progress';
const MIGRATION_DONE_KEY = 'ebook_workflow_migration_v1_done';

/**
 * Migration unique : importer stepResults depuis ebook_workflow_progress
 * dans ebook_workflow_results pour garantir une source unique.
 * Ne s'exécute qu'une fois grâce à MIGRATION_DONE_KEY.
 */
const runLegacyMigration = (): WorkflowResultsState | null => {
  try {
    if (localStorage.getItem(MIGRATION_DONE_KEY) === '1') return null;

    const legacy = localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (!legacy) {
      localStorage.setItem(MIGRATION_DONE_KEY, '1');
      return null;
    }

    const data = JSON.parse(legacy);
    const legacySteps = data?.stepResults || {};
    if (!legacySteps || Object.keys(legacySteps).length === 0) {
      localStorage.setItem(MIGRATION_DONE_KEY, '1');
      return null;
    }

    const existing = localStorage.getItem(WORKFLOW_RESULTS_KEY);
    const merged: WorkflowResultsState = existing ? JSON.parse(existing) : {};
    const fallbackTs = data?.savedAt || new Date().toISOString();

    let imported = 0;
    Object.entries(legacySteps).forEach(([stepId, payload]: any) => {
      if (!merged[stepId as keyof WorkflowResultsState]) {
        merged[stepId as keyof WorkflowResultsState] = {
          stepId,
          result: payload?.result,
          displayContent: payload?.displayContent || '',
          generatedAt: fallbackTs,
        };
        imported++;
      }
    });

    if (imported > 0) {
      localStorage.setItem(WORKFLOW_RESULTS_KEY, JSON.stringify(merged));
      console.log(`🔄 Migration: ${imported} étape(s) importée(s) depuis le legacy progress`);
    }
    localStorage.setItem(MIGRATION_DONE_KEY, '1');
    return imported > 0 ? merged : null;
  } catch (e) {
    console.error('Legacy migration error:', e);
    return null;
  }
};

/**
 * Réconciliation cloud + local : prend la version la plus récente par étape
 * (basée sur generated_at). Le cloud est considéré comme source de vérité
 * en cas d'égalité.
 */
const reconcileCloudAndLocal = (
  local: WorkflowResultsState,
  cloud: Array<{ step_id: string; step_result: any; display_content: string | null; generated_at: string }>
): WorkflowResultsState => {
  const merged: WorkflowResultsState = { ...local };
  cloud.forEach((cr) => {
    const key = cr.step_id as keyof WorkflowResultsState;
    const localEntry = merged[key];
    const cloudTs = new Date(cr.generated_at).getTime();
    const localTs = localEntry ? new Date(localEntry.generatedAt).getTime() : 0;

    // Cloud gagne si plus récent OU égalité
    if (!localEntry || cloudTs >= localTs) {
      merged[key] = {
        stepId: cr.step_id,
        result: cr.step_result,
        displayContent: cr.display_content || '',
        generatedAt: cr.generated_at,
      };
    }
  });
  return merged;
};

export const useWorkflowResults = () => {
  const [results, setResults] = useState<WorkflowResultsState>({});
  const { saveStepToCloud, loadFromCloud } = useWorkflowCloudSync();
  const initRef = useRef(false);

  // Mount: migration legacy → reconciliation locale → reconciliation cloud
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      // 1) Migration unique du legacy progress
      const migrated = runLegacyMigration();

      // 2) Charger le cache local
      let localState: WorkflowResultsState = {};
      try {
        const saved = localStorage.getItem(WORKFLOW_RESULTS_KEY);
        if (saved) localState = JSON.parse(saved);
        else if (migrated) localState = migrated;
      } catch (e) {
        console.error('Error loading workflow results from localStorage:', e);
      }

      // Définir l'état local immédiatement pour un démarrage rapide
      if (Object.keys(localState).length > 0) {
        setResults(localState);
      }

      // 3) Réconciliation cloud (en background)
      try {
        const projectTitle = (() => {
          try {
            const raw = localStorage.getItem('ebook_planner_data');
            if (raw) return JSON.parse(raw).ebookTitle;
          } catch {}
          // Fallback : titre depuis le workflow en cours
          try {
            const raw = localStorage.getItem(LEGACY_PROGRESS_KEY);
            if (raw) return JSON.parse(raw).title;
          } catch {}
          return null;
        })();

        if (projectTitle) {
          const cloudResults = await loadFromCloud(projectTitle);
          if (cloudResults.length > 0) {
            const reconciled = reconcileCloudAndLocal(localState, cloudResults);
            const localKeys = Object.keys(localState).length;
            const reconciledKeys = Object.keys(reconciled).length;

            // Vérifier si la réconciliation a apporté du neuf
            let hasChanges = reconciledKeys !== localKeys;
            if (!hasChanges) {
              for (const k of Object.keys(reconciled)) {
                const a = reconciled[k as keyof WorkflowResultsState];
                const b = localState[k as keyof WorkflowResultsState];
                if (!b || a?.generatedAt !== b?.generatedAt) {
                  hasChanges = true;
                  break;
                }
              }
            }

            if (hasChanges) {
              setResults(reconciled);
              try {
                localStorage.setItem(WORKFLOW_RESULTS_KEY, JSON.stringify(reconciled));
              } catch {}
              console.log(`☁️ Réconcilié avec le cloud: ${reconciledKeys} étape(s)`);
            }
          }
        }
      } catch (e) {
        console.error('Cloud reconciliation error:', e);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      try {
        const raw = localStorage.getItem(LEGACY_PROGRESS_KEY);
        if (raw) return JSON.parse(raw).title;
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
