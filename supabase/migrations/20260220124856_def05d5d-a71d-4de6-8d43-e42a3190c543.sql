-- Allow admins to view all subscribers
CREATE POLICY "Admins can view all subscribers"
ON public.subscribers
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update all subscribers
CREATE POLICY "Admins can update all subscribers"
ON public.subscribers
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete subscribers
CREATE POLICY "Admins can delete subscribers"
ON public.subscribers
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));