/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", function (table) {
    table.increments("id").primary();
    table.string("product_id");
    table.string("general_id");
    table.string("type");
    table.string("fabric");
    table.integer("stock");
    table.integer("sold");
    table.string("color");
    table.string("size");
    table.string("URL");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("products");
};
