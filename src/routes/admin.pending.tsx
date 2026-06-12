import { createFileRoute } from "@tanstack/react-router";
import { GroceryTable } from "@/components/aura/GroceryTable";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function PendingItemsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["directory", "FLAGGED", page],
    queryFn: async () => {
      const skip = (page - 1) * pageSize;
      const response = await fetch(`/api/directory?limit=${pageSize}&skip=${skip}&is_admin=true&status=FLAGGED`);
      if (!response.ok) throw new Error("Network error");
      const result = await response.json();
      return {
        total: result.total,
        rows: result.items.map((d: any) => ({
          id: d.id,
          itemId: d.item_id,
          item: d.item_name,
          price: `₹${Math.round(d.price_modal)}/${d.unit}`,
          range: d.price_range === "N/A" ? "N/A" : `₹${d.price_range}/${d.unit}`,
          district: d.district,
          locality: d.locality_full,
          trust: d.votes,
          status: "Pending"
        }))
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Pending Items</h2>
      <GroceryTable 
        rows={data?.rows || []} 
        isLoading={isLoading}
        totalCount={data?.total || 0}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        emptyStateMessage="No pending data"
      />
    </div>
  );
}

export const Route = createFileRoute("/admin/pending")({
  head: () => ({ meta: [{ title: "Pending Items — AURA Admin" }] }),
  component: PendingItemsPage,
});
