const express = require("express");
const knex = require("knex");
const http_errors = require("http-errors");

const PORT = 8001;
const HOSTNAME = "localhost";

const api = express();
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

const conn = knex({
    client: "mysql2",
    connection: {
        host: HOSTNAME,
        user: "root",
        password: "",
        database: "bd_dsapi"
    }
});


api.get("/", (req, res, next) => {
    res.json({ resposta: "API - Atividade 1" });
});

/* ==========================================
   ROTAS DE CATEGORIAS
   ========================================== */

// Listar todas as categorias
api.get("/categorias", (req, res, next) => {
    conn("categorias")
        .then(dados => res.json(dados))
        .catch(next);
});

// Buscar uma categoria por ID
api.get("/categorias/:id", (req, res, next) => {
    const { id } = req.params;
    conn("categorias")
        .where("id", id)
        .first()
        .then(dados => {
            if (!dados) return next(http_errors(404, "Categoria não encontrada"));
            res.json(dados);
        })
        .catch(next);
});

// Criar nova categoria (Recurso Admin)
api.post("/categorias", (req, res, next) => {
    conn("categorias")
        .insert(req.body)
        .then(dados => {
            res.status(201).json({ resposta: "Categoria inserida", id: dados[0] });
        })
        .catch(next);
});

// Atualizar categoria (Recurso Admin)
api.put("/categorias/:id", (req, res, next) => {
    const { id } = req.params;
    conn("categorias")
        .where("id", id)
        .update(req.body)
        .then(dados => {
            if (!dados) return next(http_errors(404, "Erro ao editar: Categoria não existe"));
            res.json({ resposta: "Categoria editada" });
        })
        .catch(next);
});

// Excluir categoria (Recurso Admin)
api.delete("/categorias/:id", (req, res, next) => {
    const { id } = req.params;
    conn("categorias")
        .where("id", id)
        .delete()
        .then(dados => {
            if (!dados) return next(http_errors(404, "Erro ao excluir: Categoria não existe"));
            res.json({ resposta: "Categoria excluída" });
        })
        .catch(next);
});


/* ==========================================
   ROTAS DE PRODUTOS
   ========================================== */

// Listar produtos com o nome da sua respectiva categoria (Join)
api.get("/produtos", (req, res, next) => {
    conn("produtos")
        .leftJoin("categorias", "produtos.categoria_id", "=", "categorias.id")
        .select("produtos.*", "categorias.nome AS nome_categoria")
        .then(dados => res.json(dados))
        .catch(next);
});

// Buscar um produto específico por ID
api.get("/produtos/:id", (req, res, next) => {
    const { id } = req.params;
    conn("produtos")
        .leftJoin("categorias", "produtos.categoria_id", "=", "categorias.id")
        .select("produtos.*", "categorias.nome AS nome_categoria")
        .where("produtos.id", id)
        .first()
        .then(dados => {
            if (!dados) return next(http_errors(404, "Produto não encontrado"));
            res.json(dados);
        })
        .catch(next);
});

// Criar novo produto (Recurso Admin)
api.post("/produtos", (req, res, next) => {
    conn("produtos")
        .insert(req.body)
        .then(dados => {
            res.status(201).json({ resposta: "Produto inserido", id: dados[0] });
        })
        .catch(next);
});

// Atualizar produto (Recurso Admin)
api.put("/produtos/:id", (req, res, next) => {
    const { id } = req.params;
    conn("produtos")
        .where("id", id)
        .update(req.body)
        .then(dados => {
            if (!dados) return next(http_errors(404, "Erro ao editar: Produto não existe"));
            res.json({ resposta: "Produto editada" });
        })
        .catch(next);
});

// Excluir produto (Recurso Admin)
api.delete("/produtos/:id", (req, res, next) => {
    const { id } = req.params;
    conn("produtos")
        .where("id", id)
        .delete()
        .then(dados => {
            if (!dados) return next(http_errors(404, "Erro ao excluir: Produto não existe"));
            res.json({ resposta: "Produto excluído" });
        })
        .catch(next);
});


/* ==========================================
   ROTAS DE CLIENTES
   ========================================== */

// Cadastro de Clientes
api.post("/clientes", (req, res, next) => {
    conn("clientes")
        .insert(req.body)
        .then(dados => {
            res.status(201).json({ resposta: "Cliente cadastrado com sucesso", id: dados[0] });
        })
        .catch(next);
});


/* ==========================================
   ROTAS DE PEDIDOS (Transação Relacionamento N:M)
   ========================================== */

// Realização de um Pedido (Insere na tabela 'pedidos' e os itens em 'pedidos_produtos')
api.post("/pedidos", (req, res, next) => {
    const { endereco, cliente_id, produtos } = req.body; 
    // 'produtos' deve ser um array de objetos: [{ produto_id: 1, preco: 10.5, quantidade: 2 }]

    if (!produtos || produtos.length === 0) {
        return next(http_errors(400, "O pedido precisa conter pelo menos um produto."));
    }

    // Utiliza transação (trx) para garantir que se um insert falhar, nada seja salvo
    conn.transaction(trx => {
        return trx("pedidos")
            .insert({
                horario: new Date(), // Gera o DATETIME atual do servidor
                endereco: endereco,
                cliente_id: cliente_id
            })
            .then(pedidoIds => {
                const pedido_id = pedidoIds[0];

                // Mapeia os produtos vindos da requisição para incluir o ID do pedido gerado
                const itensPedido = produtos.map(item => ({
                    pedido_id: pedido_id,
                    produto_id: item.produto_id,
                    preco: item.preco,
                    quantidade: item.quantidade
                }));

                // Insere em lote na tabela pivot/intermediária
                return trx("pedidos_produtos").insert(itensPedido);
            });
    })
    .then(() => {
        res.status(201).json({ resposta: "Pedido realizado com sucesso!" });
    })
    .catch(next);
});

// Consulta de todos os pedidos realizados (Visão Geral Admin)
api.get("/pedidos", (req, res, next) => {
    conn("pedidos")
        .leftJoin("clientes", "pedidos.cliente_id", "=", "clientes.id")
        .select("pedidos.*", "clientes.nome AS nome_cliente")
        .then(dados => res.json(dados))
        .catch(next);
});

// Consulta dos itens de um pedido específico
api.get("/pedidos/:id/itens", (req, res, next) => {
    const { id } = req.params;
    conn("pedidos_produtos")
        .leftJoin("produtos", "pedidos_produtos.produto_id", "=", "produtos.id")
        .select("pedidos_produtos.*", "produtos.nome AS nome_produto")
        .where("pedidos_produtos.pedido_id", id)
        .then(dados => res.json(dados))
        .catch(next);
});


/* ==========================================
   MIDDLEWARE TRATAMENTO DE ERROS (Obrigatório)
   ========================================== */
api.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
        status: status,
        erro: err.message || "Erro interno no servidor"
    });
});

// Inicialização do servidor
api.listen(PORT, () => {
    console.log(`Servidor rodando em: http://${HOSTNAME}:${PORT}`);
});