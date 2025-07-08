import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, X, Bell } from "lucide-react";

interface Notification {
  id: number;
  type: "success" | "warning" | "info" | "urgent";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "urgent",
    title: "High-Priority Candidate",
    message: "Sarah Johnson scored 87% - recommend immediate review and interview scheduling",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    isRead: false
  },
  {
    id: 2,
    type: "warning",
    title: "Assessment Review Required",
    message: "Michael Chen's assessment flagged for manual review due to inconsistent responses",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false
  },
  {
    id: 3,
    type: "success",
    title: "Batch Assessment Complete",
    message: "Successfully processed 12 candidates for Frontend Developer position",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: true
  },
  {
    id: 4,
    type: "info",
    title: "System Update",
    message: "AI models updated with improved accuracy for technical role assessments",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true
  }
];

export default function Notifications() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case "urgent": return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <Bell className="h-4 w-4 text-[var(--cyber-cyan)]" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "border-l-green-400";
      case "warning": return "border-l-yellow-400";
      case "urgent": return "border-l-red-400";
      default: return "border-l-[var(--cyber-cyan)]";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <Card className="glassmorphism fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--cyber-cyan)] flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </h3>
          <Badge variant="secondary" className="bg-red-500 text-white">
            {mockNotifications.filter(n => !n.isRead).length} new
          </Badge>
        </div>

        <div className="space-y-3">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-[var(--darker-surface)] rounded-lg p-4 border-l-4 ${getNotificationColor(notification.type)} ${
                !notification.isRead ? "bg-opacity-80" : "bg-opacity-40"
              } hover-glow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-medium ${!notification.isRead ? "text-white" : "text-gray-300"}`}>
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-[var(--cyber-cyan)] rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{notification.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(notification.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" className="text-[var(--cyber-cyan)] border-[var(--cyber-cyan)]">
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}