import { ThumbsUp, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { GroceryRow } from "./data";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function GroceryTable({
  rows,
  showStatus = false,
  showActions = false,
  onRowClick,
  totalCount = 0,
  currentPage = 1,
  pageSize = 20,
  onPageChange,
  onVote,
  votedIds = [],
  onStatusToggle,
  onEdit,
  onDelete,
  isLoading = false,
  emptyStateMessage = "No data available",
}: {
  rows: GroceryRow[];
  showStatus?: boolean;
  showActions?: boolean;
  onRowClick?: (row: GroceryRow) => void;
  onVote?: (entryId: number) => void;
  votedIds?: number[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onStatusToggle?: (row: GroceryRow) => void;
  onEdit?: (row: GroceryRow) => void;
  onDelete?: (row: GroceryRow) => void;
  isLoading?: boolean;
  emptyStateMessage?: string;
}) {
  const totalPages = Math.ceil(totalCount / pageSize);

  // Helper to format large vote counts (e.g. 1200 -> 1.2K)
  const formatVotes = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-4 font-medium">#</th>
              <th className="px-5 py-4 font-medium">Item (Commodity)</th>
              <th className="px-5 py-4 font-medium">Price (Modal)</th>
              <th className="px-5 py-4 font-medium">Market Range</th>
              <th className="px-5 py-4 font-medium">Locality (Area)</th>
              <th className="px-5 py-4 font-medium">Trust (Vote)</th>
              {showStatus && <th className="px-5 py-4 font-medium">Status</th>}
              {showActions && <th className="px-5 py-4 font-medium">Action</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-t border-border">
                  <td className="px-5 py-4"><Skeleton className="h-4 w-4" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-12" /></td>
                  {showStatus && <td className="px-5 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>}
                  {showActions && <td className="px-5 py-4"><Skeleton className="h-4 w-12" /></td>}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={showStatus ? (showActions ? 8 : 7) : 6} className="px-5 py-8 text-center text-muted-foreground">
                  {emptyStateMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-t border-border transition-colors hover:bg-mint-soft/30",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  <td className="px-5 py-4 text-muted-foreground">{(currentPage - 1) * pageSize + i + 1}</td>
                  <td className="px-5 py-4 font-medium">{row.item}</td>
                  <td className="px-5 py-4">{row.price}</td>
                  <td className="px-5 py-4 text-muted-foreground">{row.range}</td>
                  <td className="px-5 py-4">{row.locality}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onVote?.(row.id);
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 transition-all active:scale-95 hover:scale-110",
                        votedIds.includes(row.id) ? "text-mint font-bold" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {formatVotes(row.trust)}
                      <ThumbsUp
                        className="h-3.5 w-3.5"
                        fill={votedIds.includes(row.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </td>
                  {showStatus && (
                    <td className="px-5 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusToggle?.(row);
                        }}
                        disabled={!onStatusToggle}
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-all hover:opacity-80 active:scale-95",
                          row.status === "Verified"
                            ? "bg-mint-soft text-foreground"
                            : "bg-orange-100 text-orange-700",
                          !onStatusToggle && "pointer-events-none"
                        )}
                      >
                        {row.status}
                      </button>
                    </td>
                  )}
                  {showActions && (
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(row);
                          }}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(row);
                          }}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border px-5 py-4 text-xs text-muted-foreground">
        <span>
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()} entries
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            className="h-8 px-3 rounded-md border border-border bg-card text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-semibold text-foreground">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => onPageChange?.(currentPage + 1)}
            className="h-8 px-3 rounded-md border border-border bg-card text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
