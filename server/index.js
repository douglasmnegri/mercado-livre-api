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

const { router: loginRouter } = require("./routes/login.js");
const { router: tokenRouter, refreshAccessToken } = require("./routes/token.js");
const { router: mercadoLivreRouter } = require("./routes/mercado-livre.js");
const { router: salesRouter } = require("./routes/sales.js");
const { router: stockRouter } = require("./routes/stock.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'http://54.188.35.92:3000'  // Production frontend URL
    : 'http://localhost:3000',      // Development frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
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

// Schedule cron jobs
cron.schedule("0 * * * *", async () => {
  try {
    const publicUrl = process.env.PUBLIC_URL || process.env.NEXT_PUBLIC_API_URL || `http://localhost:${PORT}`;
    const res = await axios.get(`${publicUrl}/api/sales`);
    console.log("✅ Fetch finalizado:", res.data.message);
  } catch (error) {
    console.error("❌ Erro no cron job:", error.message);
  }
});

cron.schedule("0 */2 * * *", async () => {
  try {
    const publicUrl = process.env.PUBLIC_URL || process.env.NEXT_PUBLIC_API_URL || `http://localhost:${PORT}`;
    const res = await axios.get(`${publicUrl}/api/stock/fetch-all-items`);
    console.log("✅ Fetch finalizado:", res.data.message);
  } catch (error) {
    console.error("❌ Erro no cron job:", error.message);
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});


