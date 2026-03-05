import * as React from "react";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search,
    LayoutDashboard,
    Upload,
    Mic,
    Brain,
    History,
    BarChart3,
    Server,
    Users,
    FileText,
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";

export function SearchCommand({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const navigate = useNavigate();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(!open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open, setOpen]);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/upload"))}>
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Upload Data</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/live-analysis"))}>
                        <Mic className="mr-2 h-4 w-4" />
                        <span>Live Analysis</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Platform">
                    <CommandItem onSelect={() => runCommand(() => navigate("/emotion-insights"))}>
                        <Brain className="mr-2 h-4 w-4" />
                        <span>Emotion Insights</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/session-history"))}>
                        <History className="mr-2 h-4 w-4" />
                        <span>Session History</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/analytics"))}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Analytics</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/infrastructure"))}>
                        <Server className="mr-2 h-4 w-4" />
                        <span>Infrastructure</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem onSelect={() => runCommand(() => navigate("/team"))}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Team Management</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/reports"))}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Reports & Exports</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
