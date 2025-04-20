import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import knex from "knex";
import config from "../../knexfile.js";

const env =
  process.env.NODE_ENV !== "production" ? "development" : "production";
const dbConnection = knex(config[env]);

export async function updateRefreshToken(refreshToken, accessToken) {
  const updateTokens = await dbConnection("tokens")
    .update("refresh_token", refreshToken)
    .update("access_token", accessToken);

  console.log(updateTokens);
  return updateTokens;
}

export async function getRefreshToken() {
  const token = await dbConnection("tokens").first("refresh_token");

  console.log(token);
  return token;
}

export async function getAccessToken() {
  const token = await dbConnection("tokens").first("access_token");

  console.log(token);
  return token;
}


export async function getMercadoLivreURL() {
  const url = await dbConnection("tokens").first("url");

  console.log(url);
  return url;
}