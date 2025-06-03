"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "../../components/dashboard";
import { LoginForm } from "../../components/login-form";

export default function Page() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const [stock, setStock] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [unitsSold, setUnitsSold] = useState([]);
  const [minStock, setMinStock] = useState([]);
  const [salesReport, setSalesReport] = useState([]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Data fetching effects
  useEffect(() => {
    if (!isAuthenticated) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log(apiUrl)

    fetch(`${apiUrl}/api/full-stock`)
      .then((res) => res.json())
      .then((data) => {
        setStock(data.stock[0].sum);
        setActiveProducts(data.activeProducts[0].count);
      })
      .catch((err) => console.error("❌ Erro ao buscar estoque:", err));

    fetch(`${apiUrl}/api/ordered-products`)
      .then((res) => res.json())
      .then(setOrderedProducts)
      .catch((err) => console.error("❌ Erro ao buscar pedidos:", err));

    fetch(`${apiUrl}/api/best-selling-products`)
      .then((res) => res.json())
      .then(setBestSellingProducts)
      .catch((err) => console.error("❌ Erro ao buscar mais vendidos:", err));

    fetch(`${apiUrl}/api/units-sold`)
      .then((res) => res.json())
      .then(setUnitsSold)
      .catch((err) =>
        console.error("❌ Erro ao buscar unidades vendidas:", err)
      );

    fetch(`${apiUrl}/api/minimum-stock`)
      .then((res) => res.json())
      .then(setMinStock)
      .catch((err) => console.error("❌ Erro ao buscar estoque mínimo:", err));

    fetch(`${apiUrl}/api/sales-report`)
      .then((res) => res.json())
      .then(setSalesReport)
      .catch((err) =>
        console.error("❌ Erro ao buscar relatório de vendas:", err)
      );
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated ? (
        <Dashboard
          fullStock={stock}
          activeProducts={activeProducts}
          orderedProducts={orderedProducts}
          bestSellingProducts={bestSellingProducts}
          unitsSold={unitsSold}
          minStock={minStock}
          salesReport={salesReport}
        />
      ) : (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="w-full">
            <LoginForm
              onLoginSuccess={() => {
                setIsAuthenticated(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
