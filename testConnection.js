const { Client } = require("pg");

const connectionString = "postgresql://postgres.gzzukmnujjjpyqvhheqm:Z.AruEbP8u9AqiW@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"

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
