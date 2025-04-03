require("dotenv").config({ path: "../../.env" });
const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const knex = require("knex");
const config = require("../../knexfile");

const env =
  process.env.NODE_ENV !== "production" ? "development" : "production";
const dbConnection = knex(config[env]);

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
    const mainMaterial = json.attributes.find(
      (attr) => attr.id === "SHIRT_MATERIAL"
    )?.value_name;
    const productType = json.attributes.find(
      (attr) => attr.id === "MODEL"
    )?.value_name;

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

      await dbConnection("products").insert(variationDetails);
    });

    await Promise.all(variationPromises);
    console.log(`Produto ${itemId} inserido no banco.`);
  } catch (error) {
    console.error(`Error processing item ${itemId}:`, error);
  }
}

app.get("/fetch-all-items", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "../../id.json"),
      "utf-8"
    );
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

app.get("/fetch-item", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.mercadolibre.com/items/MLB5026419706`,
      {
        headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch item ${itemId}: ${response.statusText}`);
    }
    const json = await response.json();
    console.log(json.id);
    res.send(json);
  } catch (error) {
    console.error(error);
  }
});

app.get("/vendas-diarias", async (req, res) => {
  try {
    const hoje = new Date().toISOString().split("T")[0];
    const url = `https://api.mercadolibre.com/orders/search?seller=${process.env.SELLER_ID}&order.date_created.from=${hoje}T00:00:00.000-00:00&order.date_created.to=${hoje}T23:59:59.000-00:00`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const dadosVendas = await response.json();
    res.json(dadosVendas);
  } catch (error) {
    console.error("Erro na rota /vendas-diarias:", error);
    res
      .status(500)
      .json({ erro: "Falha ao buscar vendas", detalhes: error.message });
  }
});

app.get("/vendas-ultima-hora", async (req, res) => {
  try {
    const agora = new Date();
    const umaHoraAtras = new Date(agora.getTime() - 60 * 60 * 1000);

    const fromDate = umaHoraAtras
      .toISOString()
      .replace(/\.\d{3}Z/, ".000-00:00");
    const toDate = agora.toISOString().replace(/\.\d{3}Z/, ".000-00:00");

    const url = `https://api.mercadolibre.com/orders/search?seller=${process.env.SELLER_ID}&order.date_created.from=${fromDate}&order.date_created.to=${toDate}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const dadosVendas = await response.json();

    const salesData = dadosVendas.results.map((order) => {
      const orderItem = order.order_items[0]; // First item in order
      const sizeAttribute = orderItem.item.variation_attributes?.find(
        (attr) => attr.id === "SIZE"
      );

      return {
        product_id: orderItem.item.id,
        title: orderItem.item.title, // Added title for better identification
        size: sizeAttribute?.value_name || "N/A",
        unit_price: orderItem.unit_price,
        quantity_sold: orderItem.quantity,
        sale_date: order.date_closed, // Using order closure date as sale timestamp
      };
    });

    console.log("Vendas processadas:", salesData);
    res.json(salesData);
  } catch (error) {
    console.error("Erro na rota /vendas-ultima-hora:", error);
    res.status(500).json({
      erro: "Falha ao buscar vendas",
      detalhes: error.message,
    });
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
