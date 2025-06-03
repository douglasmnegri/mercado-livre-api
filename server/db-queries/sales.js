import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import knex from "knex";
import config from "../../knexfile.js";
import dbConnection from "../db/index.js";
// const env =
//   process.env.NODE_ENV !== "production" ? "development" : "production";
// const dbConnection = knex(config[env]);

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

  console.log(sales);
  return sales;
}

export async function getSalesByMonth(year, month) {
  const endDate = new Date(year, month, 1);
  const startDate = new Date(year, month - 1, 1);
  const formatDate = (d) => d.toISOString().split("T")[0];

  const monthlySales = await dbConnection("sales")
    .where("sale_date", ">=", formatDate(startDate))
    .andWhere("sale_date", "<", formatDate(endDate))
    .orderBy("sale_date", "asc");

  return monthlySales;
}

getSalesByMonth("2025", "05");
