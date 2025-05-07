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
    console.log(json.pictures[0].url);

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
      const picture = json.pictures[0].url;

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
        picture: picture,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

cron.schedule("0 */2 * * *", async () => {
  try {
    const publicUrl = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
    const res = await axios.get(`${publicUrl}/fetch-all-items`);
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
