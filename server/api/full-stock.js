  import {
  getFullStock,
  getActiveProducts,
  getCottonStock,
  getPolyesterStock,
  getPoloStock,
  getOrderedProducts
} from "../db-queries/stock.js";

export async function fullStock(req, res) {
  try {
    const stock = await getFullStock();
    const activeProducts = await getActiveProducts();
    res.json({ stock, activeProducts });
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
}

export async function polyesterStock(req, res) {
  try {
    const polyesterStock = await getPolyesterStock();
    res.json(polyesterStock);
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
}

export async function cottonStock(req, res) {
  try {
    const polyesterStock = await getCottonStock();
    res.json(polyesterStock);
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
}

export async function poloStock(req, res) {
  try {
    const polyesterStock = await getPoloStock();
    res.json(polyesterStock);
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
}

export async function orderedProducts(req, res) {
  try {
    const orderedProducts = await getOrderedProducts();
    res.json(orderedProducts);
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
}
