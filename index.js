const express = require("express");
const path = require("path");
const fs = require("fs").promises;
require("dotenv").config();
const knex = require("knex");

const db = knex({
  client: "postgresql",
  connection: {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

async function fetchAndStoreItem(itemId) {
  try {
    const response = await fetch(
      `https://api.mercadolibre.com/items/${itemId}`,
      {
        headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch item ${itemId}: ${response.statusText}`);
    }

    const json = await response.json();
    if (!json.variations) return;

    const variationPromises = json.variations.map(async (variation) => {
      let color, size;
      const stock = variation.available_quantity;
      const sold = variation.sold_quantity;
      const userProductID = variation.user_product_id;
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
        title,
        stock,
        sold,
        color,
        size,
        URL: permaLink,
      };

      await db("products").insert(variationDetails);
    });

    await Promise.all(variationPromises);
    console.log(`Produto ${itemId} inserido no banco.`);
  } catch (error) {
    console.error(`Error processing item ${itemId}:`, error);
  }
}

app.get("/fetch-all-items", async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, "id.json"), "utf-8");
    const itemIds = JSON.parse(data);

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
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  db.destroy();
  server.close(() => {
    console.log("Servidor e conexão com o banco de dados encerrados.");
    process.exit(0);
  });
});
