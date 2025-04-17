/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Limpa a tabela primeiro
  await knex("min_stock").del();

  // Insere os valores mínimos por tamanho
  await knex("min_stock").insert([
    { size: "P", min: 10 },
    { size: "M", min: 20 },
    { size: "G", min: 40 },
    { size: "GG", min: 30 },
  ]);
};
