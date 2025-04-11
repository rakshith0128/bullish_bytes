
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
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

interface Notification {
  id: string;
  type: "alert" | "price" | "news" | "system";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Price Alert: Reliance Industries",
    message: "Reliance Industries Ltd (RELIANCE.NS) has reached your target price of ₹2,500.",
    read: false,
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    actionUrl: "/stock/RELIANCE.NS",
  },
  {
    id: "2",
    type: "price",
    title: "Major Price Movement",
    message: "Tata Motors Ltd (TATAMOTORS.NS) is up by 3.02% today.",
    read: false,
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    actionUrl: "/stock/TATAMOTORS.NS",
  },
  {
    id: "3",
    type: "news",
    title: "Market News",
    message: "Indian market opens higher led by banking and IT stocks.",
    read: true,
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "4",
    type: "system",
    title: "Portfolio Update",
    message: "Your portfolio has been updated with your latest transactions.",
    read: true,
    timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    actionUrl: "/portfolio",
  },
  {
    id: "5",
    type: "alert",
    title: "Price Alert: Infosys",
    message: "Infosys Ltd (INFY.NS) has fallen below your watchlist threshold of ₹1,650.",
    read: true,
    timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    actionUrl: "/stock/INFY.NS",
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Simulate API call to fetch notifications
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setNotifications(mockNotifications);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [navigate, toast, user]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, read: true }))
    );
    toast({
      title: "All Notifications Marked as Read",
      description: "All your notifications have been marked as read.",
    });
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been cleared.",
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      if (days === 1) {
        return "Yesterday";
      } else if (days < 7) {
        return `${days} days ago`;
      } else {
        return date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with alerts, price movements, and news
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              Mark All as Read
            </Button>
            <Button variant="outline" onClick={handleClearAll}>
              Clear All
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              Your latest alerts and system messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      notification.read ? "bg-background" : "bg-accent/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={
                              notification.type === "alert"
                                ? "destructive"
                                : notification.type === "price"
                                ? "default"
                                : notification.type === "news"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {notification.type === "alert"
                              ? "Alert"
                              : notification.type === "price"
                              ? "Price"
                              : notification.type === "news"
                              ? "News"
                              : "System"}
                          </Badge>
                          <h3 className="font-medium">{notification.title}</h3>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.actionUrl && (
                            <Button
                              variant="link"
                              className="p-0 h-auto"
                              onClick={() => navigate(notification.actionUrl!)}
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  You don't have any notifications
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Notifications;
