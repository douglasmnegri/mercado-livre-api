const knex = require("knex");
const config = require("../../knexfile.js");

const env = process.env.NODE_ENV !== "production" ? "development" : "production";
const dbConnection = knex(config[env]);

module.exports = dbConnection; 