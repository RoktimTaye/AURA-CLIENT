import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, Plus, X, Loader2 } from "lucide-react";
import { GroceryTable } from "@/components/aura/GroceryTable";
import type { GroceryRow } from "@/components/aura/data";
import { UploadForm } from "@/components/aura/UploadForm";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/data")({
  head: () => ({ meta: [{ title: "All Data — AURA Admin" }] }),
  component: DataPage,
});

function DataPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
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
    fetchData();
  }, []);

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
          district: row.locality.split(' ')[0], 
          itemName: row.item 
        } 
      });
    } else {
      alert("Missing item ID. Please refresh the page and try again. (Backend may need a restart)");
    }
  };

  return (
    <div className="space-y-6">
      <form 
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto_auto]"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Enter location (e.g., Dibrugarh)"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-mint focus:shadow-glow-sm"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Enter grocery item (e.g., Rice, Tea)"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-mint focus:shadow-glow-sm"
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="rounded-xl bg-foreground px-7 py-3 text-sm font-semibold uppercase tracking-wider text-background transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </button>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button 
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-5 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" /> Add New
            </button>
          </DialogTrigger>
          <DialogPortal forceMount>
            <AnimatePresence>
              {isOpen && (
                <>
                  <DialogOverlay asChild forceMount>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                    />
                  </DialogOverlay>
                  <DialogPrimitive.Content asChild forceMount>
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <motion.div
                        initial={{ y: "100vh", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100vh", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="relative w-full max-w-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <UploadForm isAdmin={true} title="Add New Grocery Details" />
                        <DialogPrimitive.Close className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
                          <X className="h-4 w-4" />
                          <span className="sr-only">Close</span>
                        </DialogPrimitive.Close>
                      </motion.div>
                    </div>
                  </DialogPrimitive.Content>
                </>
              )}
            </AnimatePresence>
          </DialogPortal>
        </Dialog>
      </form>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">All Uploaded Data</h2>
        {rows.length > 0 && (
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {rows.length} Total Records
          </span>
        )}
      </div>

      {loading && rows.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-card/50">
          <Loader2 className="h-8 w-8 animate-spin text-mint" />
        </div>
      ) : (
        <GroceryTable rows={rows} onRowClick={handleRowClick} showStatus showActions />
      )}
    </div>
  );
}
