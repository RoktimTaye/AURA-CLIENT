import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Logo } from "@/components/aura/Logo";
import { BackButton } from "@/components/aura/BackButton";
import { PageShell } from "@/components/aura/PageShell";
import { GroceryTable } from "@/components/aura/GroceryTable";
import { sampleData } from "@/components/aura/data";

export const Route = createFileRoute("/view")({
  head: () => ({ meta: [{ title: "Market Price Data — AURA" }] }),
  component: ViewPage,
});

function ViewPage() {
  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <BackButton to="/welcome" />
        <Logo />
        <div className="w-12" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Enter location (e.g., Dibrugarh)"
            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-mint focus:shadow-glow-sm"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Enter grocery item (e.g., Rice, Tea)"
            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-mint focus:shadow-glow-sm"
          />
        </div>
        <button className="rounded-xl bg-foreground px-8 py-3 text-sm font-semibold uppercase tracking-wider text-background transition-all hover:scale-[1.02]">
          Search
        </button>
      </motion.div>

      <h2 className="mt-10 mb-4 text-xl font-semibold tracking-tight">Market Price Data</h2>
      <GroceryTable rows={sampleData.slice(0, 5)} />
    </PageShell>
  );
}
