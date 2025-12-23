-- Drop existing constraint and add new one with 'lifetime' option
ALTER TABLE public.subscribers DROP CONSTRAINT subscribers_plan_type_check;

ALTER TABLE public.subscribers ADD CONSTRAINT subscribers_plan_type_check 
CHECK (plan_type = ANY (ARRAY['starter'::text, 'pro'::text, 'agency'::text, 'lifetime'::text]));