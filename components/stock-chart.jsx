"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipLabel,
  ChartTooltipValue,
} from "./ui/chart";

const data = [
  {
    name: "Classic White",
    stock: 120,
    restock: 150,
  },
  {
    name: "Vintage Black",
    stock: 85,
    restock: 100,
  },
  {
    name: "Navy Blue",
    stock: 65,
    restock: 80,
  },
  {
    name: "Heather Gray",
    stock: 95,
    restock: 110,
  },
  {
    name: "Forest Green",
    stock: 40,
    restock: 60,
  },
  {
    name: "Ruby Red",
    stock: 55,
    restock: 70,
  },
  {
    name: "Sunset Orange",
    stock: 30,
    restock: 50,
  },
  {
    name: "Royal Purple",
    stock: 45,
    restock: 65,
  },
  {
    name: "Teal Blue",
    stock: 60,
    restock: 75,
  },
  {
    name: "Charcoal",
    stock: 70,
    restock: 90,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <ChartTooltip>
        <ChartTooltipContent>
          <ChartTooltipLabel>{label}</ChartTooltipLabel>
          <ChartTooltipValue>
            Current Stock: {payload[0].value}
          </ChartTooltipValue>
          <ChartTooltipValue>
            Restock Level: {payload[1].value}
          </ChartTooltipValue>
        </ChartTooltipContent>
      </ChartTooltip>
    );
  }

  return null;
};

export function StockChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--foreground)" }}
          tickMargin={8}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          tick={{ fill: "var(--foreground)" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="stock"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
          name="Current Stock"
          barSize={30}
        />
        <Bar
          dataKey="restock"
          fill="hsl(var(--chart-5))"
          radius={[4, 4, 0, 0]}
          name="Restock Level"
          barSize={30}
          opacity={0.3}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
