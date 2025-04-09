"use client";
import { Cell } from "recharts";
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
  },
  {
    name: "Vintage Black",
    stock: 85,
  },
  {
    name: "Navy Blue",
    stock: 65,
  },
  {
    name: "Heather Gray",
    stock: 95,
  },
  {
    name: "Forest Green",
    stock: 40,
  },
  {
    name: "Ruby Red",
    stock: 55,
  },
  {
    name: "Sunset Orange",
    stock: 30,
  },
  {
    name: "Royal Purple",
    stock: 45,
  },
  {
    name: "Teal Blue",
    stock: 60,
  },
  {
    name: "Charcoal",
    stock: 70,
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
        </ChartTooltipContent>
      </ChartTooltip>
    );
  }

  return null;
};

const colorMap = {
  "Classic White": "#FFFFFF",
  "Vintage Black": "#000000",
  "Navy Blue": "#000080",
  "Heather Gray": "#A9A9A9",
  "Forest Green": "#228B22",
  "Ruby Red": "#9B111E",
  "Sunset Orange": "#FF4500",
  "Royal Purple": "#7851A9",
  "Teal Blue": "#008080",
  Charcoal: "#36454F",
};

export function StockChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
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
          radius={[4, 4, 0, 0]}
          name="Current Stock"
          barSize={50}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colorMap[entry.name] || "#8884d8"} // fallback caso não tenha no mapa
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
