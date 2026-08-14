DROP POLICY IF EXISTS "Users manage their own v3 projects" ON public.v3_workflow_projects;
CREATE POLICY "Users manage their own v3 projects"
ON public.v3_workflow_projects FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own workflow results" ON public.workflow_results;
CREATE POLICY "Users can view their own workflow results"
ON public.workflow_results FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own workflow results" ON public.workflow_results;
CREATE POLICY "Users can insert their own workflow results"
ON public.workflow_results FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own workflow results" ON public.workflow_results;
CREATE POLICY "Users can update their own workflow results"
ON public.workflow_results FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own workflow results" ON public.workflow_results;
CREATE POLICY "Users can delete their own workflow results"
ON public.workflow_results FOR DELETE TO authenticated
USING (auth.uid() = user_id);