import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
