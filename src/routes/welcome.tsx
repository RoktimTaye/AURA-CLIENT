import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Upload, Search, ArrowRight, User } from "lucide-react";
import { Logo } from "@/components/aura/Logo";
import { BackButton } from "@/components/aura/BackButton";
import { PageShell } from "@/components/aura/PageShell";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Welcome — AURA" }] }),
  component: Welcome,
});

function ActionCard({
  to,
  icon: Icon,
  title,
  desc,
  highlight,
  delay,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  desc: string;
  highlight?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -6 }}
    >
      <Link
        to={to}
        className={`group relative flex h-80 flex-col justify-between rounded-3xl border p-8 transition-all md:h-96 md:p-10 ${
          highlight
            ? "border-mint/40 bg-mint-soft shadow-glow-sm"
            : "border-border bg-card hover:border-mint/40 hover:shadow-glow-sm"
        }`}
      >
        <div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-soft">
            <Icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
          </div>
          <h2 className="mt-8 text-3xl font-semibold uppercase tracking-wider">{title}</h2>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{desc}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background transition-all group-hover:scale-110">
          <ArrowRight className="h-5 w-5" />
        </div>
      </Link>
    </motion.div>
  );
}

function Welcome() {
  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <BackButton to="/" />
        <Logo />
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-12"
      >
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Welcome!</h1>
        <p className="mt-2 text-muted-foreground">Get real-time grocery price insights.</p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <ActionCard
          to="/upload"
          icon={Upload}
          title="Upload"
          desc="Upload grocery price details to the system."
          highlight
          delay={0.15}
        />
        <ActionCard
          to="/view"
          icon={Search}
          title="View"
          desc="View prices and insights from uploaded data."
          delay={0.25}
        />
      </div>
    </PageShell>
  );
}
