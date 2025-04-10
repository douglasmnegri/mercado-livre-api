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
  Vermelho: "#FF0000", // vermelho vibrante
  "Verde Militar": "#4B5320",
  Marrom: "#8B4513",
  Laranja: "#FFA500",
  "Azul Bebê": "#00BFFF",
  "Cinza Mescla": "#808080",
  "Rosa Bebê": "#FF69B4",
  "Amarelo Canário": "#FFFF00",
  "Azul marinho": "#000080",
  "Azul-turquesa": "#40E0D0",
  Salmão: "#FA8072",
  "Cinza Chumbo": "#5A5A5A",
  Lilás: "#C8A2C8",
  Preto: "#000000",
  "Amarelo Ouro": "#FFD700",
  "Verde Bandeira": "#009E60",
  "Azul Royal": "#4169E1",
  "Rosa Pink": "#FF1493",
  Branco: "#f0ece8",
  "Verde-limão": "#ADFF2F",
  Roxo: "#800080",
};

export function StockChart({ cottonStock }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={cottonStock}
        margin={{ top: 50, right: 0, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="color"
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
          ticks={[0, 50, 100, 150, 200]} // Adicione esta linha
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="stock"
          radius={[4, 4, 0, 0]}
          name="Current Stock"
          barSize={50}
        >
          {cottonStock.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colorMap[entry.color] || "#8884d8"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
