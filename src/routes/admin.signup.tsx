import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Logo } from "@/components/aura/Logo";
import { BackButton } from "@/components/aura/BackButton";
import { PageShell } from "@/components/aura/PageShell";
import { setSession } from "@/lib/auth";

export const Route = createFileRoute("/admin/signup")({
  head: () => ({ meta: [{ title: "Admin Sign Up — AURA" }] }),
  component: SignUp,
});

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder: string }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-mint focus:shadow-glow-sm"
      />
    </div>
  );
}

function SignUp() {
  const navigate = useNavigate();
  const router = useRouter();

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <BackButton to="/admin/signin" />
        <Logo />
        <div className="w-12" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-12 w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10"
      >
        <h1 className="text-3xl font-semibold tracking-tight">Sign Up</h1>
        <p className="mt-2 text-sm text-muted-foreground">Create your admin account to get started.</p>
        <form
          className="mt-8 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            // In a real app, you'd call your signup API here
            navigate({ to: "/admin/signin" });
          }}
        >
          <Field label="Full Name" placeholder="Enter your full name" />
          <Field label="Email" type="email" placeholder="Enter your email" />
          <Field label="Password" type="password" placeholder="Create a password" />
          <Field label="Confirm Password" type="password" placeholder="Confirm your password" />
          <button className="w-full rounded-xl bg-foreground py-3.5 text-sm font-semibold uppercase tracking-wider text-background transition-all hover:scale-[1.01] hover:shadow-glow-sm">
            Sign Up
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/admin/signin" className="font-semibold text-foreground underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </PageShell>
  );
}
