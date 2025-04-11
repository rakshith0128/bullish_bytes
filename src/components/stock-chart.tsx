
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoricalData, getStockHistory } from "@/services/stock-service";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface StockChartProps {
  symbol: string;
  name: string;
  isPositive?: boolean;
}

const TIME_PERIODS = [
  { value: "1d", label: "1D" },
  { value: "1w", label: "1W" },
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "1y", label: "1Y" },
] as const;

type TimePeriod = (typeof TIME_PERIODS)[number]["value"];

export function StockChart({ symbol, name, isPositive = true }: StockChartProps) {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [period, setPeriod] = useState<TimePeriod>("1m");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const historicalData = await getStockHistory(symbol, period);
        setData(historicalData);
      } catch (error) {
        console.error("Error fetching stock history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, period]);

  const handlePeriodChange = (value: string) => {
    setPeriod(value as TimePeriod);
  };

  // Calculate gradient based on stock trend
  const gradientColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{name} Chart</CardTitle>
          <ToggleGroup 
            type="single" 
            value={period}
            onValueChange={(value) => {
              if (value) handlePeriodChange(value);
            }}
          >
            {TIME_PERIODS.map((p) => (
              <ToggleGroupItem key={p.value} value={p.value} size="sm">
                {p.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gradientColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (period === "1d") return date.toLocaleTimeString().slice(0, 5);
                    if (period === "1w" || period === "1m") return date.toLocaleDateString().slice(0, 5);
                    return new Date(value).toLocaleDateString();
                  }}
                  style={{ fontSize: '0.75rem' }}
                  tickMargin={10}
                />
                <YAxis 
                  domain={['dataMin - 1%', 'dataMax + 1%']} 
                  style={{ fontSize: '0.75rem' }}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Price"]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={gradientColor}
                  fillOpacity={1}
                  fill="url(#colorClose)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
