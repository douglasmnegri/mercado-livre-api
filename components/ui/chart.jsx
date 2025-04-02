"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import * as RechartsAll from "recharts";
import { cn } from "@/lib/utils";

const {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ...Recharts
} = RechartsAll;

// Re-export all Recharts components
export {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
};

// Export the rest of Recharts components as is
export const RechartsComponents = Recharts;

// Custom chart tooltip component
const chartTooltipVariants = cva(
  "rounded-lg border bg-background p-2 shadow-md",
  {
    variants: {
      size: {
        default: "px-3 py-1.5",
        sm: "px-2 py-1",
        lg: "px-4 py-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export const ChartTooltip = React.forwardRef(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(chartTooltipVariants({ size }), className)}
      {...props}
    />
  )
);

ChartTooltip.displayName = "ChartTooltip";

// Custom chart tooltip content component
export const ChartTooltipContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  )
);

ChartTooltipContent.displayName = "ChartTooltipContent";

// Custom chart tooltip label component
export const ChartTooltipLabel = React.forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
);

ChartTooltipLabel.displayName = "ChartTooltipLabel";

// Custom chart tooltip value component
export const ChartTooltipValue = React.forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
);

ChartTooltipValue.displayName = "ChartTooltipValue";

// Custom chart tooltip item component
export const ChartTooltipItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between gap-2", className)}
      {...props}
    />
  )
);

ChartTooltipItem.displayName = "ChartTooltipItem";

// Custom chart tooltip indicator component
export const ChartTooltipIndicator = React.forwardRef(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("h-1 w-1 rounded-full", className)}
      {...props}
    />
  )
);

ChartTooltipIndicator.displayName = "ChartTooltipIndicator";

// Custom chart tooltip series component
export const ChartTooltipSeries = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  )
);

ChartTooltipSeries.displayName = "ChartTooltipSeries";

// Custom chart tooltip series item component
export const ChartTooltipSeriesItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
);

ChartTooltipSeriesItem.displayName = "ChartTooltipSeriesItem";
