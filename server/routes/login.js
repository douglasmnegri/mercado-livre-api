import express from "express";
import bcrypt from "bcrypt";
import knex from "knex";
import config from "../../knexfile.js"; // precisa do `.js` no final quando usando ESM

const env = "production";
const dbConnection = knex(config[env]);
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await dbConnection("users").where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    return res.json({ message: "Login bem-sucedido" });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export { router };
