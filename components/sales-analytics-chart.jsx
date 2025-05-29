"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CalendarDays,
  TrendingUp,
  Package,
  DollarSign,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Single mock data source
const mockData = [
  {
    date: "2024-01-10",
    displayDate: "10/01",
    revenue: 95,
    quantity: 3,
    orders: 2,
    avg_price: 32,
  },
  {
    date: "2024-01-11",
    displayDate: "11/01",
    revenue: 140,
    quantity: 5,
    orders: 3,
    avg_price: 28,
  },
  {
    date: "2024-01-12",
    displayDate: "12/01",
    revenue: 180,
    quantity: 6,
    orders: 4,
    avg_price: 30,
  },
  {
    date: "2024-01-13",
    displayDate: "13/01",
    revenue: 220,
    quantity: 8,
    orders: 5,
    avg_price: 28,
  },
  {
    date: "2024-01-14",
    displayDate: "14/01",
    revenue: 160,
    quantity: 6,
    orders: 3,
    avg_price: 27,
  },
  {
    date: "2024-01-15",
    displayDate: "15/01",
    revenue: 120,
    quantity: 4,
    orders: 2,
    avg_price: 30,
  },
  {
    date: "2024-01-16",
    displayDate: "16/01",
    revenue: 180,
    quantity: 6,
    orders: 3,
    avg_price: 30,
  },
  {
    date: "2024-01-17",
    displayDate: "17/01",
    revenue: 210,
    quantity: 7,
    orders: 4,
    avg_price: 30,
  },
  {
    date: "2024-01-18",
    displayDate: "18/01",
    revenue: 150,
    quantity: 5,
    orders: 3,
    avg_price: 30,
  },
  {
    date: "2024-01-19",
    displayDate: "19/01",
    revenue: 275,
    quantity: 9,
    orders: 5,
    avg_price: 31,
  },
  {
    date: "2024-01-20",
    displayDate: "20/01",
    revenue: 195,
    quantity: 7,
    orders: 4,
    avg_price: 28,
  },
  {
    date: "2024-01-21",
    displayDate: "21/01",
    revenue: 320,
    quantity: 11,
    orders: 6,
    avg_price: 29,
  },
  {
    date: "2024-01-22",
    displayDate: "22/01",
    revenue: 165,
    quantity: 6,
    orders: 3,
    avg_price: 28,
  },
  {
    date: "2024-01-23",
    displayDate: "23/01",
    revenue: 290,
    quantity: 10,
    orders: 5,
    avg_price: 29,
  },
  {
    date: "2024-01-24",
    displayDate: "24/01",
    revenue: 240,
    quantity: 8,
    orders: 4,
    avg_price: 30,
  },
  {
    date: "2024-01-25",
    displayDate: "25/01",
    revenue: 380,
    quantity: 13,
    orders: 7,
    avg_price: 29,
  },
  {
    date: "2024-01-26",
    displayDate: "26/01",
    revenue: 310,
    quantity: 11,
    orders: 6,
    avg_price: 28,
  },
  {
    date: "2024-01-27",
    displayDate: "27/01",
    revenue: 220,
    quantity: 8,
    orders: 4,
    avg_price: 28,
  },
  {
    date: "2024-01-28",
    displayDate: "28/01",
    revenue: 405,
    quantity: 14,
    orders: 8,
    avg_price: 29,
  },
  {
    date: "2024-01-29",
    displayDate: "29/01",
    revenue: 195,
    quantity: 7,
    orders: 4,
    avg_price: 28,
  },
  {
    date: "2024-01-30",
    displayDate: "30/01",
    revenue: 520,
    quantity: 18,
    orders: 10,
    avg_price: 29,
  },
];

export function SalesAnalyticsChart({ salesData }) {
  const [timeFilter, setTimeFilter] = useState("15days");
  const [dataMetric, setDataMetric] = useState("revenue");
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  // Use provided data or fall back to mock data
  const dataToUse = salesData && salesData.length > 0 ? salesData : mockData;

  const getFilteredData = () => {
    if (timeFilter === "custom" && dateRange.from && dateRange.to) {
      const fromStr = format(dateRange.from, "yyyy-MM-dd");
      const toStr = format(dateRange.to, "yyyy-MM-dd");
      return dataToUse.filter(
        (item) => item.date >= fromStr && item.date <= toStr
      );
    }

    // For preset filters, get the last N items
    let itemsToShow = 15;
    switch (timeFilter) {
      case "day":
        itemsToShow = 1;
        break;
      case "7days":
        itemsToShow = 7;
        break;
      case "15days":
        itemsToShow = 15;
        break;
      case "month":
        itemsToShow = 21; // We only have 21 days of data
        break;
    }

    return dataToUse.slice(-itemsToShow);
  };

  const filteredData = getFilteredData();

  const getMetricLabel = (metric) => {
    switch (metric) {
      case "revenue":
        return "Receita (R$)";
      case "quantity":
        return "Quantidade Vendida";
      case "orders":
        return "Número de Pedidos";
      case "avg_price":
        return "Preço Médio (R$)";
      default:
        return "Valor";
    }
  };

  const getMetricIcon = (metric) => {
    switch (metric) {
      case "revenue":
        return <DollarSign className="h-4 w-4" />;
      case "quantity":
        return <Package className="h-4 w-4" />;
      case "orders":
        return <TrendingUp className="h-4 w-4" />;
      case "avg_price":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const totalValue = filteredData.reduce(
    (sum, item) => sum + (item[dataMetric] || 0),
    0
  );
  const averageValue =
    filteredData.length > 0 ? totalValue / filteredData.length : 0;

  const isUsingMockData = !salesData || salesData.length === 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {getMetricIcon(dataMetric)}
              Análise de Vendas - {getMetricLabel(dataMetric)}
              {isUsingMockData && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md">
                  DEMO
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {isUsingMockData
                ? "Visualizando dados de demonstração - conecte seus dados reais para análise completa"
                : "Visualize suas vendas ao longo do tempo com diferentes métricas"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredData.length} dias de dados
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Período:</label>
            <Select
              value={timeFilter}
              onValueChange={(value) => setTimeFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Último Dia</SelectItem>
                <SelectItem value="7days">Últimos 7 Dias</SelectItem>
                <SelectItem value="15days">Últimos 15 Dias</SelectItem>
                <SelectItem value="month">Últimos 21 Dias</SelectItem>
                <SelectItem value="custom">Período Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {timeFilter === "custom" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecionar Datas:</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[140px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from
                        ? format(dateRange.from, "dd/MM", { locale: ptBR })
                        : "Data inicial"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) =>
                        setDateRange((prev) => ({ ...prev, from: date }))
                      }
                      disabled={(date) =>
                        date > new Date("2024-01-30") ||
                        date < new Date("2024-01-10")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[140px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to
                        ? format(dateRange.to, "dd/MM", { locale: ptBR })
                        : "Data final"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) =>
                        setDateRange((prev) => ({ ...prev, to: date }))
                      }
                      disabled={(date) =>
                        date > new Date("2024-01-30") ||
                        date < new Date("2024-01-10")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Métrica:</label>
            <Select
              value={dataMetric}
              onValueChange={(value) => setDataMetric(value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Receita</SelectItem>
                <SelectItem value="quantity">Quantidade</SelectItem>
                <SelectItem value="orders">Nº de Pedidos</SelectItem>
                <SelectItem value="avg_price">Preço Médio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total no Período</p>
            <p className="text-2xl font-bold">
              {dataMetric === "revenue" || dataMetric === "avg_price"
                ? `R$ ${totalValue.toFixed(2)}`
                : totalValue.toFixed(0)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Média Diária</p>
            <p className="text-2xl font-bold">
              {dataMetric === "revenue" || dataMetric === "avg_price"
                ? `R$ ${averageValue.toFixed(2)}`
                : averageValue.toFixed(0)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="displayDate" stroke="#666" fontSize={12} />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) =>
                  dataMetric === "revenue" || dataMetric === "avg_price"
                    ? `R$ ${value}`
                    : value.toString()
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                formatter={(value, name) => [
                  dataMetric === "revenue" || dataMetric === "avg_price"
                    ? `R$ ${Number(value).toFixed(2)}`
                    : Number(value).toFixed(0),
                  getMetricLabel(dataMetric),
                ]}
                labelFormatter={(value) => `Data: ${value}`}
              />
              <Line
                type="monotone"
                dataKey={dataMetric}
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#2563eb", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
