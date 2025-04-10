import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import knex from "knex";
import config from "../../knexfile.js";

const env =
  process.env.NODE_ENV !== "production" ? "development" : "production";
const dbConnection = knex(config[env]);

export async function getFullStock() {
  const fullStock = await dbConnection("products").sum("stock");

  console.log(fullStock);
  return fullStock;
}

export async function getCottonStock() {
  const productStock = await dbConnection("products")
    .select("color")
    .sum({ stock: "stock" })
    .where("fabric", "Algodão")
    .groupBy("color")
    .orderBy("stock", "desc");

  console.log(productStock);
  return productStock;
}

export async function getActiveProducts() {
  const activeProducts = await dbConnection("products")
    .count("id")
    .where("stock", ">", 0);

  console.log(activeProducts);
  return activeProducts;
}

