const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const databaseTokens = require("../db-queries/refresh-token.js");

const router = express.Router();

router.post("/get-access-token", async (req, res) => {
  try {
    const headers = {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    };
    const data = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.ID,
      client_secret: process.env.KEY,
      code: process.env.CODE,
      redirect_uri: process.env.URI,
    }).toString();

    const response = await fetch(process.env.MERCADOLIVREURL, {
      method: "POST",
      headers: headers,
      body: data,
    });

    const json = await response.json();
    res.json(json);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

    await databaseTokens.updateRefreshToken(
      json.refresh_token,
      json.access_token
    );
  } catch (error) {
    console.error("Erro ao atualizar token:", error);
  }
}


module.exports = { router, refreshAccessToken };
