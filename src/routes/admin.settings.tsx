import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — AURA Admin" }] }),
  component: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-soft">
        <p className="text-muted-foreground">Workspace settings.</p>
      </div>
    </div>
  ),
});
