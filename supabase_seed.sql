-- ==========================================
-- SUPABASE SEED - RODOVAR TRACKING
-- ==========================================

-- Limpar dados existentes para evitar duplicatas ao rodar várias vezes
TRUNCATE TABLE public.delivery_proofs, public.tracking_points, public.shipments, public.drivers RESTART IDENTITY CASCADE;

-- ==========================================
-- 1. INSERIR MOTORISTAS FICTÍCIOS
-- ==========================================
INSERT INTO public.drivers (id, name, phone, cpf, plate, vehicle_model, status, created_at) VALUES
('d1111111-1111-1111-1111-111111111111', 'João Carlos Silva', '(11) 98888-1111', '123.456.789-00', 'ABC-1234', 'Volvo FH 460', 'ativo', now()),
('d2222222-2222-2222-2222-222222222222', 'Maria de Souza', '(21) 97777-2222', '234.567.890-11', 'XYZ-9876', 'Scania R450', 'ativo', now()),
('d3333333-3333-3333-3333-333333333333', 'Carlos Eduardo Mendes', '(31) 96666-3333', '345.678.901-22', 'DEF-5678', 'Mercedes-Benz Actros', 'ativo', now()),
('d4444444-4444-4444-4444-444444444444', 'Ana Luiza Costa', '(41) 95555-4444', '456.789.012-33', 'GHI-9012', 'DAF XF 530', 'inativo', now()),
('d5555555-5555-5555-5555-555555555555', 'Roberto Rocha', '(51) 94444-5555', '567.890.123-44', 'JKL-3456', 'VW Meteor 29.520', 'ativo', now());

-- ==========================================
-- 2. INSERIR CARGAS FICTÍCIAS
-- ==========================================
-- Status Permitidos: 'pendente', 'em_transito', 'entregue', 'cancelado' 
INSERT INTO public.shipments (id, tracking_code, status, customer_name, customer_document, origin, destination, description, value, freight_value, driver_percentage, driver_id, expected_delivery_date, created_at, updated_at) VALUES
-- 1. Pendente (ainda não atribuída a um motorista)
('s0000000-0000-0000-0000-000000000001', 'ROD-2025-0001', 'pendente', 'Indústria ABC Ltda', '11.111.111/0001-11', 'São Paulo, SP', 'Rio de Janeiro, RJ', 'Peças Automotivas', 50000.00, 1500.00, 70, NULL, CURRENT_DATE + INTERVAL '2 days', now() - INTERVAL '1 day', now()),

-- 2. Pendente (Atribuída, mas com viagem não iniciada)
('s0000000-0000-0000-0000-000000000002', 'ROD-2025-0002', 'pendente', 'Comércio Beta SA', '22.222.222/0001-22', 'Curitiba, PR', 'Florianópolis, SC', 'Eletrônicos Diversos', 120000.00, 800.00, 75, 'd1111111-1111-1111-1111-111111111111', CURRENT_DATE + INTERVAL '1 day', now() - INTERVAL '2 hours', now()),

-- 3. Em Trânsito (Saindo de SP para BH)
('s0000000-0000-0000-0000-000000000003', 'ROD-2025-0003', 'em_transito', 'Farmacêutica Gama', '33.333.333/0001-33', 'Campinas, SP', 'Belo Horizonte, MG', 'Medicamentos Refrigerados', 350000.00, 4500.00, 80, 'd2222222-2222-2222-2222-222222222222', CURRENT_DATE + INTERVAL '1 day', now() - INTERVAL '12 hours', now() - INTERVAL '1 hour'),

-- 4. Em Trânsito (Saindo do RS para SP)
('s0000000-0000-0000-0000-000000000004', 'ROD-2025-0004', 'em_transito', 'Agropecuária Delta', '44.444.444/0001-44', 'Porto Alegre, RS', 'São Paulo, SP', 'Insumos Agrícolas', 85000.00, 3200.00, 75, 'd3333333-3333-3333-3333-333333333333', CURRENT_DATE + INTERVAL '3 days', now() - INTERVAL '2 days', now() - INTERVAL '2 hours'),

-- 5. Em Trânsito (Saindo de GO para SP)
('s0000000-0000-0000-0000-000000000005', 'ROD-2025-0005', 'em_transito', 'Atacadista Omega', '55.555.555/0001-55', 'Goiânia, GO', 'Ribeirão Preto, SP', 'Alimentos Secos', 150000.00, 2800.00, 70, 'd5555555-5555-5555-5555-555555555555', CURRENT_DATE + INTERVAL '2 days', now() - INTERVAL '1 day', now()),

-- 6. Entregue (Comprovante será adicionado depois)
('s0000000-0000-0000-0000-000000000006', 'ROD-2025-0006', 'entregue', 'Construtora Zeta', '66.666.666/0001-66', 'Belo Horizonte, MG', 'Vitória, ES', 'Materiais de Construção', 45000.00, 1800.00, 75, 'd1111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 day', now() - INTERVAL '5 days', now() - INTERVAL '1 day'),

-- 7. Entregue
('s0000000-0000-0000-0000-000000000007', 'ROD-2025-0007', 'entregue', 'Tech Solutions', '77.777.777/0001-77', 'Manaus, AM', 'São Paulo, SP', 'Equipamentos de T.I', 500000.00, 12000.00, 85, 'd2222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '2 days', now() - INTERVAL '10 days', now() - INTERVAL '2 days'),

-- 8. Cancelado
('s0000000-0000-0000-0000-000000000008', 'ROD-2025-0008', 'cancelado', 'Comércio Beta SA', '22.222.222/0001-22', 'Curitiba, PR', 'Brasília, DF', 'Móveis Planejados', 30000.00, 2100.00, 70, NULL, CURRENT_DATE + INTERVAL '5 days', now() - INTERVAL '2 days', now() - INTERVAL '1 day'),

-- 9. Pendente
('s0000000-0000-0000-0000-000000000009', 'ROD-2025-0009', 'pendente', 'Indústria ABC Ltda', '11.111.111/0001-11', 'São Paulo, SP', 'Salvador, BA', 'Maquinário Pesado', 750000.00, 8500.00, 80, 'd5555555-5555-5555-5555-555555555555', CURRENT_DATE + INTERVAL '4 days', now() - INTERVAL '3 hours', now()),

-- 10. Em Trânsito
('s0000000-0000-0000-0000-000000000010', 'ROD-2025-0010', 'em_transito', 'Logística Global', '88.888.888/0001-88', 'Santos, SP', 'Campo Grande, MS', 'Carga Contêiner Mista', 180000.00, 4200.00, 75, 'd3333333-3333-3333-3333-333333333333', CURRENT_DATE + INTERVAL '2 days', now() - INTERVAL '1 day', now() - INTERVAL '30 minutes');


-- ==========================================
-- 3. INSERIR PONTOS DE RASTREAMENTO (TRACKING POINTS)
-- ==========================================
INSERT INTO public.tracking_points (id, shipment_id, latitude, longitude, accuracy, speed, heading, created_at) VALUES

-- Carga 3 (SP -> BH)
(gen_random_uuid(), 's0000000-0000-0000-0000-000000000003', -22.9056, -47.0608, 10.0, 60.0, 45.0, now() - INTERVAL '10 hours'), -- Campinas
(gen_random_uuid(), 's0000000-0000-0000-0000-000000000003', -22.1225, -45.9419, 15.0, 80.0, 50.0, now() - INTERVAL '6 hours'), -- Pouso Alegre
(gen_random_uuid(), 's0000000-0000-0000-0000-000000000003', -20.9130, -44.5901, 12.0, 75.0, 48.0, now() - INTERVAL '2 hours'), -- Três Corações

-- Carga 4 (RS -> SP)
(gen_random_uuid(), 's0000000-0000-0000-0000-000000000004', -30.0346, -51.2177, 8.0, 40.0, 10.0, now() - INTERVAL '20 hours'), -- RS Origem
(gen_random_uuid(), 's0000000-0000-0000-0000-000000000004', -27.5954, -48.5480, 12.0, 85.0, 15.0, now() - INTERVAL '12 hours'), -- SC
(gen_random_uuid(), 's0000000-0000-0000-0000-000000000004', -25.4284, -49.2733, 10.0, 0.0, 0.0, now() - INTERVAL '4 hours'), -- Parada em PR

-- Carga 5 (GO -> SP)
(gen_random_uuid(), 's0000000-0000-0000-0000-000000000005', -16.6869, -49.2648, 5.0, 55.0, 160.0, now() - INTERVAL '8 hours'),
(gen_random_uuid(), 's0000000-0000-0000-0000-000000000005', -18.9186, -48.2772, 8.0, 70.0, 165.0, now() - INTERVAL '3 hours'),

-- Carga 10 (Santos -> Campo Grande)
(gen_random_uuid(), 's0000000-0000-0000-0000-000000000010', -23.9618, -46.3322, 10.0, 45.0, 300.0, now() - INTERVAL '15 hours'),
(gen_random_uuid(), 's0000000-0000-0000-0000-000000000010', -22.1265, -51.3857, 15.0, 88.0, 310.0, now() - INTERVAL '5 hours'); -- Presidente Prudente (a caminho)


-- ==========================================
-- 4. INSERIR COMPROVANTES (DELIVERY PROOFS)
-- ==========================================
-- Apenas para entregues
INSERT INTO public.delivery_proofs (id, shipment_id, image_url, latitude, longitude, created_at) VALUES
(gen_random_uuid(), 's0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1621861214040-fb9741b8c2bc?q=80&w=400&auto=format&fit=crop', -20.3155, -40.3128, now() - INTERVAL '1 day'),
(gen_random_uuid(), 's0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7a?q=80&w=400&auto=format&fit=crop', -23.5505, -46.6333, now() - INTERVAL '2 days');
