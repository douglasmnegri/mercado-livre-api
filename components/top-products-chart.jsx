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

export function TopProductsChart({ bestSellingProducts }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={bestSellingProducts}
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
          ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500]}
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
          fill="#043763"
          radius={[0, 4, 4, 0]}
          name="Units Sold"
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
