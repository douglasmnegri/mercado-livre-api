
exports.up = function (knex) {
    return knex.schema.createTable("sales", function (table) {
      table.increments("id").primary();
      table.bigInteger("order_id").notNullable();
      table.string("product_id").notNullable();
      table.string("title").notNullable();
      table.string("size").notNullable();
      table.decimal("unit_price", 10, 2).notNullable();
      table.integer("quantity_sold").notNullable();
      table.timestamp("sale_date").notNullable();
  
      table.unique(["order_id", "product_id"]); 
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("sales");
  };
  