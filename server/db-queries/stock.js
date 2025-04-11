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

export async function getPolyesterStock() {
  const productStock = await dbConnection("products")
    .select("color")
    .sum({ stock: "stock" })
    .where("fabric", "Poliéster")
    .andWhere("type", "Camiseta")
    .groupBy("color")
    .orderBy("stock", "desc");

  console.log(productStock);
  return productStock;
}

export async function getPoloStock() {
  const productStock = await dbConnection("products")
    .select("color")
    .sum({ stock: "stock" })
    .where("type", "Polo")
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

export async function getOrderedProducts() {
  const orderedProducts = await dbConnection("products")
    .select(
      "general_id as id",
      dbConnection.raw("CONCAT(type, ' ', fabric) as name"),
      "color",
      "size",
      "stock"
    )
    .whereNot("size", "XGG")
    .orderBy([
      { column: "general_id", order: "asc" },
      {
        column: dbConnection.raw(`
          CASE size
            WHEN 'P' THEN 1
            WHEN 'M' THEN 2
            WHEN 'G' THEN 3
            WHEN 'GG' THEN 4
            WHEN 'XGG' THEN 5
            ELSE 6
          END
        `),
        order: "asc",
      },
    ]);

  console.log(orderedProducts);
  return orderedProducts;
}


