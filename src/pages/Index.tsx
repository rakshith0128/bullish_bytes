
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockData, getStockList } from "@/services/stock-service";
import { Navbar } from "@/components/navbar";
import { StockCard } from "@/components/stock-card";
import { StockChart } from "@/components/stock-chart";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stockList = await getStockList();
        setStocks(stockList);
        setFilteredStocks(stockList);
        
        // Set the first stock as selected by default
        if (stockList.length > 0) {
          setSelectedStock(stockList[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        toast({
          title: "Error",
          description: "Failed to load stock data. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchStocks();
  }, [toast]);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredStocks(stocks);
    } else if (activeTab === "gainers") {
      setFilteredStocks(stocks.filter(stock => stock.change > 0).sort((a, b) => b.changePercent - a.changePercent));
    } else if (activeTab === "losers") {
      setFilteredStocks(stocks.filter(stock => stock.change < 0).sort((a, b) => a.changePercent - b.changePercent));
    } else if (activeTab === "volume") {
      setFilteredStocks([...stocks].sort((a, b) => b.volume - a.volume));
    }
  }, [activeTab, stocks]);

  const handleStockClick = (stock: StockData) => {
    setSelectedStock(stock);
  };

  const handleStockCardClick = (stock: StockData) => {
    navigate(`/stock/${encodeURIComponent(stock.symbol)}`);
  };

  const handleAddToPortfolio = (stock: StockData) => {
    navigate(`/portfolio/add?symbol=${encodeURIComponent(stock.symbol)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left column - Selected stock chart */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
                <CardDescription>
                  Real-time stock market data for Indian companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-80 w-full" />
                  </div>
                ) : selectedStock ? (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedStock.name}</h2>
                        <p className="text-muted-foreground">{selectedStock.symbol}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="text-2xl font-bold">₹{selectedStock.price.toLocaleString()}</div>
                          <div className={selectedStock.change > 0 ? "text-success" : "text-destructive"}>
                            {selectedStock.change > 0 ? "+" : ""}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <StockChart 
                      symbol={selectedStock.symbol} 
                      name={selectedStock.name}
                      isPositive={selectedStock.change >= 0}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Select a stock to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Stock list */}
          <div>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle>Stock Watch</CardTitle>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 mt-2">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="gainers">Gainers</TabsTrigger>
                    <TabsTrigger value="losers">Losers</TabsTrigger>
                    <TabsTrigger value="volume">Volume</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} className="h-32 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {filteredStocks.map((stock) => (
                      <div 
                        key={stock.symbol}
                        className="cursor-pointer"
                        onClick={() => handleStockClick(stock)}
                      >
                        <StockCard 
                          stock={stock} 
                          onClick={handleStockCardClick}
                          showAddButton
                          onAddToPortfolio={handleAddToPortfolio}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
