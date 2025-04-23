// Dotenv
require("dotenv").config({ path: "../../.env" });

// Path/FS
const path = require("path");
const fs = require("fs").promises;

// Express
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Node-cron
const cron = require("node-cron");

// Node-axios
const axios = require("axios");

// Knex
const knex = require("knex");
const config = require("../../knexfile");
const databaseTokens = require("../db-queries/refresh-token");
const listOfProducts = require("../db-queries/products-list");
const env =
  process.env.NODE_ENV !== "production" ? "development" : "production";
const dbConnection = knex(config[env]);

app.get("/sales", async (req, res) => {
  try {
    const access_token = await databaseTokens.getAccessToken();
    const currentTime = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 horas atrás
    const oneHourAgo = new Date(currentTime.getTime() - 2 * 60 * 60 * 1000); // 2 horas antes


    const fromDate = oneHourAgo.toISOString().replace(/\.\d{3}Z/, ".000-00:00");
    const toDate = currentTime.toISOString().replace(/\.\d{3}Z/, ".000-00:00");

    const url = `https://api.mercadolibre.com/orders/search?seller=${process.env.SELLER_ID}&order.date_created.from=${fromDate}&order.date_created.to=${toDate}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${access_token.access_token}` },
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const dadosVendas = await response.json();


    const salesData = dadosVendas.results.map((order) => {
      const orderItem = order.order_items[0];
      const sizeAttribute = orderItem.item.variation_attributes?.find(
        (attr) => attr.id === "SIZE"
      );

      return {
        order_id: order.pack_id,
        product_id: orderItem.item.id,
        title: orderItem.item.title,
        size: sizeAttribute?.value_name || "N/A",
        unit_price: orderItem.unit_price,
        quantity_sold: orderItem.quantity,
        sale_date: order.date_closed,
      };
    });

    for (const sale of salesData) {
      await dbConnection("sales")
        .insert(sale)
        .onConflict(["order_id", "product_id"])
        .ignore();
    }

    res.json(dadosVendas);
  } catch (error) {
    console.error("Erro na rota /sales:", error);
    res.status(500).json({
      erro: "Falha ao buscar/inserir vendas",
      detalhes: error.message,
    });
  }
});

const PORT = process.env.PORT || 3004;
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

cron.schedule("0 * * * *", async () => {
  try {
    console.log("⏱️ Executando cron para /fetch-all-items...");
    const res = await axios.get(`http://localhost:${PORT}/fetch-all-items`);
    console.log("✅ Fetch finalizado:", res.data.message);
  } catch (error) {
    console.error("❌ Erro no cron job:", error.message);
  }
});
