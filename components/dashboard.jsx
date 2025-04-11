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
import ChangeDataset from "./ui/button-fabric";
import { use, useState, useEffect } from "react";
export default function Dashboard({ fullStock, activeProducts, cottonStock }) {
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
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
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
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <ArrowUpIcon className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">+20.1%</span>
                    <span>from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Sales
                  </CardTitle>
                  <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <ArrowUpIcon className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">+15.3%</span>
                    <span>from last month</span>
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
                    <ArrowUpIcon className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">+12</span>
                    <span>new products this month</span>
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
                    <ChangeDataset
                      fabricType={selectedFabric}
                      onFabricChange={onFabricChange}
                    />{" "}
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
                  <TopProductsChart />
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                  <CardDescription>
                    Detailed analytics will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Analytics content</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Metrics content</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>
                    Generated reports will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Reports content</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
