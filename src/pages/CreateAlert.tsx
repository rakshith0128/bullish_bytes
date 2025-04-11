
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StockData, getStockBySymbol, getStockList, searchStocks } from "@/services/stock-service";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Search, X } from "lucide-react";

const CreateAlert = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Check if there's a symbol in the URL query
    const params = new URLSearchParams(location.search);
    const symbol = params.get("symbol");
    
    if (symbol) {
      const fetchStock = async () => {
        setInitialLoading(true);
        try {
          const stock = await getStockBySymbol(symbol);
          if (stock) {
            setSelectedStock(stock);
            setPrice(stock.price.toString());
          }
        } catch (error) {
          console.error("Error fetching stock:", error);
        } finally {
          setInitialLoading(false);
        }
      };
      
      fetchStock();
    } else {
      setInitialLoading(false);
    }
  }, [location.search]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchStocks(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching stocks:", error);
      toast({
        title: "Error",
        description: "Failed to search stocks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStock = (stock: StockData) => {
    setSelectedStock(stock);
    setSearchQuery("");
    setShowSearchResults(false);
    setPrice(stock.price.toString());
  };

  const handleCreateAlert = () => {
    if (!selectedStock || !price) {
      toast({
        title: "Error",
        description: "Please select a stock and enter a target price.",
        variant: "destructive",
      });
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid target price.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call to create the alert
    toast({
      title: "Alert Created",
      description: `You'll be notified when ${selectedStock.name} goes ${condition} ₹${priceValue.toLocaleString()}`,
    });
    
    navigate("/alerts");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Create Price Alert</h1>
            <p className="text-muted-foreground">
              Set up notifications for price movements
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate("/alerts")}>
            Back to Alerts
          </Button>
        </div>

        {initialLoading ? (
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>New Price Alert</CardTitle>
              <CardDescription>
                Get notified when a stock reaches your target price
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stock">Select Stock</Label>
                {selectedStock ? (
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <div>
                      <div className="font-medium">{selectedStock.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedStock.symbol} • Current Price: ₹{selectedStock.price.toLocaleString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedStock(null)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear selection</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="search"
                            placeholder="Search for a stock..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSearch();
                              }
                            }}
                          />
                        </div>
                        <Button type="button" onClick={handleSearch} disabled={loading}>
                          Search
                        </Button>
                      </div>

                      {/* Search Results */}
                      {showSearchResults && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-y-auto">
                          {searchResults.length > 0 ? (
                            searchResults.map((stock) => (
                              <div
                                key={stock.symbol}
                                className="p-2 hover:bg-accent cursor-pointer border-b last:border-0"
                                onClick={() => handleSelectStock(stock)}
                              >
                                <div className="font-medium">{stock.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {stock.symbol} • ₹{stock.price.toLocaleString()}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-center text-muted-foreground">
                              No results found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedStock && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Alert Condition</Label>
                    <RadioGroup
                      id="condition"
                      value={condition}
                      onValueChange={(value) => setCondition(value as "above" | "below")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="above" id="above" />
                        <Label htmlFor="above">Price rises above</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="below" id="below" />
                        <Label htmlFor="below">Price falls below</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Target Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Current price: ₹{selectedStock.price.toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/alerts")}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateAlert}
                disabled={!selectedStock || !price}
              >
                <Bell className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CreateAlert;
