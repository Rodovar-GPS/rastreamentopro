-- ==========================================
-- NOVO SEED - 5 CARGAS PRINCIPAIS
-- ==========================================

-- Limpar dados para evitar duplicatas (CUIDADO: isso apaga o que houver nas tabelas)
TRUNCATE TABLE public.delivery_proofs, public.tracking_points, public.shipments, public.drivers RESTART IDENTITY CASCADE;

-- 1. MOTORISTAS
INSERT INTO public.drivers (id, name, phone, cpf, plate, vehicle_model, status) VALUES
('d1111111-1111-1111-1111-111111111111', 'Ricardo Oliveira', '(11) 91234-5678', '111.222.333-44', 'BRA-2E19', 'Volvo FH 540', 'ativo'),
('d2222222-2222-2222-2222-222222222222', 'Fernanda Santos', '(21) 98888-7777', '222.333.444-55', 'RIO-4K21', 'Scania R450', 'ativo'),
('d3333333-3333-3333-3333-333333333333', 'Marcos Pereira', '(31) 97777-6666', '333.444.555-66', 'MGH-9J12', 'Mercedes Actros', 'ativo'),
('d4444444-4444-4444-4444-444444444444', 'Juliana Lima', '(41) 96666-5555', '444.555.666-77', 'PRT-1A34', 'DAF XF', 'ativo'),
('d5555555-5555-5555-5555-555555555555', 'Antônio Silva', '(51) 95555-4444', '555.666.777-88', 'SUL-8B56', 'VW Meteor', 'ativo');

-- 2. CARGAS (5 Cadastros)
-- Note: O tracking_code rodo-XXXXX é gerado automaticamente se omitido, 
-- mas aqui inserimos manualmente para garantir os IDs do seed.
INSERT INTO public.shipments (id, tracking_code, status, customer_name, customer_document, origin, destination, description, value, freight_value, driver_percentage, driver_id, expected_delivery_date) VALUES
(gen_random_uuid(), 'rodo-10001', 'em_transito', 'Logística Express', '00.111.222/0001-33', 'São Paulo, SP', 'Rio de Janeiro, RJ', 'Eletrônicos de consumo', 85000.00, 1200.00, 70, 'd1111111-1111-1111-1111-111111111111', CURRENT_DATE + INTERVAL '1 day'),
(gen_random_uuid(), 'rodo-10002', 'em_transito', 'Supermercados Silva', '44.555.666/0001-77', 'Curitiba, PR', 'Porto Alegre, RS', 'Alimentos perecíveis', 42000.00, 950.00, 75, 'd2222222-2222-2222-2222-222222222222', CURRENT_DATE + INTERVAL '2 days'),
(gen_random_uuid(), 'rodo-10003', 'pendente', 'Indústria Química SA', '77.888.999/0001-00', 'Belo Horizonte, MG', 'Vitória, ES', 'Insumos industriais', 150000.00, 2500.00, 80, 'd3333333-3333-3333-3333-333333333333', CURRENT_DATE + INTERVAL '3 days'),
(gen_random_uuid(), 'rodo-10004', 'entregue', 'Varejo Total', '12.345.678/0001-99', 'Goiânia, GO', 'Brasília, DF', 'Móveis de escritório', 28000.00, 600.00, 70, 'd4444444-4444-4444-4444-444444444444', CURRENT_DATE - INTERVAL '1 day'),
(gen_random_uuid(), 'rodo-10005', 'cancelado', 'E-commerce Brasil', '99.888.777/0002-11', 'Santos, SP', 'Cuiabá, MT', 'Vestuário e Calçados', 60000.00, 3200.00, 75, NULL, CURRENT_DATE + INTERVAL '5 days');



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
