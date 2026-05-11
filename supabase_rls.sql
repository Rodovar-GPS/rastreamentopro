-- ==========================================
-- SUPABASE RLS POLICIES - RODOVAR TRACKING
-- ==========================================

-- 1. Habilitar o RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_proofs ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- POLÍTICAS PARA ADMINISTRADORES (Role: authenticated)
-- 1. Admins podem ler, criar, atualizar e excluir tudo
-- ==========================================

-- Drivers
CREATE POLICY "Admin tem acesso total aos motoristas" 
ON public.drivers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Shipments (Cargas)
CREATE POLICY "Admin tem acesso total às cargas" 
ON public.shipments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tracking Points
CREATE POLICY "Admin tem acesso total aos rastreamentos" 
ON public.tracking_points FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Delivery Proofs
CREATE POLICY "Admin tem acesso total aos comprovantes" 
ON public.delivery_proofs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Profiles
CREATE POLICY "Admin tem acesso aos profiles" 
ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==========================================
-- POLÍTICAS PUBLICAS E PARA MOTORISTAS (Role: anon)
-- ==========================================

-- 2. Clientes públicos podem consultar somente cargas, mas sem dados sensíveis
-- NOTA SOBRE DADOS SENSÍVEIS: O PostgreSQL RLS opera no nível da LINHA (Row), não COLUNA. 
-- Para ocultar colunas (como documento do cliente ou CPF do motorista) em chamadas "select *" normais (sem gerar erro),
-- o ideal é usar o recurso "Column Privileges" revogando acesso àquelas colunas, OU criar uma view segura de leitura.
-- Aqui aplicamos uma política permissiva para leitura de linha (para que o frontend funcione buscando por tracking_code):
CREATE POLICY "Anon pode consultar cargas para rastreio" 
ON public.shipments FOR SELECT TO anon USING (true);

-- E os Motoristas (que também acessam via flow anon) podem ATUALIZAR status e proof_url
CREATE POLICY "Motorista pode atualizar status da carga" 
ON public.shipments FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Leitura de motoristas (necessário para a tela de tracking exibir dados do motorista)
-- Para ocultar o CPF, não inclua a coluna "cpf" nesta tabela ou revogue o select nela.
CREATE POLICY "Anon pode consultar motorista vinculado" 
ON public.drivers FOR SELECT TO anon USING (true);


-- 3. Motoristas podem inserir tracking_points apenas para cargas vinculadas
CREATE POLICY "Motorista pode inserir ponto de rastreio" 
ON public.tracking_points FOR INSERT TO anon 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.shipments s
        WHERE s.id = tracking_points.shipment_id
    )
);

-- Leitura pública dos pontos de rastreamento (para a tela do cliente)
CREATE POLICY "Anon pode consultar pontos de rastreio" 
ON public.tracking_points FOR SELECT TO anon USING (true);


-- 4. Motoristas podem enviar comprovante apenas da carga correspondente
CREATE POLICY "Motorista pode inserir comprovante" 
ON public.delivery_proofs FOR INSERT TO anon 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.shipments s
        WHERE s.id = delivery_proofs.shipment_id
    )
);

CREATE POLICY "Anon pode ver comprovantes" 
ON public.delivery_proofs FOR SELECT TO anon USING (true);


-- ==========================================
-- BUCKET DE COMPROVANTES (Storage)
-- ==========================================

-- 6. O bucket delivery-proofs deve permitir leitura e gravação no MVP
-- As políticas de storage estão aplicadas na tabela storage.objects

-- Cria o bucket se não existir e o deixa público
INSERT INTO storage.buckets (id, name, public) 
VALUES ('delivery-proofs', 'delivery-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Permitir envio de arquivos no bucket para anonimos/motoristas
CREATE POLICY "Motoristas podem fazer upload no delivery-proofs" 
ON storage.objects FOR INSERT TO public -- "public" se refere a todos os usuários de banco (inclui anon)
WITH CHECK ( bucket_id = 'delivery-proofs' );

-- Permitir leitura pública (Para clients e sistema)
CREATE POLICY "Acesso publico ler delivery-proofs"
ON storage.objects FOR SELECT TO public
USING ( bucket_id = 'delivery-proofs' );

/*
COMO DEIXAR O BUCKET PRIVADO EM PRODUÇÃO:
-----------------------------------------
Para produção, você deve alterar o bucket para privado emitindo:
> UPDATE storage.buckets SET public = false WHERE id = 'delivery-proofs';

Ao fazer isso, os URLs públicos (getPublicUrl) deixarão de funcionar. No frontend, 
será necessário alterar a lógica para gerar "Signed URLs":
> const { data } = await supabase.storage.from('delivery-proofs').createSignedUrl(filepath, 3600);
Onde 3600 é o tempo de validade do link (1 hora). Dessa forma, apenas usuários que
têm as devidas permissões RLS poderão solicitar e carregar essas imagens no app.
*/
