-- AcolheMar - seed.sql
-- Dados iniciais para testes do MVP (rodar após o schema.sql)

SET NAMES utf8mb4;
USE acolhemar;

INSERT INTO categoria (nome) VALUES
  ('Alimentos'),
  ('Higiene'),
  ('Vestuário');

INSERT INTO item (id_categoria, nome, quantidade, prioridade, ativo) VALUES
  (1, 'Arroz 5 kg', 60, 'Alta', TRUE),
  (1, 'Feijão 1 kg', 45, 'Alta', TRUE),
  (1, 'Óleo de soja 900 ml', 20, 'Média', TRUE),
  (1, 'Leite em pó 400 g', 15, 'Alta', TRUE),
  (2, 'Sabonete', 28, 'Média', TRUE),
  (2, 'Pasta dental', 15, 'Média', TRUE),
  (2, 'Fralda infantil', 10, 'Alta', TRUE),
  (3, 'Camiseta', 38, 'Baixa', TRUE),
  (3, 'Agasalho', 20, 'Alta', TRUE),
  (3, 'Cobertor', 12, 'Alta', TRUE);

INSERT INTO doador (nome, cpf, email, telefone) VALUES
  ('Ana Souza', '123.456.789-00', 'ana@email.com', '(14) 99999-0001'),
  ('Bruno Lima', '234.567.890-11', 'bruno@email.com', '(14) 98888-0002'),
  ('Carla Dias', '345.678.901-22', 'carla@email.com', '(14) 97777-0003'),
  ('Davi Alves', '456.789.012-33', 'davi@email.com', '(14) 96666-0004');

INSERT INTO doacao (id_doador, data_doacao, descricao, status, data_entrega) VALUES
  (1, '2026-10-12', 'Doação mensal de alimentos básicos', 'Entregue', '2026-10-14'),
  (2, '2026-10-13', 'Itens recolhidos na campanha do bairro', 'Pendente', NULL),
  (3, '2026-10-15', 'Roupas e itens de higiene pessoal', 'Entregue', '2026-10-16');

INSERT INTO doacao_item (id_doacao, id_item, quantidade) VALUES
  (1, 1, 10),
  (1, 2, 15),
  (2, 9, 10),
  (2, 10, 5),
  (3, 5, 12),
  (3, 6, 8),
  (3, 8, 10);