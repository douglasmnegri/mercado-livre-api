require("dotenv").config({ path: "../../.env" });
const express = require("express");
const path = require("path");
const fs = require("fs").promises;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
