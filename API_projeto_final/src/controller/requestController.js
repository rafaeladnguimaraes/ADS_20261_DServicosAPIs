const db = require('../config/connection');

const updateStatus = async (req, res) => {
    const { id } = req.params; 
    const { status } = req.body;

    try {
        const [requests] = await db.query("SELECT * FROM requests WHERE id = ?", [id]);
        if (requests.length === 0) return res.status(404).json({ error: "Solicitação não encontrada." });
        
        const solicitacao = requests[0];
        if (solicitacao.status !== 'PENDING') {
            return res.status(400).json({ error: "Esta solicitação já foi encerrada." });
        }

        if (status === 'APPROVED') {

            const [items] = await db.query("SELECT product_id, quantity FROM request_items WHERE request_id = ?", [id]);

            for (const item of items) {
                await db.query(
                    "UPDATE products SET quantity = quantity - ? WHERE id = ?",
                    [item.quantity, item.product_id]
                );
            }
        }

        await db.query("UPDATE requests SET status = ? WHERE id = ?", [status, id]);
        await db.query("INSERT INTO request_status_history (request_id, status) VALUES (?, ?)", [id, status]);

        return res.status(200).json({ message: `Solicitação atualizada para ${status} com sucesso.` });

    } catch (error) {
        return res.status(500).json({ error: "Erro interno ao processar a alteração." });
    }
};

const createRequest = async (req, res) => {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "É necessário enviar pelo menos um item na solicitação." });
    }

    try {
        const [requestResult] = await db.query(
            "INSERT INTO requests (user_id) VALUES (?)",
            [userId]
        );
        const requestId = requestResult.insertId;

        for (const item of items) {
            await db.query(
                "INSERT INTO request_items (request_id, product_id, quantity) VALUES (?, ?, ?)",
                [requestId, item.product_id, item.quantity]
            );
        }

        await db.query(
            "INSERT INTO request_status_history (request_id, status) VALUES (?, 'PENDING')",
            [requestId]
        );

        return res.status(201).json({
            message: "Solicitação de insumos criada com sucesso!",
            request_id: requestId
        });

    } catch (error) {
        return res.status(500).json({ error: "Erro ao processar a criação da solicitação." });
    }
};

const createRequestFromRecipe = async (req, res) => {
    const { items, Multiplier = 1 } = req.body; 

    if (!items || items.length === 0) {
        return res.status(400).json({ error: "É necessário enviar os itens brutos da receita." });
    }

    try {
        const calculatedItems = [];

        for (const item of items) {
            const { product_id, weight_per_unit, required_weight } = item;
            const totalRequiredWeight = required_weight * Multiplier;
            const exactUnitsNeeded = Math.ceil(totalRequiredWeight / weight_per_unit);

            calculatedItems.push({
                product_id: Number(product_id),
                quantity: exactUnitsNeeded
            });
        }

        return res.status(200).json({
            items: calculatedItems
        });

    } catch (error) {
        console.error("ERRO REAL AQUI (createRequestFromRecipe):", error);
        return res.status(500).json({ error: "Erro interno ao calcular insumos da receita." });
    }
};


const getAllRequests = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM requests'); 
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao listar requisições:", error);
        return res.status(500).json({ error: "Erro interno ao buscar solicitações." });
    }
};

module.exports = { 
    updateStatus, 
    createRequest,
    createRequestFromRecipe,
    getAllRequests
};
