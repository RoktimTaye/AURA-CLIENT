import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — AURA Admin" }] }),
  component: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-soft">
        <p className="text-muted-foreground">User management coming soon.</p>
      </div>
    </div>
  ),
});
