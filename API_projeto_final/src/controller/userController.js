const db = require('../config/connection');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        if (role !== 'TOTAL' && role !== 'PARCIAL') {
            return res.status(400).json({ error: "Nível de acesso inválido (Use TOTAL ou PARCIAL)." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await db.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
            [name, email, passwordHash, role]
        );

        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Este e-mail já está cadastrado." });
        }
        console.error("ERRO REAL AQUI:", error);
        return res.status(500).json({ error: "Erro interno ao cadastrar usuário." });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT id, name, email, role FROM users';
        const [rows] = await db.query(query);
        
        return res.status(200).json(rows);
    } catch (error) {
        console.error("ERRO REAL AQUI (getAllUsers):", error);
        return res.status(500).json({ error: "Erro interno ao buscar usuários." });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({ error: "Os campos name, email e role são obrigatórios para atualização." });
    }

    try {
        const query = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
        const [result] = await db.query(query, [name, email, role, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        return res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
        console.error("ERRO REAL AQUI (updateUser):", error);
        return res.status(500).json({ error: "Erro interno ao atualizar usuário." });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        return res.status(200).json({ message: "Usuário removido com sucesso!" });
    } catch (error) {
        console.error("ERRO REAL AQUI (deleteUser):", error);
        return res.status(500).json({ error: "Erro interno ao deletar usuário." });
    }
};


module.exports = {
    register,
    getAllUsers,
    updateUser,
    deleteUser
};