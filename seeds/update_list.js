const fs = require("fs");
const path = require("path");

exports.seed = async function (knex) {
  const rawData = fs.readFileSync(
    path.join(__dirname, "../id.json"),
    "utf-8"
  );
  const ids = JSON.parse(rawData);

  for (const id of ids) {
    const exists = await knex("list").where({ product_id: id }).first();
    if (!exists) {
      await knex("list").insert({ product_id: id });
    }
  }
};
