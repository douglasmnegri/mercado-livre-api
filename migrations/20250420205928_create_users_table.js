// migrations/XXXX_create_users_table.js
exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
