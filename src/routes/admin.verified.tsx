import { createFileRoute } from "@tanstack/react-router";
import { GroceryTable } from "@/components/aura/GroceryTable";
import { sampleData } from "@/components/aura/data";

export const Route = createFileRoute("/admin/verified")({
  head: () => ({ meta: [{ title: "Verified Items — AURA Admin" }] }),
  component: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Verified Items</h2>
      <GroceryTable rows={sampleData.filter((r) => r.status === "Verified")} />
    </div>
  ),
});
