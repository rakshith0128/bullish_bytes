
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StockData } from "@/services/stock-service";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface StockCardProps {
  stock: StockData;
  onClick?: (stock: StockData) => void;
  showAddButton?: boolean;
  onAddToPortfolio?: (stock: StockData) => void;
}

export function StockCard({ 
  stock, 
  onClick, 
  showAddButton = false,
  onAddToPortfolio
}: StockCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) onClick(stock);
  };

  const handleAddToPortfolio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToPortfolio) {
      onAddToPortfolio(stock);
      toast({
        title: "Added to Portfolio",
        description: `${stock.name} has been added to your portfolio`,
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
            <Button 
              size="sm" 
              onClick={handleAddToPortfolio}
              variant="outline"
              className="ml-2"
            >
              Add
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
