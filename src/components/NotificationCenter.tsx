import * as React from "react";
import { Bell, Check, Info, AlertTriangle, ShieldAlert } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    type: "info" | "success" | "warning" | "security";
    unread: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        title: "Analysis Complete",
        description: "Session S-1042 has been successfully processed.",
        time: "2 min ago",
        type: "success",
        unread: true,
    },
    {
        id: "2",
        title: "System Update",
        description: "New emotional models (v2.4) have been deployed.",
        time: "1 hour ago",
        type: "info",
        unread: true,
    },
    {
        id: "3",
        title: "Security Alert",
        description: "Unusual login attempt detected from a new device.",
        time: "3 hours ago",
        type: "security",
        unread: false,
    },
    {
        id: "4",
        title: "Storage Warning",
        description: "Your workspace is approaching 90% capacity.",
        time: "5 hours ago",
        type: "warning",
        unread: false,
    },
];

export function NotificationCenter() {
    const [notifications, setNotifications] = React.useState(mockNotifications);
    const unreadCount = notifications.filter((n) => n.unread).length;

    const markAllRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    };

    const markRead = (id: string) => {
        setNotifications(
            notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
        );
    };

    const getIcon = (type: Notification["type"]) => {
        switch (type) {
            case "success":
                return <Check className="w-3.5 h-3.5 text-emotion-calm" />;
            case "warning":
                return <AlertTriangle className="w-3.5 h-3.5 text-emotion-stress" />;
            case "security":
                return <ShieldAlert className="w-3.5 h-3.5 text-emotion-anger" />;
            default:
                return <Info className="w-3.5 h-3.5 text-primary" />;
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="relative p-1.5 rounded-md hover:bg-surface transition-colors">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80 p-0 overflow-hidden mx-4 sm:mx-0" align="end">
                <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                    <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-[10px] text-primary hover:underline font-medium"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                    <AnimatePresence initial={false}>
                        {notifications.length > 0 ? (
                            notifications.map((n, i) => (
                                <motion.div
                                    key={n.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => markRead(n.id)}
                                    className={`p-4 border-b border-border/50 flex gap-3 cursor-pointer transition-colors ${n.unread ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-surface"
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.unread ? "bg-primary/20" : "bg-muted"
                                        }`}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className={`text-xs font-medium truncate ${n.unread ? "text-foreground" : "text-muted-foreground"}`}>
                                                {n.title}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground tabular-nums">
                                                {n.time}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                                            {n.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-12 text-center text-muted-foreground italic text-xs">
                                No notifications for you.
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </PopoverContent>
        </Popover>
    );
}
