import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — AURA Admin" }] }),
  component: Analytics,
});

function Analytics() {
  const { data: analytics } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: stats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const bars = analytics?.bars || [];
  const pie = analytics?.pie || [];
  const pieTotal = analytics?.total || 0;

  const totalRecords = stats?.totalRecords || 0;
  const verifiedItems = stats?.verifiedItems || 0;
  const pendingItems = stats?.pendingItems || 0;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics Overview</h1>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Records", value: totalRecords, delta: "+12.5%" },
          { label: "Verified Items", value: verifiedItems, delta: "+8.2%" },
          { label: "Pending Items", value: pendingItems, delta: "-2.1%" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-3xl font-semibold tracking-tight">{s.value}</span>
              <span className="rounded-full bg-mint-soft px-2 py-1 text-xs font-medium">{s.delta}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <h3 className="mb-6 font-semibold">Uploads Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.005 250)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.5 0.01 250)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.5 0.01 250)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid oklch(0.93 0.005 250)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="uploads" fill="oklch(0.78 0.2 150)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="verified" fill="oklch(0.93 0.005 250)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="mb-6 font-semibold">Top Items</h3>
          <div className="relative h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {pie.map((p) => (
                    <Cell key={p.name} fill={p.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold">{pieTotal.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {pie.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </span>
                <span className="font-medium">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
