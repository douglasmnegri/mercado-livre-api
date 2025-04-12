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

// Updated data with only units, sorted by units sold (descending)
const data = [
  {
    name: "Vintage Black Tee",
    units: 210,
  },
  {
    name: "Classic White Tee",
    units: 190,
  },
  {
    name: "Heather Gray Tee",
    units: 135,
  },
  {
    name: "Navy Blue Hoodie",
    units: 124,
  },
  {
    name: "Teal Logo Cap",
    units: 120,
  },
  {
    name: "Ruby Red Tee",
    units: 110,
  },
  {
    name: "Black Zip Hoodie",
    units: 84,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <ChartTooltip>
        <ChartTooltipContent>
          <ChartTooltipLabel>{label}</ChartTooltipLabel>
          <ChartTooltipValue>
            Units Sold: {payload[0].value.toLocaleString()}
          </ChartTooltipValue>
        </ChartTooltipContent>
      </ChartTooltip>
    );
  }

  return null;
};

export function TopProductsChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={true}
          vertical={false}
        />
        <XAxis
          type="number"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--foreground)" }}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={120}
          tick={{ fill: "var(--foreground)" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="units"
          fill="hsl(var(--chart-6))"
          radius={[0, 4, 4, 0]}
          name="Units Sold"
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
