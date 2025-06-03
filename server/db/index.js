require("dotenv").config();
const knex = require("knex");
const config = require("../../knexfile.js");

const dbConnection = knex(config.production);

module.exports = dbConnection;
