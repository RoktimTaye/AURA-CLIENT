import { Outlet, createFileRoute, Link, useRouterState, redirect } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Upload,
  Database,
  CheckCircle2,
  Clock,
  BarChart3,
  Users,
  Settings,
  Home,
  LogOut,
  Bell,
  MoreHorizontal,
} from "lucide-react";
import { Logo } from "@/components/aura/Logo";
import { GlowBackground } from "@/components/aura/GlowBackground";
import { cn } from "@/lib/utils";
import { isAuthenticated, clearSession, getUserName } from "@/lib/auth";
import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location, request }) => {
    const isAuth = isAuthenticated(request?.headers.get("Cookie") ?? undefined);
    const isAuthPage = location.pathname === "/admin/signin" || location.pathname === "/admin/signup";

    if (!isAuth && !isAuthPage) {
      throw redirect({
        to: "/admin/signin",
      });
    }
  },
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/upload", label: "Upload Data", icon: Upload },
  { to: "/admin/data", label: "View Data", icon: Database },
  { to: "/admin/verified", label: "Verified Items", icon: CheckCircle2 },
  { to: "/admin/pending", label: "Pending Items", icon: Clock },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [name, setName] = useState("Admin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setName(getUserName());
    }
  }, [path]);

  const userInitial = name.charAt(0).toUpperCase();

  // hide layout on signin/signup
  if (path === "/admin/signin" || path === "/admin/signup") {
    return <Outlet />;
  }

  const moreItems = nav.slice(3, 6); // Verified, Pending, Analytics

  return (
    <div className="relative min-h-screen w-full">
      <GlowBackground />
      <div className="flex min-h-screen w-full">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar/70 px-4 py-6 backdrop-blur md:flex">
          <div className="px-3 pb-6">
            <Logo to="/admin" />
          </div>
          <nav className="flex-1 space-y-1">
            {nav.map((item) => {
              const active = item.exact ? path === item.to : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-mint-soft text-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" strokeWidth={1.75} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-1 border-t border-border pt-3">
            <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link
              to="/"
              onClick={() => clearSession()}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/70 px-5 py-4 backdrop-blur md:px-10">
            <div className="md:hidden">
              <Logo to="/admin" />
            </div>
            <div className="hidden text-sm text-muted-foreground md:block">Admin Workspace</div>
            <div className="flex items-center gap-4">
              {/* Commented out notification bell for future use
              <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-mint" />
              </button>
              */}
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-soft text-xs font-semibold">
                  {userInitial}
                </div>
                <span className="hidden text-sm font-medium md:block">{name}</span>
              </div>
              <Link
                to="/"
                onClick={() => clearSession()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-destructive transition-colors hover:bg-destructive/10 md:hidden"
              >
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          </header>
          <main className="flex-1 px-5 py-8 md:px-10">
            <Outlet context={{ name }} />
          </main>

          {/* Mobile bottom nav */}
          <nav className="sticky bottom-0 z-20 flex items-center justify-around border-t border-border bg-background/90 py-2 backdrop-blur md:hidden">
            <Link
              to="/"
              className="flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] text-muted-foreground"
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
            {nav.slice(0, 3).map((item) => {
              const active = item.exact ? path === item.to : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px]",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <item.icon className={cn("h-5 w-5", active && "text-mint")} />
                  {item.label.split(" ")[0]}
                </Link>
              );
            })}

            {/* More Menu */}
            <Drawer>
              <DrawerTrigger asChild>
                <button className="flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] text-muted-foreground">
                  <MoreHorizontal className="h-5 w-5" />
                  More
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="pb-2">
                  <DrawerTitle className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Management
                  </DrawerTitle>
                </DrawerHeader>
                <div className="grid grid-cols-1 gap-1 px-4 pb-8">
                  {moreItems.map((item) => {
                    const active = path.startsWith(item.to);
                    return (
                      <DrawerClose key={item.to} asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            "flex items-center gap-4 rounded-2xl px-4 py-4 transition-all",
                            active ? "bg-mint-soft text-foreground" : "text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-soft",
                            active && "bg-background"
                          )}>
                            <item.icon className={cn("h-5 w-5", active && "text-mint")} />
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </DrawerClose>
                    );
                  })}
                </div>
              </DrawerContent>
            </Drawer>
          </nav>
        </div>
      </div>
    </div>
  );
}
