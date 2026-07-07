require('dotenv').config();
const express = require('express');
const routes = require('./src/routes');

const app = express();

// Middleware para permitir que o Express leia requisições em formato JSON
app.use(express.json());

// Injeta o prefixo /api em todas as nossas rotas estruturadas
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});