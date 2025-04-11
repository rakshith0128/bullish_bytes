
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="h-[400px] w-full">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-full w-full rounded-md" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={`colorClose-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gradientColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (period === "1d") return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    if (period === "1w") return date.toLocaleDateString([], {weekday: 'short'});
                    if (period === "1m") return date.toLocaleDateString([], {day: 'numeric'});
                    return date.toLocaleDateString([], {month: 'short', day: 'numeric'});
                  }}
                  style={{ fontSize: '0.75rem' }}
                  tickMargin={10}
                  minTickGap={15}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  style={{ fontSize: '0.75rem' }}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  tickCount={5}
                  width={80}
                />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Price"]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    if (period === "1d") {
                      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    }
                    return date.toLocaleDateString();
                  }}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  wrapperStyle={{ zIndex: 100 }}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={gradientColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#colorClose-${symbol})`}
                  activeDot={{ r: 6, strokeWidth: 0, fill: gradientColor }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
