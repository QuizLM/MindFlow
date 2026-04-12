
-- Create enum type for OWS status
CREATE TYPE public.ows_status AS ENUM ('mastered', 'tricky', 'review', 'clueless');

-- Add new columns to user_ows_interactions table
ALTER TABLE public.user_ows_interactions
ADD COLUMN IF NOT EXISTS status public.ows_status,
ADD COLUMN IF NOT EXISTS next_review_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS swipe_velocity float;

-- Create an index on next_review_at to speed up queries for 'Due for Review' items
CREATE INDEX IF NOT EXISTS idx_user_ows_interactions_next_review_at ON public.user_ows_interactions (next_review_at);
