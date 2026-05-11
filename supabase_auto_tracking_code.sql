-- ==========================================
-- GERADOR AUTOMÁTICO DE TRACKING CODE
-- Formato: rodo-10001, rodo-10002...
-- ==========================================

-- 1. Criar a sequência para os números (começando em 10001)
CREATE SEQUENCE IF NOT EXISTS shipment_tracking_seq START 10001;

-- 2. Criar a função que gera o código formatado
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'rodo-' || nextval('shipment_tracking_seq')::TEXT;
END;
$$ LANGUAGE plpgsql;

-- 3. Alterar a tabela shipments para usar a função como padrão (DEFAULT)
-- Isso garante que, se você não enviar um tracking_code, o Supabase gera um automático.
ALTER TABLE public.shipments 
ALTER COLUMN tracking_code SET DEFAULT generate_tracking_code();

-- 4. (Opcional) Garantir que o código seja único e não nulo
ALTER TABLE public.shipments 
ALTER COLUMN tracking_code SET NOT NULL;

-- Se já houver um índice único, pule. Caso contrário:
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_shipments_tracking_code ON public.shipments(tracking_code);
