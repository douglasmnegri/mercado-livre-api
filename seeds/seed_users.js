require("dotenv").config();
const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  await knex("users").del();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  const password_hash = await bcrypt.hash(password, 10);

  await knex("users").insert([
    {
      email,
      password_hash,
    },
  ]);
};
