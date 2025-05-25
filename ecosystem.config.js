module.exports = {
  apps: [
    {
      name: "mercadolivre-frontend",
      script: "node_modules/next/dist/bin/next",
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
        DATABASE_URL: process.env.DATABASE_URL,
      },
    },
  ],
};
