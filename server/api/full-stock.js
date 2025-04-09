import { getFullStock } from "../db-queries/stock.js";

export default async function fullStock(req, res) {
  try {
    const data = await getFullStock();
    res.json(data);
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
}
