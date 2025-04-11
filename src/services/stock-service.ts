
// Mock data for Indian stocks
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  marketCap: number;
  sector: string;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Sample stock list for Indian market
const indianStocks: StockData[] = [
  {
    symbol: "RELIANCE.NS",
    name: "Reliance Industries Ltd",
    price: 2456.35,
    change: 25.65,
    changePercent: 1.05,
    high: 2475.40,
    low: 2430.10,
    open: 2445.20,
    previousClose: 2430.70,
    volume: 5823000,
    marketCap: 1665433000000,
    sector: "Energy",
  },
  {
    symbol: "TCS.NS",
    name: "Tata Consultancy Services Ltd",
    price: 3587.45,
    change: -32.55,
    changePercent: -0.9,
    high: 3620.30,
    low: 3575.10,
    open: 3618.20,
    previousClose: 3620.00,
    volume: 1235000,
    marketCap: 1312456000000,
    sector: "Information Technology",
  },
  {
    symbol: "INFY.NS",
    name: "Infosys Ltd",
    price: 1642.75,
    change: 15.80,
    changePercent: 0.97,
    high: 1648.20,
    low: 1620.50,
    open: 1625.30,
    previousClose: 1626.95,
    volume: 3245000,
    marketCap: 682345000000,
    sector: "Information Technology",
  },
  {
    symbol: "HDFCBANK.NS",
    name: "HDFC Bank Ltd",
    price: 1543.20,
    change: -5.35,
    changePercent: -0.35,
    high: 1550.40,
    low: 1537.60,
    open: 1548.70,
    previousClose: 1548.55,
    volume: 4532000,
    marketCap: 862134000000,
    sector: "Financial Services",
  },
  {
    symbol: "ICICIBANK.NS",
    name: "ICICI Bank Ltd",
    price: 942.65,
    change: 8.45,
    changePercent: 0.9,
    high: 945.30,
    low: 935.10,
    open: 937.20,
    previousClose: 934.20,
    volume: 5673000,
    marketCap: 657890000000,
    sector: "Financial Services",
  },
  {
    symbol: "HINDUNILVR.NS",
    name: "Hindustan Unilever Ltd",
    price: 2378.55,
    change: -15.20,
    changePercent: -0.64,
    high: 2395.10,
    low: 2375.30,
    open: 2392.40,
    previousClose: 2393.75,
    volume: 1982000,
    marketCap: 559876000000,
    sector: "Consumer Goods",
  },
  {
    symbol: "BAJFINANCE.NS",
    name: "Bajaj Finance Ltd",
    price: 6745.30,
    change: 125.45,
    changePercent: 1.9,
    high: 6780.20,
    low: 6650.10,
    open: 6653.70,
    previousClose: 6619.85,
    volume: 879000,
    marketCap: 408765000000,
    sector: "Financial Services",
  },
  {
    symbol: "BHARTIARTL.NS",
    name: "Bharti Airtel Ltd",
    price: 937.45,
    change: 12.35,
    changePercent: 1.33,
    high: 940.10,
    low: 928.50,
    open: 929.70,
    previousClose: 925.10,
    volume: 3421000,
    marketCap: 525678000000,
    sector: "Telecommunications",
  },
  {
    symbol: "WIPRO.NS",
    name: "Wipro Ltd",
    price: 452.65,
    change: -3.15,
    changePercent: -0.69,
    high: 458.20,
    low: 451.30,
    open: 456.40,
    previousClose: 455.80,
    volume: 2345000,
    marketCap: 247856000000,
    sector: "Information Technology",
  },
  {
    symbol: "TATAMOTORS.NS",
    name: "Tata Motors Ltd",
    price: 623.45,
    change: 18.30,
    changePercent: 3.02,
    high: 625.70,
    low: 610.20,
    open: 612.40,
    previousClose: 605.15,
    volume: 7865000,
    marketCap: 207654000000,
    sector: "Automobile",
  },
  {
    symbol: "ITC.NS",
    name: "ITC Ltd",
    price: 431.75,
    change: 5.25,
    changePercent: 1.23,
    high: 433.40,
    low: 428.10,
    open: 428.30,
    previousClose: 426.50,
    volume: 8752000,
    marketCap: 531987000000,
    sector: "Consumer Goods",
  },
  {
    symbol: "ASIANPAINT.NS",
    name: "Asian Paints Ltd",
    price: 3145.20,
    change: -42.35,
    changePercent: -1.33,
    high: 3190.40,
    low: 3140.10,
    open: 3185.70,
    previousClose: 3187.55,
    volume: 765000,
    marketCap: 302154000000,
    sector: "Consumer Goods",
  },
  {
    symbol: "AXISBANK.NS",
    name: "Axis Bank Ltd",
    price: 983.45,
    change: 14.25,
    changePercent: 1.47,
    high: 985.30,
    low: 972.10,
    open: 975.40,
    previousClose: 969.20,
    volume: 4328000,
    marketCap: 302456000000,
    sector: "Financial Services",
  },
  {
    symbol: "KOTAKBANK.NS",
    name: "Kotak Mahindra Bank Ltd",
    price: 1745.30,
    change: -8.75,
    changePercent: -0.5,
    high: 1755.40,
    low: 1740.20,
    open: 1752.70,
    previousClose: 1754.05,
    volume: 1243000,
    marketCap: 347123000000,
    sector: "Financial Services",
  },
  {
    symbol: "MARUTI.NS",
    name: "Maruti Suzuki India Ltd",
    price: 10342.65,
    change: 157.80,
    changePercent: 1.55,
    high: 10380.20,
    low: 10220.50,
    open: 10230.30,
    previousClose: 10184.85,
    volume: 456000,
    marketCap: 312456000000,
    sector: "Automobile",
  },
];

// Generate mock historical data
const generateHistoricalData = (
  basePrice: number,
  days: number
): HistoricalData[] => {
  const data: HistoricalData[] = [];
  let currentPrice = basePrice;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Random price fluctuation
    const change = (Math.random() - 0.5) * basePrice * 0.03;
    currentPrice += change;
    currentPrice = Math.max(currentPrice, basePrice * 0.7); // Prevent too low values

    const open = currentPrice - (Math.random() * 10);
    const close = currentPrice;
    const high = Math.max(open, close) + (Math.random() * 15);
    const low = Math.min(open, close) - (Math.random() * 15);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000),
    });
  }

  return data;
};

// API functions
export const getStockList = (): Promise<StockData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(indianStocks);
    }, 500);
  });
};

export const getStockBySymbol = (symbol: string): Promise<StockData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stock = indianStocks.find((s) => s.symbol === symbol) || null;
      resolve(stock);
    }, 300);
  });
};

export const getStockHistory = (
  symbol: string,
  period: '1d' | '1w' | '1m' | '3m' | '1y' = '1m'
): Promise<HistoricalData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stock = indianStocks.find((s) => s.symbol === symbol);
      if (!stock) {
        resolve([]);
        return;
      }

      let days = 30; // Default to 1 month
      
      switch (period) {
        case '1d':
          days = 1;
          break;
        case '1w':
          days = 7;
          break;
        case '3m':
          days = 90;
          break;
        case '1y':
          days = 365;
          break;
      }

      resolve(generateHistoricalData(stock.price, days));
    }, 700);
  });
};

export const searchStocks = (query: string): Promise<StockData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) {
        resolve([]);
        return;
      }
      
      const lowercaseQuery = query.toLowerCase();
      const results = indianStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(lowercaseQuery) ||
          stock.name.toLowerCase().includes(lowercaseQuery)
      );
      
      resolve(results);
    }, 300);
  });
};

// Mock portfolio management
const PORTFOLIO_STORAGE_KEY = 'finsight-portfolio';

export interface PortfolioItem {
  symbol: string;
  quantity: number;
  buyPrice: number;
  addedAt: string;
}

export const getUserPortfolio = (userId: string): Promise<PortfolioItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedPortfolio = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      const portfolio = storedPortfolio ? JSON.parse(storedPortfolio) : [];
      resolve(portfolio);
    }, 300);
  });
};

export const addToPortfolio = (item: PortfolioItem): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const storedPortfolio = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
        const portfolio = storedPortfolio ? JSON.parse(storedPortfolio) : [];
        
        // Check if stock already exists, if so update quantity
        const existingItemIndex = portfolio.findIndex(
          (p: PortfolioItem) => p.symbol === item.symbol
        );
        
        if (existingItemIndex >= 0) {
          portfolio[existingItemIndex].quantity += item.quantity;
          // Calculate new average buy price
          const oldItem = portfolio[existingItemIndex];
          const oldValue = oldItem.buyPrice * (oldItem.quantity - item.quantity);
          const newValue = item.buyPrice * item.quantity;
          const totalQuantity = oldItem.quantity;
          portfolio[existingItemIndex].buyPrice = (oldValue + newValue) / totalQuantity;
        } else {
          portfolio.push(item);
        }
        
        localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
        resolve(true);
      } catch (error) {
        console.error('Error adding to portfolio:', error);
        resolve(false);
      }
    }, 300);
  });
};

export const removeFromPortfolio = (symbol: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const storedPortfolio = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
        
        if (!storedPortfolio) {
          resolve(false);
          return;
        }
        
        let portfolio = JSON.parse(storedPortfolio);
        portfolio = portfolio.filter((p: PortfolioItem) => p.symbol !== symbol);
        
        localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
        resolve(true);
      } catch (error) {
        console.error('Error removing from portfolio:', error);
        resolve(false);
      }
    }, 300);
  });
};
