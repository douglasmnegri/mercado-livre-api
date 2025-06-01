import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import knex from "knex";
import config from "../../knexfile.js";

const env =
  process.env.NODE_ENV !== "production" ? "development" : "production";
const dbConnection = knex(config[env]);

export async function getSalesByMonth(year, month) {
  const endDate = new Date(year, month, 1);
  const startDate = new Date(year, month - 1, 1);

  const formatDate = (d) => d.toISOString().split("T")[0];

  return dbConnection("sales")
    .where("sale_date", ">=", formatDate(startDate))
    .andWhere("sale_date", "<", formatDate(endDate))
    .orderBy("sale_date", "asc");
}
