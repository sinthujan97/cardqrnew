-- CardQR New Overhaul Database Tables

-- Create qr_codes table
CREATE TABLE IF NOT EXISTS public.qr_codes (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "qr_image_url" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "scan_count" INTEGER DEFAULT 0 NOT NULL
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "qr_code_id" UUID NOT NULL REFERENCES public.qr_codes("id") ON DELETE CASCADE,
    "section_name" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "description" TEXT,
    "price" TEXT NOT NULL,
    "image_url" TEXT,
    "allergens" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "display_order" INTEGER DEFAULT 0 NOT NULL
);

-- Enable RLS
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Policies for qr_codes
CREATE POLICY "Allow public read qr_codes" ON public.qr_codes FOR SELECT USING (true);
CREATE POLICY "Allow public insert qr_codes" ON public.qr_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update qr_codes" ON public.qr_codes FOR UPDATE USING (true) WITH CHECK (true);

-- Policies for menu_items
CREATE POLICY "Allow public read menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert menu_items" ON public.menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update menu_items" ON public.menu_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete menu_items" ON public.menu_items FOR DELETE USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS qr_codes_slug_idx ON public.qr_codes ("slug");
CREATE INDEX IF NOT EXISTS menu_items_qr_code_id_idx ON public.menu_items ("qr_code_id");
