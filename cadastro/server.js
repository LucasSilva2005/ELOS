const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const app = express();
const port = process.env.PORT || 3000;

// Middleware para ler form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SERVIR ARQUIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, "public")));

// Conexão PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "",     // <-- nome do banco
  password: "lucas2005",
  port: 5432,
});

// Servir HTML na raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../principal/principal.html"));
});

app.get("/pedidos", (req, res) => {
  res.sendFile(path.join(__dirname, "../pedidos/pedidos.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "cadastro.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../login/login.html"));
});

app.get("/clientes/lista", (req, res) => {
  res.sendFile(path.join(__dirname, "../clientes/clientes.html"));
});

app.get("/clientes/", (req, res) => {
  res.sendFile(path.join(__dirname, "../clientes/cadastro_clientes.html"));
});

app.get("/produtos", (req, res) => {
  res.sendFile(path.join(__dirname, "../produtos/produtos.html"));
});

app.get("/cadastro_produto", (req, res) => {
  res.sendFile(path.join(__dirname, "../produtos/cadastro_produto.html"));
});

// ======================
// Rota de cadastro
// ======================
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Verifica se já existe usuário com esse e-mail
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).send("⚠️ Usuário já existe! Tente outro e-mail.");
    }

    // 2. Cria hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insere novo usuário
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.send("✅ Usuário cadastrado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Erro ao cadastrar usuário");
  }
});

// ======================
// Rota de login
// ======================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(400).send("⚠️ Usuário não encontrado");

    const user = result.rows[0];
    const senhaConfere = await bcrypt.compare(password, user.password);
    if (!senhaConfere) return res.status(401).send("❌ Senha incorreta");

    res.send(`🎉 Bem-vindo, ${user.name}!`);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Erro no login");
  }
});

// ======================
// ROTAS DE CLIENTES
// ======================

// Cadastrar cliente
app.post("/clientes", async (req, res) => {
  const { nome, codigo_cliente, email, telefone, pedidos, total_gasto } = req.body;

  try {
    await pool.query(
      "INSERT INTO clientes (nome, codigo_cliente, email, telefone, pedidos, total_gasto) VALUES ($1, $2, $3, $4, $5, $6)",
      [nome, codigo_cliente, email, telefone, pedidos, total_gasto]
    );

    res.status(201).send({ message: "✅ Cliente cadastrado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "❌ Erro ao cadastrar cliente" });
  }
});

// Listar clientes (dados em JSON)
app.get("/clientes/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clientes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "❌ Erro ao buscar clientes" });
  }
});

// ======================
// ROTAS DE PRODUTOS
// ======================

// Cadastrar produto
app.post("/api/produtos", async (req, res) => {
  const { sku, nome, categoria, preco, estoque, status } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO produtos (sku, nome, categoria, preco, estoque, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [sku, nome, categoria, preco, estoque, status]
    );

    res.status(201).json({
      message: "✅ Produto cadastrado com sucesso!",
      produto: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Erro ao cadastrar produto" });
  }
});

// Listar produtos
app.get("/api/produtos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produtos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Erro ao buscar produtos" });
  }
});

// Editar produto
app.put("/api/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { sku, nome, categoria, preco, estoque, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE produtos
       SET
         sku = COALESCE($1, sku),
         nome = COALESCE($2, nome),
         categoria = COALESCE($3, categoria),
         preco = COALESCE($4, preco),
         estoque = COALESCE($5, estoque),
         status = COALESCE($6, status),
         atualizado_em = NOW()
       WHERE id = $7
       RETURNING *`,
      [sku, nome, categoria, preco, estoque, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.json({ message: "Produto atualizado com sucesso!", produto: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar produto" });
  }
});



// Deletar produto
app.delete("/api/produtos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM produtos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "⚠️ Produto não encontrado" });
    }

    res.json({ message: "✅ Produto removido com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Erro ao deletar produto" });
  }
});



// Inicia servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
