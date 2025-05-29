"use client";

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
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function SalesAnalytics({ data }) {
  const [timeFilter, setTimeFilter] = useState("30days");
  const [dataType, setDataType] = useState("revenue");
  const [productFilter, setProductFilter] = useState("all");
  const [salesReport, setSalesReport] = useState([]);

  // Get unique products for the filter
  const uniqueProducts = Array.from(
    new Set(data?.map((item) => item.title) || [])
  ).slice(0, 10); // Limit to first 10 products for better UX

  const processData = () => {
    if (!data || data.length === 0) {
      setSalesReport([]);
      return;
    }

    // Get current date in UTC
    const now = new Date();

    // Create UTC dates for filtering - set to end of current day to include all of today
    const todayEnd = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );
    const filterDate = new Date(todayEnd);

    // Set filter date based on selection (in UTC)
    switch (timeFilter) {
      case "day":
        filterDate.setUTCDate(todayEnd.getUTCDate() - 1);
        break;
      case "15days":
        filterDate.setUTCDate(todayEnd.getUTCDate() - 15);
        break;
      case "30days":
        filterDate.setUTCDate(todayEnd.getUTCDate() - 30);
        break;
      case "month":
        filterDate.setUTCMonth(todayEnd.getUTCMonth() - 1);
        break;
      default:
        filterDate.setUTCDate(todayEnd.getUTCDate() - 30);
    }

    // Filter data by date and product - using UTC comparison
    const filteredData = data.filter((item) => {
      const saleDate = new Date(item.sale_date);
      const matchesDate = saleDate >= filterDate && saleDate <= todayEnd;
      const matchesProduct =
        productFilter === "all" || item.title === productFilter;
      return matchesDate && matchesProduct;
    });

    // Group data by date (using UTC date strings)
    const groupedData = {};

    filteredData.forEach((item) => {
      const saleDate = new Date(item.sale_date);
      // Extract date in YYYY-MM-DD format using UTC
      const dateStr = `${saleDate.getUTCFullYear()}-${String(
        saleDate.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(saleDate.getUTCDate()).padStart(2, "0")}`;

      if (!groupedData[dateStr]) {
        groupedData[dateStr] = [];
      }
      groupedData[dateStr].push(item);
    });

    // Calculate metrics for each date
    const chartData = Object.entries(groupedData).map(([date, items]) => {
      let value = 0;

      switch (dataType) {
        case "revenue":
          value = items.reduce(
            (sum, item) =>
              sum + Number.parseFloat(item.unit_price) * item.quantity_sold,
            0
          );
          break;
        case "units":
          value = items.reduce((sum, item) => sum + item.quantity_sold, 0);
          break;
        case "orders":
          value = new Set(items.map((item) => item.order_id)).size;
          break;
      }

      // Parse the date string to create a date object for formatting
      const [year, month, day] = date.split("-").map(Number);
      const dateObj = new Date(Date.UTC(year, month - 1, day));

      return {
        date,
        value: Math.round(value * 100) / 100, // Round to 2 decimal places
        formattedDate: `${String(dateObj.getUTCDate()).padStart(
          2,
          "0"
        )}/${String(dateObj.getUTCMonth() + 1).padStart(2, "0")}`,
        isToday:
          dateObj.getUTCFullYear() === now.getUTCFullYear() &&
          dateObj.getUTCMonth() === now.getUTCMonth() &&
          dateObj.getUTCDate() === now.getUTCDate(),
      };
    });

    // Sort by date
    chartData.sort((a, b) => a.date.localeCompare(b.date));

    // Create date range using UTC dates
    const startDateParts = filterDate
      .toISOString()
      .split("T")[0]
      .split("-")
      .map(Number);
    const endDateParts = todayEnd
      .toISOString()
      .split("T")[0]
      .split("-")
      .map(Number);

    const startDate = new Date(
      Date.UTC(startDateParts[0], startDateParts[1] - 1, startDateParts[2])
    );
    const endDate = new Date(
      Date.UTC(endDateParts[0], endDateParts[1] - 1, endDateParts[2])
    );

    // Fill all dates in the range with 0 values for missing dates
    const filledData = [];

    // Loop through each day in the range using UTC dates
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setUTCDate(d.getUTCDate() + 1)
    ) {
      // Create date string in YYYY-MM-DD format
      const dateStr = `${d.getUTCFullYear()}-${String(
        d.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
      const existingData = chartData.find((item) => item.date === dateStr);

      if (existingData) {
        filledData.push(existingData);
      } else {
        // Check if this date is today
        const isToday =
          d.getUTCFullYear() === now.getUTCFullYear() &&
          d.getUTCMonth() === now.getUTCMonth() &&
          d.getUTCDate() === now.getUTCDate();

        filledData.push({
          date: dateStr,
          value: 0,
          formattedDate: `${String(d.getUTCDate()).padStart(2, "0")}/${String(
            d.getUTCMonth() + 1
          ).padStart(2, "0")}`,
          isToday,
        });
      }
    }

    // Set the processed data
    setSalesReport(filledData);

    // Debug log to verify dates
    console.log(
      "Date range:",
      filterDate.toISOString(),
      "to",
      todayEnd.toISOString()
    );
    console.log("Last few dates in chart:", filledData.slice(-3));
  };

  useEffect(() => {
    processData();
  }, [data, timeFilter, dataType, productFilter]);

  const formatTooltipValue = (value) => {
    switch (dataType) {
      case "revenue":
        return `R$ ${value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`;
      case "units":
        return `${value} unidades`;
      case "orders":
        return `${value} pedidos`;
      default:
        return value;
    }
  };

  const getYAxisLabel = () => {
    switch (dataType) {
      case "revenue":
        return "Receita (R$)";
      case "units":
        return "Unidades";
      case "orders":
        return "Pedidos";
      default:
        return "";
    }
  };

  // Calculate the appropriate interval for X-axis labels based on the number of data points
  const calculateXAxisInterval = () => {
    if (salesReport.length <= 15) return 0; // Show all labels for 15 or fewer points
    if (salesReport.length <= 30) return 1; // Show every other label for 16-30 points
    if (salesReport.length <= 60) return 2; // Show every third label for 31-60 points
    return 3; // Show every fourth label for more than 60 points
  };

  // Custom tick for X-axis to highlight today
  const CustomXAxisTick = (props) => {
    const { x, y, payload } = props;
    const isToday = salesReport[payload.index]?.isToday;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill={isToday ? "#ff4d4f" : "#666"}
          fontWeight={isToday ? "bold" : "normal"}
          fontSize={12}
          transform="rotate(-45)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <Card className="col-span-1" data-testid="sales-analytics-card">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Análise de vendas</CardTitle>
            <CardDescription>
              Visualize os dados das vendas de acordo com os filtros
              selecionados.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={timeFilter}
              onValueChange={(value) => setTimeFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hoje</SelectItem>
                <SelectItem value="15days">Últimos 15 dias</SelectItem>
                <SelectItem value="30days">Últimos 30 dias</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={dataType}
              onValueChange={(value) => setDataType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de dado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Receita (R$)</SelectItem>
                <SelectItem value="units">Unidades vendidas</SelectItem>
                <SelectItem value="orders">Número de pedidos</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={productFilter}
              onValueChange={(value) => setProductFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os produtos</SelectItem>
                {uniqueProducts.map((product) => (
                  <SelectItem key={product} value={product}>
                    {product.length > 30
                      ? `${product.substring(0, 30)}...`
                      : product}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {salesReport.length > 0 ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesReport}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="formattedDate"
                  height={60}
                  tick={CustomXAxisTick}
                  interval={calculateXAxisInterval()}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{
                    value: getYAxisLabel(),
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value) => [
                    formatTooltipValue(value),
                    getYAxisLabel(),
                  ]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dot={(props) => {
                    const { cx, cy, payload, key } = props;
                    return payload.isToday ? (
                      <circle
                        key={key || `dot-${payload.date}`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill="#ff4d4f"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                      />
                    ) : (
                      <circle
                        key={key || `dot-${payload.date}`}
                        cx={cx}
                        cy={cy}
                        r={3}
                        fill="hsl(var(--chart-1))"
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">Nenhum dado disponível</p>
              <p className="text-sm">
                Não há vendas para o período e filtros selecionados
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
