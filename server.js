import express from 'express';
import session from "express-session";
import { Pool } from "pg";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "cantina_simulado",
    password: "amominhacasa",
    port: 7777,
});

// Configurações do Express
app.use(express.urlencoded({ extended: true}));
app.use(session({ secret: "cantina2025", resave: false, saveUninitialized: false}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Verifica se o usuário está autenticado e direciona conforme necessário
function protect(req, res, next) {
    if (!req.session.usuario) return res.redirect("/");
    next();
}

// Função para consultar o banco
async function runQuery(sql, params = []) {
    const result = await pool.query(sql, params);
    return result.rows;
}

// Login
app.get("/", (req, res) => res.render("login", { erro: null }));
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuarios = await runQuery(
            "SELECT * FROM usuarios WHERE email = $1 AND senha = $2", 
            [email, senha]);

            if (usuarios.length === 0) {
                return res.render("login", { erro: "Email ou senha inválidos." });
            }

            req.session.usuario = usuarios[0];
            res.redirect("/dashboard");
    } catch (error) {
        res.send("Erro ao autenticar usuário.");
    }
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
});

// Dashboard
app.get("/dashboard", protect, async (req, res) => {
    const produtosPoucos = await runQuery("SELECT * FROM produtos LIMIT 5");
    const totalProdutos = (await runQuery("SELECT COUNT(*) FROM produtos"))[0].count;

    res.render("dashboard", {
        usuario: req.session.usuario,
        produtos: produtosPoucos,
        totalProdutos
    });
});

// Cadastro de Produtos


// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`🥐 Servidor rodando em http://localhost:${PORT}`))