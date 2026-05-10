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

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — AURA Admin" }] }),
  component: Analytics,
});

const bars = [
  { day: "May 14", uploads: 120, verified: 80 },
  { day: "May 15", uploads: 180, verified: 130 },
  { day: "May 16", uploads: 150, verified: 110 },
  { day: "May 17", uploads: 220, verified: 170 },
  { day: "May 18", uploads: 260, verified: 200 },
  { day: "May 19", uploads: 300, verified: 240 },
  { day: "May 20", uploads: 280, verified: 220 },
];

const pie = [
  { name: "Rice", value: 45, color: "oklch(0.78 0.2 150)" },
  { name: "Tea", value: 20, color: "oklch(0.55 0.18 150)" },
  { name: "Sugar", value: 15, color: "oklch(0.7 0.05 250)" },
  { name: "Dal", value: 10, color: "oklch(0.4 0.02 250)" },
  { name: "Others", value: 10, color: "oklch(0.85 0.05 80)" },
];

function Analytics() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics Overview</h1>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Records", value: "1,248", delta: "+12.5%" },
          { label: "Verified Items", value: "842", delta: "+8.2%" },
          { label: "Pending Items", value: "406", delta: "-2.1%" },
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
              <span className="text-2xl font-semibold">1,248</span>
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
