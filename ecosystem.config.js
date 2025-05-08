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
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
    {
      name: "mercadolivre-sales",
      script: "server/services/sales-ml.js",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
    },
    {
      name: "mercadolivre-stock",
      script: "server/services/stock-ml.js",
      env: {
        NODE_ENV: "production",
        PORT: 3004,
      },
    },
    {
      name: "mercadolivre-token",
      script: "server/services/token.js",
      env: {
        NODE_ENV: "production",
        PORT: 3005,
      },
    },
    {
      name: "mercadolivre-api",
      script: "server/services/mercado-livre.js",
      env: {
        NODE_ENV: "production",
        PORT: 3006,
      },
    },
  ],
};
