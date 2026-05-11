-- ==========================================
-- SUPABASE COMPLETE SETUP - RODOVAR TRACKING
-- ==========================================

-- 1. EXTENSÕES
-- Habilita geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. LIMPEZA (OPCIONAL - CUIDADO)
-- Se quiser começar do zero absoluto, descomente as linhas abaixo:
-- DROP TABLE IF EXISTS public.delivery_proofs CASCADE;
-- DROP TABLE IF EXISTS public.tracking_points CASCADE;
-- DROP TABLE IF EXISTS public.shipments CASCADE;
-- DROP TABLE IF EXISTS public.drivers CASCADE;
-- DROP SEQUENCE IF EXISTS shipment_tracking_seq CASCADE;

-- 3. SEQUÊNCIA E FUNÇÃO PARA TRACKING CODE AUTOMÁTICO
CREATE SEQUENCE IF NOT EXISTS shipment_tracking_seq START 10001;

CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'rodo-' || nextval('shipment_tracking_seq')::TEXT;
END;
$$ LANGUAGE plpgsql;

-- 4. TABELA: MOTORISTAS (DRIVERS)
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT,
    cpf TEXT,
    plate TEXT,
    vehicle_model TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABELA: CARGAS (SHIPMENTS)
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code TEXT UNIQUE DEFAULT generate_tracking_code(),
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_transito', 'entregue', 'cancelado')),
    customer_name TEXT NOT NULL,
    customer_document TEXT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    description TEXT,
    value NUMERIC DEFAULT 0,
    freight_value NUMERIC DEFAULT 0,
    driver_percentage NUMERIC DEFAULT 0,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    expected_delivery_date DATE,
    proof_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Gatilho para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON public.shipments
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- 6. TABELA: PONTOS DE RASTREAMENTO (TRACKING POINTS)
CREATE TABLE IF NOT EXISTS public.tracking_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    accuracy NUMERIC,
    speed NUMERIC,
    heading NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. TABELA: COMPROVANTES DE ENTREGA (DELIVERY PROOFS)
CREATE TABLE IF NOT EXISTS public.delivery_proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_proofs ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA ADMINS (Auth)
CREATE POLICY "Admin total drivers" ON public.drivers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total shipments" ON public.shipments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total tracking" ON public.tracking_points FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin total proofs" ON public.delivery_proofs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- POLÍTICAS PÚBLICAS / MOTORISTAS (Anon)
CREATE POLICY "Anon read shipments" ON public.shipments FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read drivers" ON public.drivers FOR SELECT TO anon USING (true);
CREATE POLICY "Anon update shipments" ON public.shipments FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon insert tracking" ON public.tracking_points FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon select tracking" ON public.tracking_points FOR SELECT TO anon USING (true);

CREATE POLICY "Anon insert proofs" ON public.delivery_proofs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon select proofs" ON public.delivery_proofs FOR SELECT TO anon USING (true);

-- ==========================================
-- 9. STORAGE (BUCKETS)
-- ==========================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('delivery-proofs', 'delivery-proofs', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public delivery-proofs upload" 
ON storage.objects FOR INSERT TO public 
WITH CHECK ( bucket_id = 'delivery-proofs' );

CREATE POLICY "Public delivery-proofs download" 
ON storage.objects FOR SELECT TO public 
USING ( bucket_id = 'delivery-proofs' );

-- ==========================================
-- 10. SEED DATA (OPCIONAL)
-- ==========================================

-- Se quiser inserir dados iniciais, pode rodar o seed depois desse script.
