# Authentication Setup Guide

## Overview
This application uses Supabase for authentication with email/password login and user management.

## Setup Instructions

### 1. Supabase Project Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Settings → API
3. Copy your project URL and anon key

### 2. Environment Configuration
1. Copy `.env.local.example` to `.env.local` in the frontend directory
2. Replace the placeholder values with your actual Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 3. Database Schema
The authentication system expects a `profiles` table to store additional user information. Run this SQL in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create a trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 4. Authentication Features

#### Login/Register Modal
- Accessible via profile icon in navbar
- Validates email format and password strength
- Switches between login and register modes
- Shows loading states and error messages

#### User Profile Management
- Profile page displays user information
- Logout functionality in navbar
- Session persistence across browser refreshes

#### Protected Routes
- Authentication state is managed via AuthContext
- Components can use `useAuth()` hook to check authentication status
- Unauthenticated users see login modal when clicking profile icon

### 5. Usage Example

```jsx
import { useAuth } from '../lib/AuthContext';

function MyComponent() {
  const { user, profile, isAuthenticated, signOut } = useAuth();
  
  if (isAuthenticated) {
    return (
      <div>
        Welcome, {profile?.first_name}!
        <button onClick={signOut}>Logout</button>
      </div>
    );
  }
  
  return <div>Please log in</div>;
}
```

### 6. Testing
1. Start the development server: `npm run dev`
2. Click the profile icon in the navbar
3. Try registering a new account
4. Test login with the created account
5. Verify logout functionality
6. Check session persistence by refreshing the page

## Troubleshooting

### "Authentication service is not configured"
- Ensure `.env.local` exists with correct Supabase credentials
- Restart the development server after adding environment variables

### Registration not working
- Check that the profiles table exists in Supabase
- Verify the trigger function is created
- Check Supabase logs for errors

### Login redirects or errors
- Ensure email confirmation is disabled in Supabase Auth settings (for development)
- Check that RLS policies are correctly configured