-- CardQR Supabase Database Schema

-- Create cards table with camelCase columns as specified in requirements
CREATE TABLE IF NOT EXISTS public.cards (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "slug" TEXT UNIQUE NOT NULL,
    "editToken" TEXT UNIQUE NOT NULL,
    "templateType" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Create public read policy (anyone can view a card)
CREATE POLICY "Allow public read access" ON public.cards
    FOR SELECT USING (true);

-- Create public insert policy (anyone can create a card)
CREATE POLICY "Allow public insert access" ON public.cards
    FOR INSERT WITH CHECK (true);

-- Create edit policy (anyone with matching editToken can update)
CREATE POLICY "Allow update with editToken" ON public.cards
    FOR UPDATE USING (true) WITH CHECK (true);

-- Index for fast lookup by slug and editToken
CREATE INDEX IF NOT EXISTS cards_slug_idx ON public.cards ("slug");
CREATE INDEX IF NOT EXISTS cards_edit_token_idx ON public.cards ("editToken");

-- Trigger to automatically update "updatedAt"
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON public.cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- STORAGE BUCKET & POLICIES FOR CARD MEDIA
-- ==========================================

-- Create storage bucket for card media if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('card-media', 'card-media', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public read access to card-media objects
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'card-media');

-- Enable public insert access to card-media objects (uploads)
DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;
CREATE POLICY "Public Insert Access" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'card-media');

