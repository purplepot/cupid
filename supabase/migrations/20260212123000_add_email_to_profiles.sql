-- Add email column to profiles for sharing contact between matched users
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email text;
