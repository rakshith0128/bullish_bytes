
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  PortfolioItem, 
  StockData, 
  getUserPortfolio, 
  getStockBySymbol, 
  removeFromPortfolio 
} from "@/services/stock-service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

interface PortfolioTableItem extends PortfolioItem {
  currentPrice: number;
  name: string;
  change: number;
  changePercent: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
}

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioTableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const portfolioItems = await getUserPortfolio(user.id);
        
        // Fetch current stock data for each portfolio item
        const portfolioWithStockData = await Promise.all(
          portfolioItems.map(async (item) => {
            const stockData = await getStockBySymbol(item.symbol);
            if (!stockData) return null;
            
            const currentValue = stockData.price * item.quantity;
            const investedValue = item.buyPrice * item.quantity;
            const profit = currentValue - investedValue;
            const profitPercent = (profit / investedValue) * 100;
            
            return {
              ...item,
              currentPrice: stockData.price,
              name: stockData.name,
              change: stockData.change,
              changePercent: stockData.changePercent,
              currentValue,
              profit,
              profitPercent,
            };
          })
        );
        
        setPortfolio(portfolioWithStockData.filter(Boolean) as PortfolioTableItem[]);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        toast({
          title: "Error",
          description: "Failed to load portfolio data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolio();
  }, [user, navigate, toast]);
  
  const handleRemoveItem = async (symbol: string) => {
    try {
      const success = await removeFromPortfolio(symbol);
      if (success) {
        setPortfolio(portfolio.filter(item => item.symbol !== symbol));
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
      console.error("Error removing portfolio item:", error);
      toast({
        title: "Error",
        description: "Failed to remove stock from portfolio",
        variant: "destructive",
      });
    }
  };

  const getTotalValue = () => {
    return portfolio.reduce((total, item) => total + item.currentValue, 0);
  };

  const getTotalInvested = () => {
    return portfolio.reduce((total, item) => total + (item.buyPrice * item.quantity), 0);
  };

  const getTotalProfit = () => {
    return getTotalValue() - getTotalInvested();
  };

  const getProfitPercentage = () => {
    const invested = getTotalInvested();
    return invested > 0 ? (getTotalProfit() / invested) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Portfolio</h1>
            <p className="text-muted-foreground">
              Track and manage your investments
            </p>
          </div>
          
          <Button onClick={() => navigate("/markets")}>
            Add New Stock
          </Button>
        </div>
        
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Portfolio Value</CardTitle>
                  <CardDescription>Current market value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{getTotalValue().toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {portfolio.length} stocks in portfolio
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Invested</CardTitle>
                  <CardDescription>Purchase value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{getTotalInvested().toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Profit/Loss</CardTitle>
                  <CardDescription>Unrealized gains</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    getTotalProfit() >= 0 ? "text-success" : "text-destructive"
                  }`}>
                    {getTotalProfit() >= 0 ? "+" : ""}
                    ₹{getTotalProfit().toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                  <div className={`flex items-center ${
                    getTotalProfit() >= 0 ? "text-success" : "text-destructive"
                  }`}>
                    {getTotalProfit() >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span>{getProfitPercentage().toFixed(2)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Your portfolio is empty</p>
                    <Button onClick={() => navigate("/markets")}>
                      Add Stocks to Portfolio
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Stock</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Avg. Price</TableHead>
                          <TableHead>Current Price</TableHead>
                          <TableHead>Current Value</TableHead>
                          <TableHead>P&L</TableHead>
                          <TableHead>P&L %</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {portfolio.map((item) => (
                          <TableRow key={item.symbol}>
                            <TableCell className="font-medium">
                              <div className="cursor-pointer" onClick={() => navigate(`/stock/${encodeURIComponent(item.symbol)}`)}>
                                <div>{item.name}</div>
                                <div className="text-muted-foreground text-sm">{item.symbol}</div>
                              </div>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>₹{item.buyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                            <TableCell>
                              <div>₹{item.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                              <div className={`flex items-center text-sm ${
                                item.change >= 0 ? "text-success" : "text-destructive"
                              }`}>
                                {item.change >= 0 ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                <span>{item.changePercent.toFixed(2)}%</span>
                              </div>
                            </TableCell>
                            <TableCell>₹{item.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                            <TableCell className={item.profit >= 0 ? "text-success" : "text-destructive"}>
                              {item.profit >= 0 ? "+" : ""}
                              ₹{item.profit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className={item.profitPercent >= 0 ? "text-success" : "text-destructive"}>
                              {item.profitPercent >= 0 ? "+" : ""}
                              {item.profitPercent.toFixed(2)}%
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(item.symbol)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Portfolio;
