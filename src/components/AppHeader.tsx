import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { SearchCommand } from "./SearchCommand";
import { NotificationCenter } from "./NotificationCenter";

export function AppHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const fullName = user?.fullName || user?.primaryEmailAddress?.emailAddress.split("@")[0] || "User";
  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : fullName.slice(0, 2).toUpperCase();

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0 sticky top-0 z-30">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />

      <div className="relative flex-1 max-w-md">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between gap-2 h-9 px-3 rounded-md bg-surface border border-border text-sm text-muted-foreground hover:border-primary/50 hover:bg-surface-hover transition-all group overflow-hidden"
        >
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <Search className="w-4 h-4 shrink-0 group-hover:text-primary transition-colors" />
            <span className="truncate whitespace-nowrap text-left text-xs sm:text-sm">Search command or page...</span>
          </div>
          <kbd className="pointer-events-none shrink-0 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
        <SearchCommand open={searchOpen} setOpen={setSearchOpen} />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <NotificationCenter />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-surface transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
              {initials}
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-border">
                  <p className="text-xs text-foreground font-medium truncate">{fullName}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
