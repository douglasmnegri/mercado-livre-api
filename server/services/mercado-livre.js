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

async function fetchAndStoreItem(itemId) {
  try {
    const access_token = await databaseTokens.getAccessToken();
    const response = await fetch(
      `https://api.mercadolibre.com/items/${itemId}`,
      {
        headers: { Authorization: `Bearer ${access_token.access_token}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch item ${itemId}: ${response.statusText}`);
    }

    const json = await response.json();

    function getShirtData(material, type) {
      let shirtType, shirtMaterial;
      json.attributes.find((attr) => {
        if (attr.id == material) {
          shirtMaterial = attr.value_name;
        }
        if (attr.id == type) {
          shirtType = attr.value_name;
        }
      });

      return [shirtType, shirtMaterial];
    }

    let type, fabric;

    if (json.category_id == "MLB107292") {
      [type, fabric] = getShirtData("SHIRT_MATERIAL", "MODEL");
      console.log(type, fabric);
    } else {
      [type, fabric] = getShirtData("MAIN_MATERIAL", "GARMENT_TYPE");
    }

    if (!json.variations) return;

    const variationPromises = json.variations.map(async (variation) => {
      let color, size;
      const stock = variation.available_quantity;
      const sold = variation.sold_quantity;
      const userProductID = variation.user_product_id;
      const generalID = json.id;
      const permaLink = json.permalink;
      const title = json.title;

      variation.attribute_combinations.forEach((attr) => {
        if (attr.name === "Cor") {
          color = attr.value_name;
        } else if (attr.name === "Tamanho") {
          size = attr.value_name;
        }
      });

      const variationDetails = {
        product_id: userProductID,
        general_id: generalID,
        type,
        fabric,
        stock,
        sold,
        color,
        size,
        URL: permaLink,
      };

      await dbConnection("products")
        .insert(variationDetails)
        .onConflict("product_id")
        .merge();
    });

    await Promise.all(variationPromises);
    console.log(`Produto ${itemId} inserido no banco.`);
  } catch (error) {
    console.error(`Error processing item ${itemId}:`, error);
  }
}

app.get("/fetch-all-items", async (req, res) => {
  try {
    let data = await listOfProducts.getListOfProducts();
    const itemIds = data.map((product) => product.product_id);

    await Promise.all(itemIds.map(fetchAndStoreItem));

    res.json({ message: "Todos os produtos processados com sucesso!" });
  } catch (error) {
    console.error("Error in /fetch-all-items:", error);
    res
      .status(500)
      .json({ error: "Erro interno do servidor", details: error.message });
  }
});

app.get("/orders", async (req, res) => {
  const response = await fetch(
    `https://api.mercadolibre.com/orders/search?seller=${process.env.SELLER_ID}&order.date_created.from=2025-01-01T00:00:00.000-00:00&order.date_created.to=2025-03-03T00:00:00.000-00:00&fields=id,status,total_amount,buyer,status`,
    {
      headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
    }
  );
  const data = await response.json();
  console.log(data);
  res.json(data);
});

app.get("/sales", async (req, res) => {
  try {
    const access_token = await databaseTokens.getAccessToken();
    // const currentTime = new Date();
    // const oneHourAgo = new Date(currentTime.getTime() - 2 * 60 * 60 * 1000);
    const currentTime = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 horas atrás
    const oneHourAgo = new Date(currentTime.getTime() - 2 * 60 * 60 * 1000); // 2 horas antes de currentTime

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
      console.log(order.pack_id);
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

    res.json(salesData);
  } catch (error) {
    console.error("Erro na rota /vendas-ultima-hora:", error);
    res.status(500).json({
      erro: "Falha ao buscar vendas",
      detalhes: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
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

// Graceful shutdown
process.on("SIGINT", () => {
  db.destroy();
  server.close(() => {
    console.log("Servidor e conexão com o banco de dados encerrados.");
    process.exit(0);
  });
});
