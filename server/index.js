import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fullStock from "./api/full-stock.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/full-stock", fullStock);

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
