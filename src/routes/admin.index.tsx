import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Upload, Search, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — AURA Admin" }] }),
  component: Dashboard,
});

function useCount(target: number, duration = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setN(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function StatCard({
  label,
  value,
  delta,
  trend,
  delay,
}: {
  label: string;
  value: number;
  delta: string;
  trend: "up" | "down";
  delay: number;
}) {
  const n = useCount(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-soft"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-4xl font-semibold tracking-tight">{n.toLocaleString()}</span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
            trend === "up" ? "bg-mint-soft text-foreground" : "bg-red-50 text-red-600",
          )}
        >
          {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">vs last month</p>
    </motion.div>
  );
}

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const total = stats?.totalRecords || 0;
  const verified = stats?.verifiedItems || 0;
  const pending = stats?.pendingItems || 0;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Welcome back, Admin!</h1>
        <p className="mt-2 text-muted-foreground">Here's what's happening today.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Records" value={total} delta="+12.5%" trend="up" delay={0.05} />
        <StatCard label="Verified Items" value={verified} delta="+8.2%" trend="up" delay={0.15} />
        <StatCard label="Pending Items" value={pending} delta="-2.1%" trend="down" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {[
          { to: "/admin/upload", title: "Upload Data", desc: "Add new grocery price information to the system.", icon: Upload, highlight: true },
          { to: "/admin/data", title: "View Data", desc: "Browse, verify and manage uploaded data.", icon: Search, highlight: false },
        ].map((c, i) => (
          <motion.div
            key={c.to}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Link
              to={c.to}
              className={cn(
                "group flex h-56 flex-col justify-between rounded-3xl border p-7 transition-all",
                c.highlight ? "border-mint/40 bg-mint-soft" : "border-border bg-card hover:border-mint/40 hover:shadow-glow-sm",
              )}
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card shadow-soft">
                  <c.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{c.title}</h3>
                <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{c.desc}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-110">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
