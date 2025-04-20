require("dotenv").config();
const fs = require("fs");
const path = require("path");

exports.seed = async function (knex) {
  // Limpar tabelas
  await knex("min_stock").del();
  await knex("tokens").del();
  await knex("list").del();

  // Inserir min_stock
  await knex("min_stock").insert([
    { size: "P", min: 10 },
    { size: "M", min: 20 },
    { size: "G", min: 40 },
    { size: "GG", min: 30 },
  ]);

  // Inserir tokens
  await knex("tokens").insert([
    {
      id: process.env.ID,
      key: process.env.KEY,
      uri: process.env.URI,
      access_token: process.env.ACCESS_TOKEN,
      refresh_token: process.env.REFRESH_TOKEN,
      seller_id: process.env.ML_SELLER_ID,
      url: process.env.MERCADOLIVREURL,
      expires_at: null,
    },
  ]);

  const rawData = fs.readFileSync(
    path.join(__dirname, "../id.json"),
    "utf-8"
  );
  const ids = JSON.parse(rawData);

  const listData = ids.map((id) => ({ product_id: id }));
  await knex("list").insert(listData);
};
