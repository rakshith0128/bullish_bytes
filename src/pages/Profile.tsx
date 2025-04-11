
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { Calendar, Mail, User } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }

  // Sample statistics
  const stats = {
    portfolioValue: 275000,
    totalTrades: 28,
    successRate: 64,
    averageReturn: 12.5,
  };

  // Sample activity history
  const activityHistory = [
    {
      id: "1",
      type: "purchase",
      symbol: "RELIANCE.NS",
      name: "Reliance Industries Ltd",
      quantity: 10,
      price: 2450.75,
      date: "2023-04-10T14:30:00Z",
    },
    {
      id: "2",
      type: "sale",
      symbol: "TCS.NS",
      name: "Tata Consultancy Services Ltd",
      quantity: 5,
      price: 3600.25,
      date: "2023-04-07T09:15:00Z",
    },
    {
      id: "3",
      type: "alert_created",
      symbol: "INFY.NS",
      name: "Infosys Ltd",
      target: 1700,
      condition: "above",
      date: "2023-04-05T11:20:00Z",
    },
    {
      id: "4",
      type: "purchase",
      symbol: "HDFCBANK.NS",
      name: "HDFC Bank Ltd",
      quantity: 8,
      price: 1545.50,
      date: "2023-04-01T10:45:00Z",
    },
    {
      id: "5",
      type: "alert_triggered",
      symbol: "MARUTI.NS",
      name: "Maruti Suzuki India Ltd",
      price: 10350.00,
      condition: "above",
      date: "2023-03-29T15:10:00Z",
    },
  ];

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            View your account information and trading history
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </div>
                <div className="flex items-center text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since {formatDate("2023-01-15T00:00:00Z")}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t">
                <Button className="w-full" onClick={() => navigate("/settings")}>
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Trading Statistics</CardTitle>
              <CardDescription>
                Your portfolio performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Portfolio Value
                  </p>
                  <p className="text-2xl font-bold">
                    ₹{stats.portfolioValue.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Trades</p>
                  <p className="text-2xl font-bold">{stats.totalTrades}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Avg. Return</p>
                  <p className="text-2xl font-bold">{stats.averageReturn}%</p>
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/portfolio")}
                >
                  View Portfolio
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/alerts")}
                >
                  Manage Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest trades and alert activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityHistory.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <Badge
                      variant={
                        activity.type === "purchase"
                          ? "default"
                          : activity.type === "sale"
                          ? "destructive"
                          : "outline"
                      }
                      className="mt-1"
                    >
                      {activity.type === "purchase"
                        ? "Buy"
                        : activity.type === "sale"
                        ? "Sell"
                        : activity.type === "alert_created"
                        ? "Alert Set"
                        : "Alert Triggered"}
                    </Badge>
                    <div>
                      <div className="font-medium cursor-pointer" onClick={() => navigate(`/stock/${encodeURIComponent(activity.symbol)}`)}>
                        {activity.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity.type === "purchase" || activity.type === "sale"
                          ? `${activity.quantity} shares at ₹${activity.price.toLocaleString()}`
                          : activity.type === "alert_created"
                          ? `Alert when price goes ${activity.condition} ₹${activity.target.toLocaleString()}`
                          : `Price went ${activity.condition} ₹${activity.price.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(activity.date)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
