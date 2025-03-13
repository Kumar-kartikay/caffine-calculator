/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HistoryVisualizationProps {
  history: any[];
  type: "bar" | "pie" | "line";
}

export function HistoryVisualization({
  history,
  type,
}: HistoryVisualizationProps) {
  // Colors for the charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FD0"];

  // Group data by tolerance levels for pie chart
  const toleranceData = useMemo(() => {
    const data: Record<string, number> = { Low: 0, Moderate: 0, High: 0 };

    history.forEach((entry) => {
      const tolerance = entry.inputs.tolerance;
      data[tolerance] = (data[tolerance] || 0) + 1;
    });

    return Object.keys(data)
      .map((name) => ({
        name,
        value: data[name],
      }))
      .filter((item) => item.value > 0);
  }, [history]);

  // Process data for bar chart - average caffeine by tolerance
  const barChartData = useMemo(() => {
    const data: Record<string, { count: number; total: number }> = {};

    history.forEach((entry) => {
      const tolerance = entry.inputs.tolerance;
      if (!data[tolerance]) {
        data[tolerance] = { count: 0, total: 0 };
      }
      data[tolerance].count += 1;
      data[tolerance].total += entry.result.totalMg;
    });

    return Object.keys(data).map((name) => ({
      name,
      avgCaffeine: Math.round(data[name].total / data[name].count),
    }));
  }, [history]);

  // Process data for line chart - caffeine over time
  const lineChartData = useMemo(() => {
    return [...history]
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      .map((entry) => ({
        name: new Date(entry.timestamp).toLocaleDateString(),
        caffeine: entry.result.totalMg,
      }));
  }, [history]);

  // Function to format large numbers
  const formatNumber = (value: number) => {
    return Math.round(value).toLocaleString();
  };

  // Render the appropriate chart based on type
  if (type === "pie") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Calculations by Tolerance Level
          </CardTitle>
          <CardDescription>
            Distribution of calculations based on caffeine tolerance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={toleranceData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {toleranceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `${value} calculations`,
                    "Count",
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  } else if (type === "bar") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Average Caffeine by Tolerance
          </CardTitle>
          <CardDescription>
            Shows how tolerance level affects caffeine recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip
                  formatter={(value) => [
                    `${formatNumber(value as number)} mg`,
                    "Average Caffeine",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="avgCaffeine"
                  name="Average Caffeine (mg)"
                  fill="#8884d8"
                >
                  {barChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  } else {
    // Line chart
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Caffeine Intake Over Time</CardTitle>
          <CardDescription>
            Track changes in your recommended caffeine levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip
                  formatter={(value) => [
                    `${formatNumber(value as number)} mg`,
                    "Caffeine",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="caffeine"
                  stroke="#8884d8"
                  name="Caffeine (mg)"
                  strokeWidth={2}
                  dot={{ fill: "#8884d8", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }
}
