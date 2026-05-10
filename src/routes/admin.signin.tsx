import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/aura/Logo";
import { BackButton } from "@/components/aura/BackButton";
import { PageShell } from "@/components/aura/PageShell";
import { setSession } from "@/lib/auth";

export const Route = createFileRoute("/admin/signin")({
  head: () => ({ meta: [{ title: "Admin Sign In — AURA" }] }),
  component: SignIn,
});

function SignIn() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <BackButton to="/" />
        <Logo />
        <div className="w-12" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-16 w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10"
      >
        <h1 className="text-3xl font-semibold tracking-tight">Sign In</h1>
        <p className="mt-2 text-sm text-muted-foreground">Welcome back! Please sign in to your admin account.</p>

        <form
          className="mt-8 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setSession();
            await router.invalidate();
            navigate({ to: "/admin" });
          }}
        >
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-mint focus:shadow-glow-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm outline-none transition-all focus:border-mint focus:shadow-glow-sm"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <a className="text-xs text-muted-foreground hover:text-foreground" href="#">Forgot password?</a>
          </div>
          <button className="w-full rounded-xl bg-foreground py-3.5 text-sm font-semibold uppercase tracking-wider text-background transition-all hover:scale-[1.01] hover:shadow-glow-sm">
            Sign In
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/admin/signup" className="font-semibold text-foreground underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </PageShell>
  );
}
