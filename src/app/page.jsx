"use client";
import Dashboard from "../../components/dashboard";
import { useEffect, useState } from "react";

export default function Page() {
  const [stock, setStock] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    console.log("🔍 Fazendo requisição para o backend...");
    fetch("http://localhost:3001/api/full-stock")
      .then((res) => {
        console.log("✅ Resposta recebida do backend");
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setStock(data.stock[0].sum);
        setActiveProducts(data.activeProducts[0].count);
      })
      .catch((err) => {
        console.error("❌ Erro ao buscar estoque:", err);
      });
  }, []);

  useEffect(() => {
    console.log("🔍 Fazendo requisição para o backend...");
    fetch("http://localhost:3001/api/ordered-products")
      .then((res) => {
        console.log("✅ Resposta recebida do backend");
        return res.json();
      })
      .then((data) => {
        setOrderedProducts(data);
      })
      .catch((err) => {
        console.error("❌ Erro ao buscar estoque:", err);
      });
  }, []);

  useEffect(() => {
    console.log("🔍 Fazendo requisição para o backend...");
    fetch("http://localhost:3001/api/best-selling-products")
      .then((res) => {
        console.log("✅ Resposta recebida do backend");
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setBestSellingProducts(data);
      })
      .catch((err) => {
        console.error("❌ Erro ao buscar estoque:", err);
      });
  }, []);
  return (
    <div>
      <Dashboard
        fullStock={stock}
        activeProducts={activeProducts}
        orderedProducts={orderedProducts}
        bestSellingProducts={bestSellingProducts}
      />
    </div>
  );
}
