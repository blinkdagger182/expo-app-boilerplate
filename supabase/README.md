# Supabase Configuration Guide

## Database Issues Fixed

The application was encountering several database-related errors:

1. **Row-Level Security (RLS) policy error** when creating a profile during signup
2. **Missing profile error** when fetching a user's profile
3. **Missing relationship between posts and profiles tables**

### Solution

We've implemented comprehensive fixes for all these issues:

1. **Modified the signup function** in `services/supabase.ts` to be more resilient to RLS errors and to store the user's name in the auth metadata.

2. **Created a database trigger** that automatically creates a profile when a new user signs up, which bypasses the RLS policy issue.

3. **Enhanced the getProfile method** to handle cases where a profile doesn't exist by creating a default one.

4. **Improved the getPosts method** to handle missing relationships between tables by using a fallback approach.

5. **Created SQL migrations** to set up all required tables with proper relationships and security policies.

## How to Apply the Database Fixes

1. Log in to your Supabase dashboard at [https://app.supabase.com/](https://app.supabase.com/)
2. Navigate to your project
3. Go to the SQL Editor
4. Copy the contents of the `migrations/create_profile_trigger.sql` file
5. Paste and run the SQL in the editor

This will:
- Create the profiles table if it doesn't exist
- Create the posts table with proper foreign key relationship to profiles
- Set up a trigger to automatically create a profile when a user signs up
- Configure appropriate RLS policies for both tables

## Database Schema

The SQL migration creates the following tables:

### profiles
- `id`: UUID (primary key, references auth.users)
- `name`: TEXT
- `avatar_url`: TEXT
- `updated_at`: TIMESTAMP WITH TIME ZONE

### posts
- `id`: SERIAL (primary key)
- `user_id`: UUID (foreign key references profiles.id)
- `image_url`: TEXT
- `caption`: TEXT
- `likes`: INTEGER
- `detection_result`: JSONB
- `deleted`: BOOLEAN
- `created_at`: TIMESTAMP WITH TIME ZONE

## Environment Variables

Make sure your `.env` file contains the correct Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

After applying these changes, the application should work without encountering database-related errors. The code has been made resilient to handle cases where tables or relationships don't exist yet.
