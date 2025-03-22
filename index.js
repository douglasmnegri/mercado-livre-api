const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.post("/test", async (req, res) => {
  const headers = {
    accept: "application/json",
    "content-type": "application/x-www-form-urlencoded",
  };

  const data = `grant_type=authorization_code&client_id=${id}&client_secret=${key}&code=${code}&redirect_uri=${uri}`;

  const response = await fetch(mercadoLivreURL, {
    method: "POST",
    headers: headers,
    body: data,
  });

  const json = await response.json();
  console.log(json);

  res.send("OK");
});

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
