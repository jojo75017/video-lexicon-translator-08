import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CloudWorkflowResult {
  id: string;
  user_id: string;
  project_title: string;
  step_id: string;
  step_result: any;
  display_content: string;
  generated_at: string;
  created_at: string;
  updated_at: string;
}

export const useWorkflowCloudSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Save a single step result to the cloud
  const saveStepToCloud = useCallback(async (
    projectTitle: string,
    stepId: string,
    result: any,
    displayContent: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('workflow_results' as any)
        .upsert({
          user_id: user.id,
          project_title: projectTitle,
          step_id: stepId,
          step_result: result,
          display_content: displayContent,
          generated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,project_title,step_id'
        });

      if (error) {
        console.error('Error saving step to cloud:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Cloud save error:', e);
      return false;
    }
  }, []);

  // Save all results to cloud at once
  const saveAllToCloud = useCallback(async (
    projectTitle: string,
    results: Record<string, { result: any; displayContent: string; generatedAt?: string }>
  ) => {
    setIsSyncing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsSyncing(false);
        return false;
      }

      const rows = Object.entries(results).map(([stepId, data]) => ({
        user_id: user.id,
        project_title: projectTitle,
        step_id: stepId,
        step_result: data.result,
        display_content: data.displayContent,
        generated_at: data.generatedAt || new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('workflow_results' as any)
        .upsert(rows, { onConflict: 'user_id,project_title,step_id' });

      if (error) {
        console.error('Error saving all to cloud:', error);
        toast.error('Erreur de synchronisation cloud');
        setIsSyncing(false);
        return false;
      }

      setLastSyncedAt(new Date().toISOString());
      setIsSyncing(false);
      return true;
    } catch (e) {
      console.error('Cloud save all error:', e);
      setIsSyncing(false);
      return false;
    }
  }, []);

  // Load all results from cloud for a project
  const loadFromCloud = useCallback(async (projectTitle: string): Promise<CloudWorkflowResult[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('workflow_results' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('project_title', projectTitle)
        .order('step_id');

      if (error) {
        console.error('Error loading from cloud:', error);
        return [];
      }

      return (data || []) as unknown as CloudWorkflowResult[];
    } catch (e) {
      console.error('Cloud load error:', e);
      return [];
    }
  }, []);

  // Load all project titles that have workflow results
  const loadProjectTitles = useCallback(async (): Promise<string[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('workflow_results' as any)
        .select('project_title')
        .eq('user_id', user.id);

      if (error) return [];

      const titles = [...new Set((data || []).map((r: any) => r.project_title))];
      return titles;
    } catch (e) {
      return [];
    }
  }, []);

  // Delete all results for a project
  const deleteProjectResults = useCallback(async (projectTitle: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('workflow_results' as any)
        .delete()
        .eq('user_id', user.id)
        .eq('project_title', projectTitle);

      if (error) return false;
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  return {
    isSyncing,
    lastSyncedAt,
    saveStepToCloud,
    saveAllToCloud,
    loadFromCloud,
    loadProjectTitles,
    deleteProjectResults,
  };
};
