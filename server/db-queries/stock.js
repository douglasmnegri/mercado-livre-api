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

async function getProductStock() {
  const productStock = await dbConnection("products")
    .select("general_id")
    .select("fabric")
    .select("type")
    .select("color")
    .sum("stock as total_stock")
    .groupBy("general_id", "fabric", "type", "color");

  console.log(productStock);
  return productStock;
}

async function getActiveProducts() {
  const activeProducts = await dbConnection("products")
    .count("id")
    .where("stock", ">", 0);

  console.log(activeProducts);
  return activeProducts;
}
getFullStock();
getProductStock();
getActiveProducts();
