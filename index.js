const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/test", async (req, res) => {
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

app.get("/items/:id", async (req, res) => {

    console.log(req)
  const response = await fetch(
    `https://api.mercadolibre.com/items/${req.params.id}`,
    {
      headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
    }
  );
  res.json(await response.json());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
