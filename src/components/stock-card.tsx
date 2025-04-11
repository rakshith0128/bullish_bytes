
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StockData, PortfolioItem, getUserPortfolio, removeFromPortfolio } from "@/services/stock-service";
import { TrendingDown, TrendingUp, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

interface StockCardProps {
  stock: StockData;
  onClick?: (stock: StockData) => void;
  showAddButton?: boolean;
  onAddToPortfolio?: (stock: StockData) => void;
  onRemoveFromPortfolio?: (symbol: string) => void;
}

export function StockCard({ 
  stock, 
  onClick, 
  showAddButton = false,
  onAddToPortfolio,
  onRemoveFromPortfolio
}: StockCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isInPortfolio, setIsInPortfolio] = useState(false);

  useEffect(() => {
    // Check if the stock is already in the portfolio
    const checkPortfolio = async () => {
      if (!user) return;
      
      try {
        const portfolio = await getUserPortfolio(user.id);
        setIsInPortfolio(portfolio.some((item: PortfolioItem) => item.symbol === stock.symbol));
      } catch (error) {
        console.error("Error checking portfolio:", error);
      }
    };

    checkPortfolio();
  }, [stock.symbol, user]);

  const handleClick = () => {
    if (onClick) onClick(stock);
  };

  const handleAddToPortfolio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToPortfolio) {
      onAddToPortfolio(stock);
      setIsInPortfolio(true);
      toast({
        title: "Added to Portfolio",
        description: `${stock.name} has been added to your portfolio`,
      });
    }
  };

  const handleRemoveFromPortfolio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemoveFromPortfolio) {
      onRemoveFromPortfolio(stock.symbol);
      setIsInPortfolio(false);
      toast({
        title: "Removed from Portfolio",
        description: `${stock.name} has been removed from your portfolio`,
      });
    }
  };

  return (
    <Card 
      className={cn(
        "card-hover cursor-pointer", 
        isHovered && "border-primary/50"
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg line-clamp-2">{stock.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{stock.symbol}</p>
          </div>
          <Badge>{stock.sector}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-2xl font-bold">₹{stock.price.toLocaleString()}</div>
            <div className={cn(
              "flex items-center",
              stock.change > 0 ? "stock-up" : stock.change < 0 ? "stock-down" : "stock-neutral"
            )}>
              {stock.change > 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="font-medium">
                {stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          {showAddButton && (
            isInPortfolio ? (
              <Button 
                size="sm" 
                onClick={handleRemoveFromPortfolio}
                variant="outline"
                className="ml-2 text-destructive border-destructive hover:bg-destructive/10"
              >
                <Trash className="h-4 w-4 mr-1" />
                Remove
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={handleAddToPortfolio}
                variant="outline"
                className="ml-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
