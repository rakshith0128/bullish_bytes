
import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

interface Alert {
  id: string;
  symbol: string;
  name: string;
  condition: "above" | "below";
  price: number;
  active: boolean;
  createdAt: string;
}

// Mock alerts
const mockAlerts: Alert[] = [
  {
    id: "1",
    symbol: "RELIANCE.NS",
    name: "Reliance Industries Ltd",
    condition: "above",
    price: 2500,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    symbol: "TCS.NS",
    name: "Tata Consultancy Services Ltd",
    condition: "below",
    price: 3500,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    symbol: "INFY.NS",
    name: "Infosys Ltd",
    condition: "above",
    price: 1700,
    active: false,
    createdAt: new Date().toISOString(),
  },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Simulate API call to fetch alerts
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call that includes the user's ID
        setTimeout(() => {
          setAlerts(mockAlerts);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        toast({
          title: "Error",
          description: "Failed to load alerts. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [navigate, toast, user]);

  const handleCreateAlert = () => {
    navigate("/alerts/new");
  };

  const handleDeleteAlert = (id: string) => {
    // In a real app, this would be an API call
    setAlerts(alerts.filter((alert) => alert.id !== id));
    toast({
      title: "Alert Deleted",
      description: "The price alert has been successfully removed.",
    });
  };

  const handleToggleAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Price Alerts</h1>
            <p className="text-muted-foreground">
              Get notified when stocks reach your target prices
            </p>
          </div>

          <Button onClick={handleCreateAlert}>
            <Plus className="h-4 w-4 mr-2" />
            New Alert
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how you want to receive alert notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts on your device
                  </p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts via email
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="voice-notifications">Voice Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive voice alerts when the app is open
                  </p>
                </div>
                <Switch id="voice-notifications" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : alerts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Target Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">
                        <div className="cursor-pointer" onClick={() => navigate(`/stock/${encodeURIComponent(alert.symbol)}`)}>
                          <div>{alert.name}</div>
                          <div className="text-muted-foreground text-sm">{alert.symbol}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {alert.condition === "above" ? "Price rises above" : "Price falls below"}
                      </TableCell>
                      <TableCell>₹{alert.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={alert.active}
                            onCheckedChange={() => handleToggleAlert(alert.id)}
                          />
                          <Badge variant={alert.active ? "default" : "outline"}>
                            {alert.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAlert(alert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  You don't have any price alerts set up yet
                </p>
                <Button onClick={handleCreateAlert}>Create Your First Alert</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Alerts;
