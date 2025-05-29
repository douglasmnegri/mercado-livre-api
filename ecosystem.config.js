const fs = require("fs");
const dotenv = require("dotenv");

const envConfig = fs.existsSync("/etc/app.env")
  ? dotenv.parse(fs.readFileSync("/etc/app.env"))
  : dotenv.parse(fs.readFileSync(".env"));

module.exports = {
  apps: [
    {
      name: "mercadolivre-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        ...envConfig,
      },
    },
    {
      name: "mercadolivre-backend",
      script: "server/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        ...envConfig,
      },
    },
  ],
};
