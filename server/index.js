import "dotenv/config";
import express from "express";
import auth, { autenticar } from "./auth.js";
import db from "./db.js";
import doacoes from "./routes/doacoes.js";
import doadores from "./routes/doadores.js";
import itens from "./routes/itens.js";

if (!process.env.JWT_SECRET) {
  console.error("Defina JWT_SECRET no arquivo .env");
  process.exit(1);
}

const app = express();
app.use(express.json());

// Rotas públicas
app.get("/api/health", async (req, res) => {
  try {
    await db.execute("SELECT 1");
    res.json({ status: "ok", banco: "ok", app: "AcolheMar", hora: new Date().toISOString() });
  } catch {
    res.status(500).json({ status: "ok", banco: "erro", app: "AcolheMar" });
  }
});

app.use("/api/auth", auth);

// Daqui para baixo, toda rota exige token JWT válido
app.use("/api", autenticar);
app.use("/api/doadores", doadores);
app.use("/api/itens", itens);
app.use("/api/doacoes", doacoes);

// Middleware final de tratamento de erros
app.use((erro, req, res, _next) => {
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }
  console.error(erro);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API AcolheMar rodando em http://localhost:${PORT}`);
});