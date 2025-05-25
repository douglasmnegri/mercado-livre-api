require("dotenv").config({ path: "../../.env" });

const dbConnection = require("../db/index.js");

async function updateRefreshToken(refreshToken, accessToken) {
  const updateTokens = await dbConnection("tokens")
    .update("refresh_token", refreshToken)
    .update("access_token", accessToken);

  return updateTokens;
}

async function getRefreshToken() {
  const token = await dbConnection("tokens").first("refresh_token");

  return token;
}

async function getAccessToken() {
  const token = await dbConnection("tokens").first("access_token");

  return token;
}

async function getMercadoLivreURL() {
  const url = await dbConnection("tokens").first("url");

  return url;
}

module.exports = {
  updateRefreshToken,
  getRefreshToken,
  getAccessToken,
  getMercadoLivreURL
};