import { createFileRoute, useNavigate, Outlet, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/aura/Logo";
import { BackButton } from "@/components/aura/BackButton";
import { PageShell } from "@/components/aura/PageShell";
import { GroceryTable } from "@/components/aura/GroceryTable";
import type { GroceryRow } from "@/components/aura/data";

export const Route = createFileRoute("/view")({
  head: () => ({ meta: [{ title: "Market Price Data — AURA" }] }),
  component: ViewPage,
});

function ViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/view/') && location.pathname !== '/view';
  
  const [district, setDistrict] = useState("");
  const [item, setItem] = useState("");
  const [rows, setRows] = useState<GroceryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (district) query.append("district", district);
      if (item) query.append("item", item);
      
      const response = await fetch(`/api/directory?${query.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        // Map backend DirectoryView to frontend GroceryRow
        const mappedRows: GroceryRow[] = data.map((d: any) => ({
          id: d.id,
          itemId: d.item_id,
          item: d.item_name,
          price: `₹${Math.round(d.price_modal)}/${d.unit}`,
          range: d.price_range === "N/A" ? "N/A" : `₹${d.price_range}/${d.unit}`,
          locality: d.locality_full,
          trust: d.votes,
          status: d.status === "APPROVED" ? "Verified" : "Pending"
        }));
        setRows(mappedRows);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isDetailPage) {
      fetchData();
    }
  }, [isDetailPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleRowClick = (row: GroceryRow) => {
    if (row.itemId) {
      navigate({ 
        to: "/view/$itemId", 
        params: { itemId: row.itemId.toString() },
        search: { 
          district: row.locality.split(' ')[0], // Best guess for district from full locality
          itemName: row.item 
        } 
      });
    } else {
      alert("Missing item ID. Please refresh the page and try again. (Backend may need a restart)");
    }
  };

  if (isDetailPage) {
    return <Outlet />;
  }

  return (
    <PageShell>
      <div className="relative flex items-center justify-between">
        <BackButton to="/welcome" />
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <Logo />
          </div>
        </div>
      </div>

      <form 
        onSubmit={handleSearch}
        className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Enter location (e.g., Dibrugarh)"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-mint focus:shadow-glow-sm"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Enter grocery item (e.g., Rice, Tea)"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-mint focus:shadow-glow-sm"
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="rounded-xl bg-foreground px-8 py-3 text-sm font-semibold uppercase tracking-wider text-background transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </button>
      </form>

      <div className="mt-10 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Market Price Data</h2>
        {rows.length > 0 && (
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {rows.length} Results Found
          </span>
        )}
      </div>
      
      {loading && rows.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-border">
          <Loader2 className="h-6 w-6 animate-spin text-mint" />
        </div>
      ) : (
        <GroceryTable rows={rows} onRowClick={handleRowClick} showStatus />
      )}
    </PageShell>
  );
}
