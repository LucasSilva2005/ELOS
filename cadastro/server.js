const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Middleware para ler form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexão PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "postgres",
  password: "lucas2005",
  port: 5432,
});

// Servir HTML na raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "cadastro.html"));
});

// Rota de cadastro
app.post("/register", async (req, res) => {
  console.log(req.body); // debug
  const { name, email, password } = req.body;

  try {
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, password]
    );
    res.send("Usuário cadastrado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao cadastrar usuário");
  }
});

// Inicia servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
