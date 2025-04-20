// Dotenv
require("dotenv").config({ path: "../../.env" });

// Express
const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Knex
const databaseTokens = require("../db-queries/refresh-token");

const knex = require("knex");
const config = require("../../knexfile");
const env =
  process.env.NODE_ENV !== "production" ? "development" : "production";
const dbConnection = knex(config[env]);

// Node-cron
const cron = require("node-cron");

async function refreshAccessToken() {
  try {
    const refresh_token = await databaseTokens.getRefreshToken();

    const headers = {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    };

    const data = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.ID,
      client_secret: process.env.KEY,
      refresh_token: refresh_token.refresh_token,
    }).toString();

    const response = await fetch(process.env.MERCADOLIVREURL, {
      method: "POST",
      headers: headers,
      body: data,
    });

    const json = await response.json();
    console.log("Token atualizado:", json);

    await databaseTokens.updateRefreshToken(
      json.refresh_token,
      json.access_token
    );
  } catch (error) {
    console.error("Erro ao atualizar token:", error);
  }
}

cron.schedule("0 */5 * * *", () => {
  console.log("Executando cron job para atualizar o access token...");
  refreshAccessToken();
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
