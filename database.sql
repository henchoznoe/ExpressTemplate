/*
 * Copyright (c) 2025 Noé Henchoz
 * Author: Noé Henchoz
 * File: database.sql
 * Title: Database setup script
 * Description: Sets up the initial 'users' table for user accounts.
 * Last modified: 2025-11-14
 */

-- 1. Create the 'users' table
-- This table will store user information, including hashed passwords.
CREATE TABLE public.users (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Add comments for clarity
COMMENT ON TABLE public.users IS 'Stores user account information and credentials.';
COMMENT ON COLUMN public.users.id IS 'Unique identifier for the user (UUID).';
COMMENT ON COLUMN public.users.email IS 'User''s email address, used for login (must be unique).';
COMMENT ON COLUMN public.users.password IS 'Hashed password for the user.';

-- 3. Disable Row Level Security (RLS) for the 'users' table
-- Our backend server will access this table directly using the anon key,
-- which acts as a service role in this context. We don't need RLS
-- as the table is not exposed directly to public clients.
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 4. Create a function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create a trigger on the 'users' table to use the function
-- This fires before any update on a row.
CREATE TRIGGER set_timestamp_on_users_update
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();
