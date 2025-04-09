"use client";
import Dashboard from "../../components/dashboard";
import { useEffect, useState } from "react";

export default function Page() {
  const [stock, setStock] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);
  useEffect(() => {
    console.log("🔍 Fazendo requisição para o backend...");

    fetch("http://localhost:3001/api/full-stock")
      .then((res) => {
        console.log("✅ Resposta recebida do backend");
        return res.json();
      })
      .then((data) => {
        console.log("📦 Dados recebidos:", data);
        setStock(data.stock[0].sum);
        setActiveProducts(data.activeProducts[0].count)
      })
      .catch((err) => {
        console.error("❌ Erro ao buscar estoque:", err);
      });
  }, []);
  return (
    <div>
      <Dashboard stock={stock} activeProducts={activeProducts} />
    </div>
  );
}
