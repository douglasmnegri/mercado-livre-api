import express from 'express';
import databaseTokens from "../db-queries/refresh-token.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const access_token = await databaseTokens.getAccessToken();
    const currentTime = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const oneHourAgo = new Date(currentTime.getTime() - 3 * 60 * 60 * 1000);

    const fromDate = oneHourAgo.toISOString().replace(/\.\d{3}Z/, ".000-00:00");
    const toDate = currentTime.toISOString().replace(/\.\d{3}Z/, ".000-00:00");

    const url = `https://api.mercadolibre.com/orders/search?seller=${process.env.SELLER_ID}&order.date_created.from=${fromDate}&order.date_created.to=${toDate}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${access_token.access_token}` },
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const sales = await response.json();
    res.json(sales);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router }; 