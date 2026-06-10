CREATE TABLE public.v3_workflow_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Mon livre',
  theme TEXT NOT NULL DEFAULT '',
  brief JSONB NOT NULL DEFAULT '{}'::jsonb,
  done JSONB NOT NULL DEFAULT '[]'::jsonb,
  results JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.v3_workflow_projects TO authenticated;
GRANT ALL ON public.v3_workflow_projects TO service_role;

ALTER TABLE public.v3_workflow_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own v3 projects"
ON public.v3_workflow_projects FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_v3_workflow_projects_updated_at
BEFORE UPDATE ON public.v3_workflow_projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();