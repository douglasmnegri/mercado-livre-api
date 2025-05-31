const { Client } = require("pg");

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // necessário para Supabase e outros bancos gerenciados
  },
});

async function test() {
  try {
    await client.connect();
    const res = await client.query("SELECT NOW()");
    console.log("✅ Conectado! Horário do banco:", res.rows[0]);
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
  } finally {
    await client.end();
  }
}

test();
