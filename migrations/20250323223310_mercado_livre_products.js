/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("products", function (table) {
      table.increments("id").primary();
      table.string("product_id").unique();
      table.string("general_id");
      table.string("type");
      table.string("fabric");
      table.integer("stock");
      table.integer("sold");
      table.string("color");
      table.string("size");
      table.string("URL");
      table.string("picture");
    })
    .then(() => {
      return knex.schema.createTable("min_stock", function (table) {
        table.string("size").primary();
        table.integer("min").notNullable();
      });
    })
    .then(() => {
      return knex.schema.createTable("tokens", function (table) {
        table.string("id").primary();
        table.string("key").notNullable();
        table.string("uri");
        table.string("access_token").notNullable();
        table.string("refresh_token");
        table.string("seller_id");
        table.string("url");
        table.timestamp("expires_at");
      });
    })
    .then(() => {
      return knex.schema.createTable("list", function (table) {
        table.string("product_id").primary();
        table.boolean("processed").defaultTo(false);
        table.timestamp("added_at").defaultTo(knex.fn.now());
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("list")
    .then(() => knex.schema.dropTableIfExists("tokens"))
    .then(() => knex.schema.dropTableIfExists("min_stock"))
    .then(() => knex.schema.dropTableIfExists("products"));
};
