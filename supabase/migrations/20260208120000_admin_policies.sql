-- Allow admins (app_metadata.role = 'admin') to manage profiles and matches

-- Profiles: select/update all when admin
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING ((auth.jwt()->'app_metadata'->>'role') = 'admin')
WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Matches: select/insert/update all when admin
CREATE POLICY "Admins can view all matches"
ON public.matches FOR SELECT
USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

CREATE POLICY "Admins can insert matches"
ON public.matches FOR INSERT
WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

CREATE POLICY "Admins can update matches"
ON public.matches FOR UPDATE
USING ((auth.jwt()->'app_metadata'->>'role') = 'admin')
WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');
