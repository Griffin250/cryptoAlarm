-- Fix RLS policies for profile creation
-- Run this in your Supabase SQL Editor

-- Add missing INSERT policy for profiles
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Alternative: If the above doesn't work, drop and recreate all profile policies
-- DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
-- DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
-- DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- CREATE POLICY "Users can manage own profile" 
--   ON public.profiles FOR ALL 
--   USING (auth.uid() = id)
--   WITH CHECK (auth.uid() = id);