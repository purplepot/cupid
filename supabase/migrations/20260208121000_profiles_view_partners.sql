-- Allow users to view the profile of their matched partner
CREATE POLICY "Users can view their matched partner profiles"
ON public.profiles FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.matches m
    WHERE m.user_id = auth.uid() AND m.matched_user_id = profiles.user_id
  )
  OR EXISTS (
    SELECT 1 FROM public.matches m
    WHERE m.matched_user_id = auth.uid() AND m.user_id = profiles.user_id
  )
);
