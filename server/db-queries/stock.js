require("dotenv").config({ path: "../../.env" });

const dbConnection = require("../db/index.js");

async function getFullStock() {
  const fullStock = await dbConnection("products").sum("stock");

  console.log(fullStock);
  return fullStock;
}

async function getCottonStock() {
  const productStock = await dbConnection("products")
    .select("color")
    .sum({ stock: "stock" })
    .where("fabric", "Algodão")
    .groupBy("color")
    .orderBy("stock", "desc");

  console.log(productStock);
  return productStock;
}

async function getPolyesterStock() {
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

async function getPoloStock() {
  const productStock = await dbConnection("products")
    .select("color")
    .sum({ stock: "stock" })
    .where("type", "Polo")
    .groupBy("color")
    .orderBy("stock", "desc");

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

async function getUnitsSold() {
  const unitsSold = await dbConnection("products").select(
    dbConnection.raw("SUM(sold) as total_units")
  );

  console.log(unitsSold);
  return unitsSold;
}

async function getOrderedProducts() {
  const orderedProducts = await dbConnection("products as p")
    .join("min_stock as m", "p.size", "m.size")
    .select(
      "p.id",
      "p.general_id as gen_id",
      dbConnection.raw("CONCAT(p.type, ' ', p.fabric) as name"),
      "p.color",
      "p.size",
      "p.stock",
      "m.min as min_stock",
      dbConnection.raw(`
        CEIL(GREATEST(0, m.min - p.stock) / 5.0) * 5 as stock_suggestion
      `)
    )
    .where("p.size", "!=", "XGG")
    .andWhereRaw("m.min - p.stock > 0") // só produtos com sugestão
    .orderBy([
      { column: "p.general_id", order: "asc" },
      {
        column: dbConnection.raw(`
          CASE p.size
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

async function getBestSellingProducts() {
  const bestProducts = await dbConnection("products")
    .select(
      "general_id",
      dbConnection.raw("CONCAT(type, ' ', fabric, ' ', color) as name"),
      dbConnection.raw("SUM(sold) as units")
    )
    .groupBy("general_id", "type", "fabric", "color")
    .orderBy("units", "desc")
    .limit(7);
  console.log(bestProducts);
  return bestProducts;
}

async function getMinimumStock() {
  const minStock = await dbConnection("min_stock");

  console.log(minStock);
  return minStock;
}

module.exports = {
  getFullStock,
  getCottonStock,
  getPolyesterStock,
  getPoloStock,
  getActiveProducts,
  getUnitsSold,
  getOrderedProducts,
  getBestSellingProducts,
  getMinimumStock
};
