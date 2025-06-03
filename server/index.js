const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cron = require("node-cron");
const axios = require("axios");
const {
  fullStock,
  polyesterStock,
  cottonStock,
  poloStock,
  orderedProducts,
  bestSellingProducts,
  unitsSold,
  minimumStock,
  salesReport,
} = require("./api/full-stock.js");

const { getSalesByMonth } = require("./db-queries/sales.js");

const { router: loginRouter } = require("./routes/login.js");
const {
  router: tokenRouter,
  refreshAccessToken,
} = require("./routes/token.js");
const { router: mercadoLivreRouter } = require("./routes/mercado-livre.js");
const { router: salesRouter } = require("./routes/sales.js");
const { router: stockRouter } = require("./routes/stock.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:3000",
  "http://aminhamarca.com",
  "https://aminhamarca.com",
  "http://18.236.159.137:3000",
  "http://18.236.159.137",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🌐 Origin da requisição:", origin);

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// API Routes
app.use("/api", loginRouter);
app.use("/api/token", tokenRouter);
app.use("/api/ml", mercadoLivreRouter);
app.use("/api/sales", salesRouter);
app.use("/api/stock", stockRouter);

// Original API Routes
app.get("/api/full-stock", fullStock);
app.get("/api/polyester", polyesterStock);
app.get("/api/cotton", cottonStock);
app.get("/api/polo", poloStock);
app.get("/api/ordered-products", orderedProducts);
app.get("/api/best-selling-products", bestSellingProducts);
app.get("/api/units-sold", unitsSold);
app.get("/api/minimum-stock", minimumStock);
app.get("/api/sales-report", salesReport);
app.get("/api/sales-monthly", async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: "Year and month are required" });
    }

    const data = await getSalesByMonth(Number(year), Number(month));

    res.json(data);
  } catch (error) {
    console.error("Erro em sales-monthly:", error);
    res.status(500).json({ error: "Erro ao buscar vendas mensais" });
  }
});

cron.schedule("0 * * * *", async () => {
  await runRefreshToken();
  await runSalesCron();
  await runStockCron();
});

const runRefreshToken = async () => {
  try {
    await refreshAccessToken();
  } catch (error) {
    console.error(
      "❌ Erro no cron job de atualização de token:",
      error.message
    );
  }
};

const runSalesCron = async () => {
  try {
    const publicUrl = process.env.EC2_PUBLIC_URL || "http://localhost:3001";
    const res = await axios.get(`${publicUrl}/api/sales`);
  } catch (error) {
    console.error("❌ Erro no cron job de vendas:", error.message);
  }
};

const runStockCron = async () => {
  try {
    const publicUrl = process.env.EC2_PUBLIC_URL || "http://localhost:3001";
    const res = await axios.get(`${publicUrl}/api/stock/fetch-all-items`);
  } catch (error) {
    console.error("❌ Erro no cron job de estoque:", error.message);
  }
};

cron.schedule("0 * * * *", async () => {
  await runRefreshToken();
  await runSalesCron();
  await runStockCron();
});

// Iniciar o servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend rodando em http://0.0.0.0:${PORT}`);
});
