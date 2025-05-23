const { Client } = require("pg");

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function test() {
  try {
    await client.connect();
    const res = await client.query("SELECT NOW()");
    await client.end();
  } catch (err) {}
}
