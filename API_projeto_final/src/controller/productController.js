const db = require('../config/connection');

const createProduct = async (req, res) => {
    const { name, quantity, unit, min_stock } = req.body;

    try {

        if (!name || !unit) {
            return res.status(400).json({ error: "Nome e unidade de medida são obrigatórios." });
        }

        const productPayload = {
            name: name,
            quantity: quantity || 0,
            unit: unit,
            min_stock: min_stock || 0
        };

        const [result] = await db.query(
            "INSERT INTO products (name, quantity, unit, min_stock) VALUES (?, ?, ?, ?)",
            [productPayload.name, productPayload.quantity, productPayload.unit, productPayload.min_stock]
        );

        return res.status(201).json({ 
            id: result.insertId, 
            message: "Produto adicionado ao estoque com sucesso!",
            data: productPayload
        });

    } catch (error) {
        return res.status(500).json({ error: "Erro ao cadastrar produto no estoque." });
    }
};


const getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query("SELECT * FROM products");
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao listar o estoque." });
    }
};

module.exports = { createProduct, getAllProducts };