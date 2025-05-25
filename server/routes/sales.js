const express = require("express");
const databaseTokens = require("../db-queries/refresh-token.js");
const router = express.Router();
const dbConnection = require("../db/index");

router.get("/", async (req, res) => {
  try {
    const access_token = await databaseTokens.getAccessToken();

    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const fromDate = twoHoursAgo.toISOString();
    const toDate = now.toISOString();

    const url = `https://api.mercadolibre.com/orders/search?seller=${process.env.SELLER_ID}&order.date_created.from=${fromDate}&order.date_created.to=${toDate}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${access_token.access_token}` },
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const sales = await response.json();

    const salesData = sales.results
      .filter((order) => {
        return order.fulfilled !== false;
      })
      .map((order) => {
        const orderItem = order.order_items[0];
        const sizeAttribute = orderItem.item.variation_attributes?.find(
          (attr) => attr.id === "SIZE"
        );

        const orderId = order.pack_id || order.id;

        return {
          order_id: orderId,
          product_id: orderItem.item.id,
          title: orderItem.item.title,
          size: sizeAttribute?.value_name || "N/A",
          unit_price: orderItem.unit_price,
          quantity_sold: orderItem.quantity,
          sale_date: order.date_closed,
        };
      })
      .filter((sale) => {
        const isValid = sale.order_id !== null && sale.order_id !== undefined;
        if (!isValid) {
          console.warn("⚠️ Ignorando venda sem order_id:", sale);
        }
        return isValid;
      });

    for (const sale of salesData) {
      await dbConnection("sales")
        .insert(sale)
        .onConflict(["order_id", "product_id"])
        .ignore();
    }

    res.json(salesData);
  } catch (error) {
    res.status(500).json({
      erro: "Falha ao buscar/inserir vendas",
      detalhes: error.message,
    });
  }
});

module.exports = { router };
