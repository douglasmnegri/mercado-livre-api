const { Client } = require("pg");

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log("DATABASE_URL =", process.env.DATABASE_URL);


async function test() {
  try {
    await client.connect();
    console.log("Conectou no banco com sucesso!");
    const res = await client.query("SELECT NOW()");
    console.log("Hora do banco:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Erro na conexão:", err);
  }
}

test();
