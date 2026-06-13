import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, Plus, X, Loader2 } from "lucide-react";
import { GroceryTable } from "@/components/aura/GroceryTable";
import type { GroceryRow } from "@/components/aura/data";
import { UploadForm } from "@/components/aura/UploadForm";
import { EditForm } from "@/components/aura/EditForm";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<GroceryRow | null>(null);
  const [deletingRow, setDeletingRow] = useState<GroceryRow | null>(null);
  const [district, setDistrict] = useState("");
  const [item, setItem] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [searchParams, setSearchParams] = useState({ district: "", item: "" });
  const [votedIds, setVotedIds] = useState<number[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('aura_user_votes') || '[]');
    setVotedIds(saved);
  }, []);

  const queryKey = ["directory", searchParams, page];

  const { data, isLoading: loading } = useQuery({
    queryKey,
    queryFn: async () => {
      const skip = (page - 1) * pageSize;
      const query = new URLSearchParams({
        limit: pageSize.toString(),
        skip: skip.toString(),
        is_admin: "true"
      });
      if (searchParams.district) query.append("district", searchParams.district);
      if (searchParams.item) query.append("item", searchParams.item);
      
      const response = await fetch(`/api/directory?${query.toString()}`);
      if (!response.ok) throw new Error("Network response was not ok");
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
          status: d.status === "APPROVED" ? "Verified" : "Pending"
        }))
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  const voteMutation = useMutation({
    mutationFn: async ({ entryId, upvote }: { entryId: number; upvote: boolean }) => {
      const response = await fetch(`/api/vote/${entryId}?upvote=${upvote}`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error("Vote failed");
      return response.json();
    },
    onMutate: async ({ entryId, upvote }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      const previousVotedIds = votedIds;

      const hasVoted = previousVotedIds.includes(entryId);
      const updatedVotes = hasVoted
        ? previousVotedIds.filter(id => id !== entryId)
        : [...previousVotedIds, entryId];
      
      setVotedIds(updatedVotes);
      localStorage.setItem('aura_user_votes', JSON.stringify(updatedVotes));
      
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          rows: old.rows.map((row: GroceryRow) =>
            row.id === entryId ? { ...row, trust: upvote ? row.trust + 1 : row.trust - 1 } : row
          )
        };
      });
      
      return { previousData, previousVotedIds };
    },
    onError: (err, variables, context: any) => {
      if (context) {
        queryClient.setQueryData(queryKey, context.previousData);
        setVotedIds(context.previousVotedIds);
        localStorage.setItem('aura_user_votes', JSON.stringify(context.previousVotedIds));
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const rows = data?.rows || [];
  const totalCount = data?.total || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ district, item });
  };

  const handleVote = (entryId: number) => {
    const hasVoted = votedIds.includes(entryId);
    voteMutation.mutate({ entryId, upvote: !hasVoted });
  };

  const statusMutation = useMutation({
    mutationFn: async ({ entryId, newStatus }: { entryId: number; newStatus: "APPROVED" | "FLAGGED" }) => {
      const response = await fetch(`/api/admin/entry/${entryId}/status?status=${newStatus}`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error("Status update failed");
      return response.json();
    },
    onMutate: async ({ entryId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          rows: old.rows.map((row: GroceryRow) =>
            row.id === entryId ? { ...row, status: newStatus === "APPROVED" ? "Verified" : "Pending" } : row
          )
        };
      });
      
      return { previousData };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error("Failed to update status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const handleStatusToggle = (row: GroceryRow) => {
    const newStatus = row.status === "Verified" ? "FLAGGED" : "APPROVED";
    statusMutation.mutate({ entryId: row.id, newStatus });
  };

  const deleteMutation = useMutation({
    mutationFn: async (entryId: number) => {
      const response = await fetch(`/api/admin/entry/${entryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Delete failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Entry deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete entry");
    }
  });

  const handleDelete = (row: GroceryRow) => {
    setDeletingRow(row);
  };

  const confirmDelete = () => {
    if (deletingRow) {
      deleteMutation.mutate(deletingRow.id);
    }
  };

  const handleRowClick = (row: GroceryRow) => {
    if (row.itemId) {
      navigate({ 
        to: "/view/$itemId", 
        params: { itemId: row.itemId.toString() },
        search: { 
          district: row.district || row.locality.split(' ')[0], 
          itemName: row.item,
          from: "/admin/data"
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

        <GroceryTable 
          rows={rows} 
          isLoading={loading}
          onRowClick={handleRowClick} 
          onVote={handleVote}
          onStatusToggle={handleStatusToggle}
          onEdit={setEditingRow}
          onDelete={handleDelete}
          votedIds={votedIds}
          showStatus 
          showActions 
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
        />

      {/* Edit Form Dialog */}
      <Dialog open={!!editingRow} onOpenChange={(open) => !open && setEditingRow(null)}>
        <DialogPortal forceMount>
          <AnimatePresence>
            {editingRow && (
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
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ type: "spring", damping: 30, stiffness: 300 }}
                      className="relative w-full max-w-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EditForm 
                        row={editingRow} 
                        queryKey={queryKey} 
                        onClose={() => setEditingRow(null)} 
                      />
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingRow} onOpenChange={(open) => !open && setDeletingRow(null)}>
        <DialogPortal forceMount>
          <AnimatePresence>
            {deletingRow && (
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
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ type: "spring", damping: 30, stiffness: 300 }}
                      className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Delete Entry</h2>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Are you sure you want to delete this row?
                      </p>
                      
                      <div className="mt-8 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setDeletingRow(null)}
                          className="flex flex-1 items-center justify-center rounded-xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted"
                        >
                          No
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            confirmDelete();
                            setDeletingRow(null);
                          }}
                          className="flex flex-1 items-center justify-center rounded-xl bg-destructive py-3.5 text-sm font-semibold text-destructive-foreground transition-transform hover:scale-[1.02]"
                        >
                          Yes
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </DialogPrimitive.Content>
              </>
            )}
          </AnimatePresence>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
