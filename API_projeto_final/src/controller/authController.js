const db = require('../config/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: "E-mail ou senha inválidos." });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "E-mail ou senha inválidos." });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'seu_secret_aqui',
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            message: "Login realizado com sucesso!",
            token,
            user: { id: user.id, name: user.name, role: user.role }
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno ao realizar login." });
    }
};

module.exports = { login };