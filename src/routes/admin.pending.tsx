import { createFileRoute } from "@tanstack/react-router";
import { GroceryTable } from "@/components/aura/GroceryTable";
import { sampleData } from "@/components/aura/data";

export const Route = createFileRoute("/admin/pending")({
  head: () => ({ meta: [{ title: "Pending Items — AURA Admin" }] }),
  component: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Pending Items</h2>
      <GroceryTable rows={sampleData.filter((r) => r.status === "Pending")} />
    </div>
  ),
});
