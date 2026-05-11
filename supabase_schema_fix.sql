-- ==========================================
-- SUPABASE SCHEMA FIX - RODOVAR TRACKING
-- ==========================================

-- Adicionando colunas que podem estar faltando na tabela motoristas
ALTER TABLE public.drivers 
ADD COLUMN IF NOT EXISTS plate text,
ADD COLUMN IF NOT EXISTS vehicle_model text,
ADD COLUMN IF NOT EXISTS cpf text,
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS status text;

-- Garantindo colunas na tabela de cargas (shipments)
ALTER TABLE public.shipments
ADD COLUMN IF NOT EXISTS tracking_code text,
ADD COLUMN IF NOT EXISTS status text,
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS customer_document text,
ADD COLUMN IF NOT EXISTS origin text,
ADD COLUMN IF NOT EXISTS destination text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS value numeric,
ADD COLUMN IF NOT EXISTS freight_value numeric,
ADD COLUMN IF NOT EXISTS driver_percentage numeric,
ADD COLUMN IF NOT EXISTS driver_id uuid REFERENCES public.drivers(id),
ADD COLUMN IF NOT EXISTS expected_delivery_date date,
ADD COLUMN IF NOT EXISTS proof_url text;

-- Garantindo colunas na tabela tracking_points
ALTER TABLE public.tracking_points
ADD COLUMN IF NOT EXISTS shipment_id uuid REFERENCES public.shipments(id),
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS accuracy numeric,
ADD COLUMN IF NOT EXISTS speed numeric,
ADD COLUMN IF NOT EXISTS heading numeric;

-- Garantindo colunas na tabela delivery_proofs
ALTER TABLE public.delivery_proofs
ADD COLUMN IF NOT EXISTS shipment_id uuid REFERENCES public.shipments(id),
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;
