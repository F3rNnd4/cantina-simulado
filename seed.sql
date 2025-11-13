CREATE DATABASE cantina;
\c cantina;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    funcao VARCHAR(20) DEFAULT 'funcionario'
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL
);

CREATE TABLE estoque (
    id SERIAL PRIMARY KEY,
    produto_id INT REFERENCES produtos(id),
    quantidade INT NOT NULL
);

CREATE TABLE vendas (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    produto_id INT REFERENCES produtos(id),
    quantidade_produto INT NOT NULL
);

INSERT INTO usuarios (nome, email, senha, funcao) VALUES
('Maryna Silva', 'marynasilva@gmail.com', 'marynaA123', 'admin'),
('Roberto Lima', 'roberto.lima@yahoo.com', 'roberto123', 'funcionario');

INSERT INTO produtos (nome, preco) VALUES
('Salgado assado de frango', 7.0),
('Refrigerante lata 350ml', 5.0);

INSERT INTO estoque (produto_id, quantidade) VALUES
(1, 100),
(2, 200);

INSERT INTO vendas (usuario_id, produto_id, quantidade_produto) VALUES 
(2, 2, 3),
(1, 2, 1),
(1, 1, 1);