import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus, X } from "lucide-react";
import { GroceryTable } from "@/components/aura/GroceryTable";
import { sampleData } from "@/components/aura/data";
import { UploadForm } from "@/components/aura/UploadForm";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Enter location (e.g., Dibrugarh)"
            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-mint focus:shadow-glow-sm"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Enter grocery item (e.g., Rice, Tea)"
            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-mint focus:shadow-glow-sm"
          />
        </div>
        <button className="rounded-xl bg-foreground px-7 py-3 text-sm font-semibold uppercase tracking-wider text-background transition-transform hover:scale-[1.02]">
          Search
        </button>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-5 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-[1.02]">
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
                        <UploadForm title="Add New Grocery Details" />
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
      </div>

      <h2 className="text-xl font-semibold tracking-tight">All Uploaded Data</h2>
      <GroceryTable rows={sampleData} showStatus showActions />
    </div>
  );
}
