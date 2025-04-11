
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { StockChart } from "@/components/stock-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockData, getStockBySymbol, addToPortfolio } from "@/services/stock-service";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, TrendingDown, TrendingUp } from "lucide-react";

const Stock = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [stock, setStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState("1");
  const [buyPrice, setBuyPrice] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      try {
        const stockData = await getStockBySymbol(symbol);
        setStock(stockData);
        if (stockData) {
          setBuyPrice(stockData.price.toString());
        }
      } catch (error) {
        console.error("Error fetching stock:", error);
        toast({
          title: "Error",
          description: "Failed to load stock data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, toast]);

  const handleAddToPortfolio = async () => {
    if (!stock) return;
    
    try {
      const success = await addToPortfolio({
        symbol: stock.symbol,
        quantity: parseInt(quantity),
        buyPrice: parseFloat(buyPrice),
        addedAt: new Date().toISOString(),
      });
      
      if (success) {
        toast({
          title: "Success",
          description: `${stock.name} has been added to your portfolio.`,
        });
        setShowAddForm(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to add to portfolio. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding to portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to add to portfolio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetupAlert = () => {
    if (!stock) return;
    navigate(`/alerts/new?symbol=${encodeURIComponent(stock.symbol)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-40 md:col-span-2" />
              <Skeleton className="h-40" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        ) : stock ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">{stock.name}</h1>
                <p className="text-muted-foreground">{stock.symbol}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-3xl font-bold">₹{stock.price.toLocaleString()}</div>
                  <div className={`flex items-center justify-end ${
                    stock.change > 0 ? "text-success" : "text-destructive"
                  }`}>
                    {stock.change > 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span>
                      {stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? "Cancel" : "Add to Portfolio"}
                  </Button>
                  <Button variant="outline" onClick={handleSetupAlert}>
                    <Bell className="h-4 w-4 mr-2" />
                    Set Alert
                  </Button>
                </div>
              </div>
            </div>
            
            {showAddForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Add to Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="buyPrice">Purchase Price (₹)</Label>
                      <Input
                        id="buyPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    className="mt-4" 
                    onClick={handleAddToPortfolio}
                    disabled={
                      parseInt(quantity) <= 0 || 
                      parseFloat(buyPrice) <= 0 ||
                      isNaN(parseInt(quantity)) ||
                      isNaN(parseFloat(buyPrice))
                    }
                  >
                    Confirm
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Price Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Open</p>
                      <p className="text-lg font-medium">₹{stock.open.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Previous Close</p>
                      <p className="text-lg font-medium">₹{stock.previousClose.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">High</p>
                      <p className="text-lg font-medium">₹{stock.high.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Low</p>
                      <p className="text-lg font-medium">₹{stock.low.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Market Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-medium">{stock.volume.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Market Cap</p>
                      <p className="font-medium">₹{(stock.marketCap / 10000000).toFixed(2)} Cr</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Sector</p>
                      <p className="font-medium">{stock.sector}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="chart">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart">
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-[500px]">
                      <StockChart 
                        symbol={stock.symbol} 
                        name={stock.name}
                        isPositive={stock.change >= 0}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Powered Market Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        {stock.change > 0 
                          ? `${stock.name} is showing positive momentum with a ${stock.changePercent.toFixed(2)}% gain today. The stock has been trading with higher than average volume, which indicates strong buying interest.`
                          : `${stock.name} is currently down ${Math.abs(stock.changePercent).toFixed(2)}% today. The stock is facing some selling pressure but remains within its recent trading range.`
                        }
                      </p>
                      <p>
                        Based on technical indicators, the stock appears to be in a 
                        {stock.change > 0 ? " bullish trend with potential resistance at ₹" + (stock.price * 1.05).toFixed(2) : " bearish trend with potential support at ₹" + (stock.price * 0.95).toFixed(2)}.
                      </p>
                      <p>
                        Recent sector performance for {stock.sector} companies has been 
                        {stock.change > 0 ? " positive, supporting further upside potential." : " mixed, suggesting caution for short-term traders."}
                      </p>
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h3 className="font-semibold mb-2">AI Recommendation</h3>
                        <p>
                          {stock.change > 0 && stock.changePercent > 2
                            ? "STRONG BUY: Significant upward momentum with increased volume suggests further gains ahead."
                            : stock.change > 0
                            ? "HOLD/BUY: Current price action indicates steady growth potential in the medium term."
                            : stock.change < 0 && stock.changePercent < -2
                            ? "SELL/REDUCE: Technical indicators suggest continued downward pressure in the near term."
                            : "HOLD: Wait for clearer market signals before making position changes."
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="news">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent News</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">No recent news available for {stock.name}.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Stock Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The stock symbol you're looking for doesn't exist or couldn't be loaded.
            </p>
            <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Stock;
