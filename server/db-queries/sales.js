import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import knex from "knex";
import config from "../../knexfile.js";

const env =
  process.env.NODE_ENV !== "production" ? "development" : "production";
const dbConnection = knex(config[env]);

export async function getSalesReport() {
  const sales = await dbConnection("sales as s")
    .join(
      dbConnection("products")
        .distinctOn("general_id")
        .select("general_id", "picture")
        .as("p"),
      "s.product_id",
      "p.general_id"
    )
    .select("s.*", "p.picture");

  console.log("SALES REPORT", sales);
  return sales;
}

