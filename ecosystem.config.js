// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "mercadolivre-frontend",
      script: "node_modules/.bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "mercadolivre-backend",
      script: "server/index.js",
      env: {
        NODE_ENV: "development",
        PORT: 3001,
        ID: process.env.ID,
        KEY: process.env.KEY,
        CODE: process.env.CODE,
        URI: process.env.URI,
        SELLER_ID: process.env.SELLER_ID,
        ACCESS_TOKEN: process.env.ACCESS_TOKEN,
        MERCADOLIVREURL: process.env.MERCADOLIVREURL,
        PUBLIC_URL: process.env.PUBLIC_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        DATABASE_URL: process.env.DATABASE_URL || "postgresql://douglasmnegri:ml@localhost:5432/mercado_livre_db"
      },
    }
  ],
};
