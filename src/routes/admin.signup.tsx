import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Logo } from "@/components/aura/Logo";
import { BackButton } from "@/components/aura/BackButton";
import { PageShell } from "@/components/aura/PageShell";
import { setSession } from "@/lib/auth";
import { useState } from "react";

export const Route = createFileRoute("/admin/signup")({
  head: () => ({ meta: [{ title: "Admin Sign Up — AURA" }] }),
  component: SignUp,
});

// function Field({ 
//   label,
//    type = "text",
//     placeholder }: { label: string; type?: string; placeholder: string }) {
//   return (
//     <div>
//       <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
//       <input
//         type={type}
//         placeholder={placeholder}
//         className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-mint focus:shadow-glow-sm"
//       />
//     </div>
//   );
// }
function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange
}: {
  label: string;
  type?: string;
  placeholder: string;
  value?: string;
  onChange?: (e:
    React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium
  uppercase tracking-wider
  text-muted-foreground">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border
  border-border bg-background px-4 py-3 text-sm
  outline-none transition-all focus:border-mint
  focus:shadow-glow-sm"
      />
    </div>
  );
}

function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: "admin"
        }),
      });

      if (response.ok) {
        // Save name for the avatar before navigating
        if (typeof window !== "undefined") {
          localStorage.setItem("aura_admin_name", formData.fullName);
        }
        navigate({ to: "/admin/signin" });
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="relative flex items-center justify-between">
        <BackButton to="/admin/signin" />
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <Logo />
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-12 w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10"
      >
        <h1 className="text-3xl font-semibold tracking-tight">Sign Up</h1>
        <p className="mt-2 text-sm text-muted-foreground">Create your admin account to get started.</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <Field
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            disabled={isLoading}
          />
          <Field
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isLoading}
          />
          <Field
            label="Password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={isLoading}
          />
          <Field
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-foreground py-3.5 text-sm font-semibold uppercase tracking-wider text-background transition-all hover:scale-[1.01] hover:shadow-glow-sm disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
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
