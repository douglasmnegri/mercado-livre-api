require("dotenv").config({ path: "../../.env" }); // Adjust if needed
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