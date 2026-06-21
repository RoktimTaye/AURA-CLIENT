import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Apple, Carrot, Banana } from "lucide-react";
import { Logo } from "@/components/aura/Logo";
import { GlowBackground } from "@/components/aura/GlowBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AURA — Automated Realtime Grocery Price Analysis" },
      { name: "description", content: "Real-time grocery price insights from markets across India." },
      { property: "og:title", content: "AURA — Automated Realtime Analysis" },
      { property: "og:description", content: "Real-time grocery price insights from markets across India." },
    ],
  }),
  component: Landing,
});

function FloatingIcon({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-soft"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function Landing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <GlowBackground />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <Logo />
        <Link
          to="/admin"
          className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all hover:border-foreground hover:shadow-soft"
        >
          Admin
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 md:grid-cols-2 md:px-10 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center rounded-full bg-mint-soft px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
            Real time · Accurate · Reliable
          </span>
          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            AUTOMATED
            <br />
            REALTIME
            <br />
            ANALYSIS
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Get real-time grocery price insights from across markets. Track trends, verify trust scores, and make smarter decisions.
          </p>
          <Link
            to="/welcome"
            className="btn-cta group inline-flex items-center gap-3 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em]"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="relative h-[420px]">
          <div className="glow-orb absolute inset-0 m-auto h-[380px] w-[380px] opacity-80" />
          <FloatingIcon className="absolute right-12 top-4" delay={0.1}>
            <Apple className="h-7 w-7 text-mint" strokeWidth={1.5} />
          </FloatingIcon>
          <FloatingIcon className="absolute left-8 top-32" delay={0.3}>
            <Carrot className="h-7 w-7 text-foreground" strokeWidth={1.5} />
          </FloatingIcon>
          <FloatingIcon className="absolute bottom-12 right-20" delay={0.5}>
            <Banana className="h-7 w-7 text-foreground" strokeWidth={1.5} />
          </FloatingIcon>
        </div>
      </section>
    </div>
  );
}
