import express from 'express';
import databaseTokens from "../db-queries/refresh-token.js";

const router = express.Router();

console.log("HEY", databaseTokens);
router.get("/fetch-all-items", async (req, res) => {
  try {
    const access_token = await databaseTokens.getAccessToken();
    const response = await fetch(
      `https://api.mercadolibre.com/users/${process.env.SELLER_ID}/items/search`,
      {
        headers: { Authorization: `Bearer ${access_token.access_token}` },
      }
    );
    const data = await response.json();
    console.log(data)
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router }; 