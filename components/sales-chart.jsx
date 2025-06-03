"use client";
import { useEffect } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipLabel,
  ChartTooltipValue,
} from "./ui/chart";

const data = [
  {
    name: "Jan",
    tshirts: 120,
    hoodies: 85,
    accessories: 45,
  },
  {
    name: "Feb",
    tshirts: 145,
    hoodies: 90,
    accessories: 55,
  },
  {
    name: "Mar",
    tshirts: 162,
    hoodies: 105,
    accessories: 60,
  },
  {
    name: "Apr",
    tshirts: 190,
    hoodies: 120,
    accessories: 70,
  },
  {
    name: "May",
    tshirts: 210,
    hoodies: 135,
    accessories: 80,
  },
  {
    name: "Jun",
    tshirts: 245,
    hoodies: 150,
    accessories: 95,
  },
  {
    name: "Jul",
    tshirts: 280,
    hoodies: 170,
    accessories: 110,
  },
  {
    name: "Aug",
    tshirts: 295,
    hoodies: 185,
    accessories: 125,
  },
  {
    name: "Sep",
    tshirts: 270,
    hoodies: 160,
    accessories: 115,
  },
  {
    name: "Oct",
    tshirts: 285,
    hoodies: 175,
    accessories: 120,
  },
  {
    name: "Nov",
    tshirts: 320,
    hoodies: 195,
    accessories: 140,
  },
  {
    name: "Dec",
    tshirts: 375,
    hoodies: 230,
    accessories: 165,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <ChartTooltip>
        <ChartTooltipContent>
          <ChartTooltipLabel>{label}</ChartTooltipLabel>
          {payload.map((entry, index) => (
            <ChartTooltipValue
              key={`value-${index}`}
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value} units
            </ChartTooltipValue>
          ))}
          <ChartTooltipValue>
            Total: {payload.reduce((sum, entry) => sum + entry.value, 0)} units
          </ChartTooltipValue>
        </ChartTooltipContent>
      </ChartTooltip>
    );
  }

  return null;
};

export function SalesChart() {
  useEffect(() => {
    fetch("http://localhost:3001/api/sales-monthly?year=2025&month=5")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }, []);
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={true}
          vertical={false}
        />
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
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ paddingTop: "10px" }}
        />
        <Line
          type="monotone"
          dataKey="tshirts"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          name="T-shirts"
          dot={{ strokeWidth: 2, r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="hoodies"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          name="Hoodies"
          dot={{ strokeWidth: 2, r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="accessories"
          stroke="hsl(var(--chart-4))"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          name="Accessories"
          dot={{ strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
