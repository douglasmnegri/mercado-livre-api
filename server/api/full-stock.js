import { getFullStock, getActiveProducts, getCottonStock } from "../db-queries/stock.js";

export default async function fullStock(req, res) {
  try {
    const stock = await getFullStock();
    const activeProducts = await getActiveProducts();
    const cottonStock = await getCottonStock();
    res.json({ stock, activeProducts, cottonStock });
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
}
