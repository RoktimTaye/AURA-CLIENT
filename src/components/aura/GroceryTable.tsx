import { ThumbsUp, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { GroceryRow } from "./data";
import { cn } from "@/lib/utils";

export function GroceryTable({
  rows,
  showStatus = false,
  showActions = false,
  onRowClick,
}: {
  rows: GroceryRow[];
  showStatus?: boolean;
  showActions?: boolean;
  onRowClick?: (row: GroceryRow) => void;
}) {
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
            {rows.map((row, i) => (
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
                <td className="px-5 py-4 text-muted-foreground">{i + 1}</td>
                <td className="px-5 py-4 font-medium">{row.item}</td>
                <td className="px-5 py-4">{row.price}</td>
                <td className="px-5 py-4 text-muted-foreground">{row.range}</td>
                <td className="px-5 py-4">{row.locality}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-foreground">
                    {row.trust}% <ThumbsUp className="h-3.5 w-3.5 text-mint" />
                  </span>
                </td>
                {showStatus && (
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                        row.status === "Verified"
                          ? "bg-mint-soft text-foreground"
                          : "bg-orange-100 text-orange-700",
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                )}
                {showActions && (
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-muted-foreground transition-colors hover:text-foreground">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="text-muted-foreground transition-colors hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border px-5 py-4 text-xs text-muted-foreground">
        <span>Showing 1 to {rows.length} of 245 entries</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, "...", 49].map((p, i) => (
            <button
              key={i}
              className={cn(
                "h-8 min-w-8 rounded-md px-2 text-xs transition-colors",
                p === 1 ? "bg-mint text-foreground" : "hover:bg-muted",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
