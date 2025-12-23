-- Add explicit deny policies for scheme_recommendations to document intent
-- This makes it clear that only service-role operations can write to this table

-- Policy to explicitly prevent client inserts
CREATE POLICY "Prevent client inserts on scheme_recommendations"
ON public.scheme_recommendations
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Policy to explicitly prevent client updates
CREATE POLICY "Prevent client updates on scheme_recommendations"
ON public.scheme_recommendations
FOR UPDATE
TO authenticated
USING (false);

-- Policy to explicitly prevent client deletes
CREATE POLICY "Prevent client deletes on scheme_recommendations"
ON public.scheme_recommendations
FOR DELETE
TO authenticated
USING (false);