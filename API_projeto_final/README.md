# Sistema de Gerenciamento de Insumos - Projeto Final

Este projeto é uma API REST desenvolvida em Node.js e Express para o controle de estoque e gerenciamento de solicitações. O sistema têm controle de acesso por níveis de permissão (`TOTAL` para a administração e `PARCIAL` para a equipe da cozinha) utilizando autenticação via tokens JWT.

---
## Testes pré-prontos para a API

### 1. Autenticação

* **POST `/api/auth/login`** (Acesso: Público)
  * **Descrição:** Realiza a autenticação do usuário no sistema.
  * **Corpo da Requisição (JSON):**
    ```json
    {
      "email": "amanda@confeitaria.com",
      "password": "senha"
    }
    ```
  * **Retorno Esperado:** Mensagem de sucesso, dados básicos do usuário e o **Token JWT** (que deve ser copiado para as próximas rotas).

### 2. Gerenciamento de Usuários (`/api/users`)

* **POST `/api/users/register`** (Acesso: Público)
  * **Descrição:** Cadastra um novo usuário/funcionário no banco de dados.
  * **Corpo da Requisição (JSON):**
    ```json
    {
      "name": "Bruna",
      "email": "bruna@conf.com",
      "password": "123",
      "role": "PARCIAL"
    }
    ```

* **GET `/api/users`** (Acesso: Token `TOTAL`)
  * **Descrição:** Retorna a lista de todos os usuários do sistema (ocultando o hash da senha por segurança).

* **PUT `/api/users/:id`** (Acesso: Token `TOTAL`)
  * **Descrição:** Atualiza os dados de um usuário existente pelo ID informado na URL.
  * **Corpo da Requisição (JSON):**
    ```json
    {
      "name": "Bruna Chefe",
      "email": "bruna@conf.com",
      "role": "PARCIAL"
    }
    ```

* **DELETE `/api/users/:id`** (Acesso: Token `TOTAL`)
  * **Descrição:** Remove permanentemente um usuário do banco de dados pelo seu ID.

### 3. Estoque de Produtos (`/api/products`)

* **POST `/api/products`** (Acesso: Token `TOTAL`)
  * **Descrição:** Insere um novo insumo no estoque da confeitaria.
  * **Corpo da Requisição (JSON):**
    ```json
    {
      "name": "Farinha",
      "quantity": 15,
      "unit": "kg",
      "min_stock": 3
    }
    ```

* **GET `/api/products`** (Acesso: `TOTAL` ou `PARCIAL`)
  * **Descrição:** Retorna a listagem de todos os produtos e suas quantidades atuais.

* **PUT `/api/products/:id`** (Acesso: Token `TOTAL`)
  * **Descrição:** Atualiza os dados de um insumo específico (nome, quantidade ou estoque mínimo).
  * **Corpo da Requisição (JSON):**
    ```json
    {
      "name": "Farinha Especial",
      "quantity": 20,
      "unit": "kg",
      "min_stock": 5
    }
    ```

* **DELETE `/api/products/:id`** (Acesso: Token `TOTAL`)
  * **Descrição:** Remove um insumo do inventário pelo ID.

### 4. Solicitações de Insumos (`/api/requests`)

* **POST `/api/requests/calculate-recipe`** (Acesso: Token `PARCIAL`)
  * **Descrição:** Recebe as medidas fracionadas de uma receita e calcula automaticamente o arredondamento para unidades inteiras de embalagem.
  * **Corpo da Requisição (JSON):**
    ```json
    {
      "Multiplier": 2,
      "items": [
        {
          "product_id": 1,
          "weight_per_unit": 1.0,
          "required_weight": 1.2
        }
      ]
    }
    ```
  * **Retorno Esperado:** O formato exato (objeto com a chave `items`) pronto para ser enviado à rota de criação.

* **POST `/api/requests`** (Acesso: Token `PARCIAL`)
  * **Descrição:** Cria uma ordem oficial de retirada com o status inicial de `PENDING`.
  * **Corpo da Requisição (JSON):**
    ```json
    {
      "items": [
        {
          "product_id": 1,
          "quantity": 3
        }
      ]
    }
    ```

* **GET `/api/requests`** (Acesso: `TOTAL` ou `PARCIAL`)
  * **Descrição:** Retorna o histórico de todas as solicitações registradas na confeitaria.

* **PUT `/api/requests/:id/status`** (Acesso: Token `TOTAL`)
  * **Descrição:** Altera o estado do pedido. Caso o status seja alterado para `APPROVED`, dispara a baixa automática dos insumos correspondentes na tabela de produtos.
  * **Corpo da Requisição (JSON):**
    ```json
    {
      "status": "APPROVED"
    }
    ```

* **DELETE `/api/requests/:id`** (Acesso: Token `TOTAL`)
  * **Descrição:** Cancela ou remove uma solicitação do histórico pelo ID.

---