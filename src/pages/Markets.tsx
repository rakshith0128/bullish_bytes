import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  StockData, 
  getStockList, 
  searchStocks, 
  addToPortfolio, 
  removeFromPortfolio 
} from "@/services/stock-service";
import { StockCard } from "@/components/stock-card";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";

const Markets = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const stockList = await getStockList();
        setStocks(stockList);
        setFilteredStocks(stockList);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        toast({
          title: "Error",
          description: "Failed to load stock data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const searchStocksAsync = async () => {
        const results = await searchStocks(searchQuery);
        setFilteredStocks(results);
      };
      searchStocksAsync();
    } else {
      filterStocksByTab(activeTab, stocks);
    }
  }, [searchQuery, activeTab, stocks]);

  const filterStocksByTab = (tab: string, stocksToFilter: StockData[]) => {
    if (tab === "all") {
      setFilteredStocks(stocksToFilter);
    } else if (tab === "gainers") {
      setFilteredStocks(
        stocksToFilter
          .filter((stock) => stock.change > 0)
          .sort((a, b) => b.changePercent - a.changePercent)
      );
    } else if (tab === "losers") {
      setFilteredStocks(
        stocksToFilter
          .filter((stock) => stock.change < 0)
          .sort((a, b) => a.changePercent - b.changePercent)
      );
    } else if (tab === "tech") {
      setFilteredStocks(
        stocksToFilter.filter((stock) => stock.sector === "Information Technology")
      );
    } else if (tab === "finance") {
      setFilteredStocks(
        stocksToFilter.filter((stock) => stock.sector === "Financial Services")
      );
    } else if (tab === "consumer") {
      setFilteredStocks(
        stocksToFilter.filter(
          (stock) => stock.sector === "Consumer Goods"
        )
      );
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (searchQuery.trim() === "") {
      filterStocksByTab(value, stocks);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    filterStocksByTab(activeTab, stocks);
  };

  const handleStockCardClick = (stock: StockData) => {
    navigate(`/stock/${encodeURIComponent(stock.symbol)}`);
  };

  const handleAddToPortfolio = async (stock: StockData) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add stocks to your portfolio",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const success = await addToPortfolio({
        symbol: stock.symbol,
        quantity: 1, // Default quantity
        buyPrice: stock.price,
        addedAt: new Date().toISOString(),
      });

      if (success) {
        toast({
          title: "Success",
          description: `${stock.name} has been added to your portfolio.`,
        });
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

  const handleRemoveFromPortfolio = async (symbol: string) => {
    try {
      const success = await removeFromPortfolio(symbol);
      if (success) {
        toast({
          title: "Success",
          description: "Stock removed from portfolio",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to remove stock from portfolio",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing from portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to remove stock from portfolio",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Markets</h1>
            <p className="text-muted-foreground">
              Explore stocks from Indian exchanges
            </p>
          </div>
          
          <div className="w-full md:w-auto relative">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or symbol..."
                className="pl-8 pr-8 w-full md:w-80"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Stocks</TabsTrigger>
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
            <TabsTrigger value="tech">Tech</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="consumer">Consumer</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <Skeleton key={index} className="h-48" />
                ))}
              </div>
            ) : filteredStocks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStocks.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    onClick={handleStockCardClick}
                    showAddButton
                    onAddToPortfolio={handleAddToPortfolio}
                    onRemoveFromPortfolio={handleRemoveFromPortfolio}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "No stocks found matching your search."
                      : "No stocks found in this category."}
                  </p>
                  {searchQuery && (
                    <Button onClick={clearSearch}>Clear Search</Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Markets;
