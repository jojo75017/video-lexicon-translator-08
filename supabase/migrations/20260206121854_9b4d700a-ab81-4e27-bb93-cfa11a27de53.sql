
-- Table pour sauvegarder les résultats du workflow P1-P14 dans le cloud
CREATE TABLE public.workflow_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_title TEXT NOT NULL,
  step_id TEXT NOT NULL,
  step_result JSONB,
  display_content TEXT,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, project_title, step_id)
);

-- Enable RLS
ALTER TABLE public.workflow_results ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own workflow results"
ON public.workflow_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workflow results"
ON public.workflow_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflow results"
ON public.workflow_results FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflow results"
ON public.workflow_results FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_workflow_results_updated_at
BEFORE UPDATE ON public.workflow_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
