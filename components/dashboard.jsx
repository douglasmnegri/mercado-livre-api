"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockChart } from "../components/stock-chart";
import { SalesChart } from "../components/sales-chart";
import { TopProductsChart } from "./top-products-chart";
import {
  ArrowUpIcon,
  ShirtIcon,
  PackageIcon,
  TrendingUpIcon,
} from "lucide-react";
// Remove the import for ChangeDataset since the file doesn't exist
import { useState, useEffect } from "react";
import { AnalyticsContent } from "../components/analytics-content";
import { SalesContent } from "./sales-content";

export default function Dashboard({
  fullStock,
  activeProducts,
  orderedProducts,
  bestSellingProducts,
  unitsSold,
  minStock,
  salesReport,
}) {
  const [selectedFabric, setSelectedFabric] = useState("Camiseta Algodão");
  const [routeName, setRouteName] = useState("cotton");
  const [currentProduct, setCurrentProduct] = useState([]);

  function onFabricChange(fabric) {
    if (fabric === "poly") {
      setSelectedFabric("Camiseta Poliéster");
      setRouteName("polyester");
    } else if (fabric == "cott") {
      setSelectedFabric("Camiseta Algodão");
      setRouteName("cotton");
    } else {
      setSelectedFabric("Camisa Polo");
      setRouteName("polo");
    }
  }

  useEffect(() => {
    console.log("🔍 Fazendo requisição para o backend...");
    fetch(`http://localhost:3001/api/${routeName}`)
      .then((res) => {
        console.log("✅ Resposta recebida do backend");
        return res.json();
      })
      .then((data) => {
        console.log("📦 Dados recebidos:", data);
        setCurrentProduct(data);
      })
      .catch((err) => {
        console.error("❌ Erro ao buscar estoque:", err);
      });
  }, [routeName]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Geral</TabsTrigger>
            <TabsTrigger value="analytics">Análise Estoque</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Stock
                  </CardTitle>
                  <ShirtIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{fullStock} items</div>
                  {/* <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <ArrowUpIcon className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">+20.1%</span>
                    <span>from last month</span>
                  </div> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Unit Sales
                  </CardTitle>
                  <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {Array.isArray(unitsSold) && unitsSold.length > 0 ? (
                    <div className="text-2xl font-bold">
                      {unitsSold[0].total_units}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold">Carregando...</div>
                  )}

                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {/* <ArrowUpIcon className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">+15.3%</span>
                    <span>from last month</span> */}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Products
                  </CardTitle>
                  <PackageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeProducts}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {/* <ArrowUpIcon className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">+12</span>
                    <span>new products this month</span> */}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <CardTitle>Estoque de {selectedFabric}</CardTitle>
                      <CardDescription>
                        Inventário somado de todas as peças e variação por
                        tamanho
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onFabricChange("cott")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          selectedFabric === "Camiseta Algodão"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        Algodão
                      </button>
                      <button
                        onClick={() => onFabricChange("poly")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          selectedFabric === "Camiseta Poliéster"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        Poliéster
                      </button>
                      <button
                        onClick={() => onFabricChange("polo")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          selectedFabric === "Camisa Polo"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        Polo
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pl-2">
                  <StockChart cottonStock={currentProduct} />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                  <CardDescription>
                    Best selling products by revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopProductsChart bestSellingProducts={bestSellingProducts} />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-1">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Number of Products Sold (Sales)</CardTitle>
                  <CardDescription>
                    Monthly sales performance by product category
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <SalesChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsContent
              orderedProducts={orderedProducts}
              minStock={minStock}
              stock={fullStock}
            />
          </TabsContent>
          <TabsContent value="sales" className="space-y-4">
            <SalesContent salesReport={salesReport} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
