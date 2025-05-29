"use client";
import { useState, useMemo } from "react";
import {
  format,
  subDays,
  startOfDay,
  startOfMonth,
  isWithinInterval,
} from "date-fns";
import { ptBR } from "date-fns/locale";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Mock products
const mockProducts = [
  {
    id: "MLB5026163190",
    title: "Camiseta Algodão Vortex Rosa Pink",
    price: 24.01,
  },
  {
    id: "MLB5026163191",
    title: "Camiseta Algodão Premium Azul Marinho",
    price: 29.99,
  },
  { id: "MLB5026163192", title: "Camiseta Algodão Vortex Branca", price: 22.5 },
  { id: "MLB5026163193", title: "Camiseta Algodão Vortex Preta", price: 24.01 },
  {
    id: "MLB5026163194",
    title: "Camiseta Algodão Premium Verde Militar",
    price: 29.99,
  },
];

// Mock sales data with dates spanning over the last month
const generateMockSalesData = () => {
  const today = new Date();
  const data = [];

  // Generate sales for the last 30 days
  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i);

    // Generate 1-3 sales per day
    const salesCount = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < salesCount; j++) {
      // Random product selection
      const productIndex = Math.floor(Math.random() * mockProducts.length);
      const product = mockProducts[productIndex];

      // Random size
      const sizes = ["P", "M", "G", "GG", "XG"];
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      // Random quantity between 1 and 5
      const quantity = Math.floor(Math.random() * 5) + 1;

      data.push({
        order_id: `ORD-${date.getTime()}-${j}`,
        product_id: product.id,
        title: product.title,
        size: size,
        unit_price: product.price,
        quantity_sold: quantity,
        sale_date: date.toISOString(),
        total: product.price * quantity,
      });
    }
  }

  return data;
};

const mockSalesData = generateMockSalesData();

export function SalesAnalytics() {
  const [timeFilter, setTimeFilter] = useState("15days");
  const [dataType, setDataType] = useState("revenue");
  const [productFilter, setProductFilter] = useState("all");

  // Filter data based on time period
  const filteredByTime = useMemo(() => {
    const today = new Date();
    const todayStart = startOfDay(today);

    let startDate;
    if (timeFilter === "day") {
      startDate = todayStart;
    } else if (timeFilter === "15days") {
      startDate = subDays(todayStart, 14);
    } else if (timeFilter === "month") {
      startDate = startOfMonth(today);
    }

    return mockSalesData.filter((sale) => {
      const saleDate = new Date(sale.sale_date);
      return isWithinInterval(saleDate, { start: startDate, end: today });
    });
  }, [timeFilter]);

  // Further filter by product if needed
  const filteredData = useMemo(() => {
    if (productFilter === "all") {
      return filteredByTime;
    }
    return filteredByTime.filter((sale) => sale.product_id === productFilter);
  }, [filteredByTime, productFilter]);

  // Aggregate data by date for the chart
  const chartData = useMemo(() => {
    const aggregatedData = {};

    filteredData.forEach((sale) => {
      const date = format(new Date(sale.sale_date), "yyyy-MM-dd");

      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          date,
          revenue: 0,
          units: 0,
          orders: new Set(),
        };
      }

      // Sum revenue
      aggregatedData[date].revenue += sale.unit_price * sale.quantity_sold;

      // Sum units
      aggregatedData[date].units += sale.quantity_sold;

      // Count unique orders
      aggregatedData[date].orders.add(sale.order_id);
    });

    // Convert to array and format for chart
    return Object.values(aggregatedData).map((item) => ({
      ...item,
      orders: item.orders.size,
      date: format(new Date(item.date), "dd/MM", { locale: ptBR }),
      revenue: Number(item.revenue.toFixed(2)),
    }));
  }, [filteredData]);

  // Get the appropriate y-axis data based on selected data type
  const getYAxisData = () => {
    switch (dataType) {
      case "revenue":
        return "revenue";
      case "units":
        return "units";
      case "orders":
        return "orders";
      default:
        return "revenue";
    }
  };

  // Format the y-axis label based on data type
  const formatYAxisLabel = (value) => {
    if (dataType === "revenue") {
      return `R$ ${value}`;
    }
    return value;
  };

  // Get chart title based on selected data type
  const getChartTitle = () => {
    switch (dataType) {
      case "revenue":
        return "Receita de Vendas";
      case "units":
        return "Unidades Vendidas";
      case "orders":
        return "Número de Pedidos";
      default:
        return "Vendas";
    }
  };

  // Get chart description based on selected time filter
  const getChartDescription = () => {
    switch (timeFilter) {
      case "day":
        return "Vendas de hoje";
      case "15days":
        return "Vendas dos últimos 15 dias";
      case "month":
        return "Vendas do mês atual";
      default:
        return "Vendas";
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>{getChartTitle()}</CardTitle>
            <CardDescription>{getChartDescription()}</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hoje</SelectItem>
                <SelectItem value="15days">Últimos 15 dias</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de dado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Receita (R$)</SelectItem>
                <SelectItem value="units">Unidades vendidas</SelectItem>
                <SelectItem value="orders">Número de pedidos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os produtos</SelectItem>
                {mockProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title.length > 20
                      ? `${product.title.substring(0, 20)}...`
                      : product.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={formatYAxisLabel} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => {
                  if (dataType === "revenue") {
                    return [`R$ ${value}`, "Valor"];
                  }
                  return [value, dataType === "units" ? "Unidades" : "Pedidos"];
                }}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Line
                type="monotone"
                dataKey={getYAxisData()}
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name={
                  dataType === "revenue"
                    ? "Receita"
                    : dataType === "units"
                    ? "Unidades"
                    : "Pedidos"
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {chartData.length === 0 && (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Nenhum dado disponível para o período selecionado
          </div>
        )}
      </CardContent>
    </Card>
  );
}
