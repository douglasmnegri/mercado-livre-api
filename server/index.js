import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import {
  fullStock,
  polyesterStock,
  cottonStock,
  poloStock,
  orderedProducts,
  bestSellingProducts,
  unitsSold,
  minimumStock,
  salesReport,
} from "./api/full-stock.js";

import { router } from "./routes/login.js";
dotenv.config();

// Configuração para __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Rotas da API
app.use("/api", router);
app.get("/api/full-stock", fullStock);
app.get("/api/polyester", polyesterStock);
app.get("/api/cotton", cottonStock);
app.get("/api/polo", poloStock);
app.get("/api/ordered-products", orderedProducts);
app.get("/api/best-selling-products", bestSellingProducts);
app.get("/api/units-sold", unitsSold);
app.get("/api/minimum-stock", minimumStock);
app.get("/api/sales-report", salesReport);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
