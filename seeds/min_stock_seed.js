require("dotenv").config();

exports.seed = async function (knex) {
  await knex("min_stock").del();
  await knex("tokens").del();

  await knex("min_stock").insert([
    { size: "P", min: 10 },
    { size: "M", min: 20 },
    { size: "G", min: 40 },
    { size: "GG", min: 30 },
  ]);

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
};
