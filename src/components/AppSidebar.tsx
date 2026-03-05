import {
  LayoutDashboard,
  Upload,
  Radio,
  Brain,
  History,
  TrendingUp,
  Server,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Upload", url: "/upload", icon: Upload },
  { title: "Live Analysis", url: "/live-analysis", icon: Radio },
  { title: "Emotion Insights", url: "/emotion-insights", icon: Brain },
  { title: "Session History", url: "/session-history", icon: History },
  { title: "Analytics & Trends", url: "/analytics", icon: TrendingUp },
  { title: "Infrastructure", url: "/infrastructure", icon: Server },
  { title: "Team Management", url: "/team", icon: Users },
  { title: "Reports & Exports", url: "/reports", icon: FileText },
  { title: "Settings & API", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className={`flex items-center justify-center overflow-hidden transition-all duration-300 ${collapsed ? "py-0" : "py-2"}`} title="EchooMotive AI Platform">
          <div className={`transition-all duration-300 flex items-center justify-center shrink-0 ${collapsed ? "w-8 h-8" : "w-full h-16 px-1"}`}>
            <img src="/logo/Logo.png" alt="EchooMotive Logo" className="w-full h-full object-contain scale-[1.3] drop-shadow-[0_0_12px_hsl(356_100%_63%/0.4)]" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="transition-colors duration-200"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                        {!collapsed && item.url === "/live-analysis" && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-primary live-pulse" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-2 border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar >
  );
}
