import {
  getFullStock,
  getActiveProducts,
  getCottonStock,
  getPolyesterStock,
  getPoloStock,
  getOrderedProducts,
  getBestSellingProducts,
  getUnitsSold,
  getMinimumStock,
} from "../db-queries/stock.js";

import { getSalesReport, getSalesByMonth } from "../db-queries/sales.js";

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

export async function bestSellingProducts(req, res) {
  try {
    const bestSellingProducts = await getBestSellingProducts();
    res.json(bestSellingProducts);
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
}

export async function unitsSold(req, res) {
  try {
    const unitsSold = await getUnitsSold();
    res.json(unitsSold);
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
}

export async function minimumStock(req, res) {
  try {
    const minStock = await getMinimumStock();
    res.json(minStock);
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
}

export async function salesReport(req, res) {
  try {
    const sales = await getSalesReport();
    res.json(sales);
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
}

export async function salesMonth(req, res) {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: "Year and month are required" });
    }

    const yearNum = Number(year);
    const monthNum = Number(month);

    const monthlySales = await getSalesByMonth(yearNum, monthNum);
    res.json(monthlySales);
  } catch (error) {
    console.error("Erro ao buscar vendas por mês:", error);
    res.status(500).json({ error: "Erro ao buscar vendas por mês" });
  }
}
