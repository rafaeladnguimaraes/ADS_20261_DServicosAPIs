CREATE DATABASE bd_dsapi;
USE bd_dsapi;


CREATE TABLE cidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    altura DOUBLE,
    nascimento DATE,
    cidade_id INT,
    FOREIGN KEY (cidade_id) REFERENCES cidades(id)
);
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DOUBLE NOT NULL,
    quantidade DOUBLE NOT NULL,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    horario DATETIME NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    cliente_id INT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
CREATE TABLE pedidos_produtos (
    pedido_id INT,
    produto_id INT,
    preco DOUBLE NOT NULL,
    quantidade DOUBLE NOT NULL,
    PRIMARY KEY (pedido_id, produto_id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);