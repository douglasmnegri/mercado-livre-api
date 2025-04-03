require("dotenv").config({ path: "../../.env" });
const express = require("express");
const path = require("path");
const fs = require("fs").promises;
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

      //Polo is not being uploaded to the db
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

app.post("/get-access-token", async (req, res) => {
  try {
    const headers = {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    };

    const data = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.ID,
      client_secret: process.env.KEY,
      code: process.env.CODE,
      redirect_uri: process.env.URI,
    }).toString();

    const response = await fetch(process.env.MERCADOLIVREURL, {
      method: "POST",
      headers: headers,
      body: data,
    });

    const json = await response.json();
    console.log(json);

    res.json(json);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

// Graceful shutdown
process.on("SIGINT", () => {
  db.destroy();
  server.close(() => {
    console.log("Servidor e conexão com o banco de dados encerrados.");
    process.exit(0);
  });
});
