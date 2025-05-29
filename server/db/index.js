require("dotenv").config();
const knex = require("knex");
const config = require("../../knexfile.js");

const db = knex(config.production);

module.exports = db;
