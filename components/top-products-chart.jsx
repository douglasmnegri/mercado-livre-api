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
    name: "Vintage Black Tee",
    revenue: 4200,
    units: 210,
  },
  {
    name: "Classic White Tee",
    revenue: 3800,
    units: 190,
  },
  {
    name: "Navy Blue Hoodie",
    revenue: 3100,
    units: 124,
  },
  {
    name: "Heather Gray Tee",
    revenue: 2700,
    units: 135,
  },
  {
    name: "Ruby Red Tee",
    revenue: 2200,
    units: 110,
  },
  {
    name: "Black Zip Hoodie",
    revenue: 2100,
    units: 84,
  },
  {
    name: "Teal Logo Cap",
    revenue: 1800,
    units: 120,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <ChartTooltip>
        <ChartTooltipContent>
          <ChartTooltipLabel>{label}</ChartTooltipLabel>
          <ChartTooltipValue>
            Revenue: ${payload[0].value.toLocaleString()}
          </ChartTooltipValue>
          <ChartTooltipValue>Units Sold: 40</ChartTooltipValue>
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
          tickFormatter={(value) => `$${value}`}
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
          dataKey="revenue"
          fill="hsl(var(--chart-3))"
          radius={[0, 4, 4, 0]}
          name="Revenue"
          barSize={20}
        />
        <Bar
          dataKey="units"
          fill="hsl(var(--chart-6))"
          radius={[0, 4, 4, 0]}
          name="Units Sold"
          barSize={20}
          hide={true} // Hidden from chart but available for tooltip
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
