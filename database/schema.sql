SET NAMES utf8mb4;
DROP DATABASE IF EXISTS acolhemar;
CREATE DATABASE acolhemar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE acolhemar;

-- 1. Tabela Doador
CREATE TABLE doador (
    id_doador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- 2. Tabela Categoria (deve ser criada antes de Item)
CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL
);

-- 3. Tabela Item
CREATE TABLE item (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
    prioridade VARCHAR(20) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria)
);

-- 4. Tabela Doacao
CREATE TABLE doacao (
    id_doacao INT AUTO_INCREMENT PRIMARY KEY,
    id_doador INT NOT NULL,
    data_doacao DATE NOT NULL,
    descricao TEXT,
    status VARCHAR(30) NOT NULL,
    data_entrega DATE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_doador) REFERENCES doador (id_doador)
);

-- 5. Tabela Associativa Doacao_Item (Relacionamento N:N)
CREATE TABLE doacao_item (
    id_doacao INT NOT NULL,
    id_item INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    PRIMARY KEY (id_doacao, id_item),
    FOREIGN KEY (id_doacao) REFERENCES doacao (id_doacao) ON DELETE CASCADE,
    FOREIGN KEY (id_item) REFERENCES item (id_item)
);