import { Package, IndianRupee, MapPin, Save, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { GroceryRow } from "./data";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function Field({
  label,
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
  className,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="group relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-card px-4 py-3.5 pr-11 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-mint focus:shadow-glow-sm"
        />
        <Icon className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}

export function EditForm({ 
  row, 
  onClose,
  queryKey
}: { 
  row: GroceryRow; 
  onClose: () => void;
  queryKey: any[];
}) {
  const queryClient = useQueryClient();
  const [item, setItem] = useState(row.item);
  const [priceStr, setPriceStr] = useState("");
  const [location, setLocation] = useState(row.locality);

  useEffect(() => {
    // Extract numbers from "₹120/kg"
    const num = row.price.replace(/[^0-9.]/g, '');
    setPriceStr(num);
  }, [row]);

  const updateMutation = useMutation({
    mutationFn: async (payload: { price?: number, item_name?: string, location_name?: string }) => {
      const response = await fetch(`/api/admin/entry/${row.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to update");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Entry updated successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update entry");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item.trim() || !priceStr.trim() || !location.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const numericPrice = parseFloat(priceStr);
    if (isNaN(numericPrice)) {
      toast.error("Invalid price value");
      return;
    }

    const payload: any = {
      price: numericPrice,
    };
    
    // Only update these if they actually changed
    if (item.trim() !== row.item) {
      payload.item_name = item.trim();
    }
    
    if (location.trim() !== row.locality) {
      let finalMarketName = location.trim();
      if (row.district && finalMarketName.startsWith(row.district)) {
        finalMarketName = finalMarketName.substring(row.district.length).trim();
      }
      payload.location_name = finalMarketName;
    }

    updateMutation.mutate(payload);
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10 relative">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Edit Entry</h2>
      <p className="mt-2 text-sm text-muted-foreground">Update the grocery details for this entry.</p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <Field 
          label="Grocery Item" 
          icon={Package} 
          placeholder="e.g., Rice, Tea" 
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <Field 
          label="Location (Market Name)" 
          icon={MapPin} 
          placeholder="e.g., Fancy Bazar" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Field 
          label="Price (Modal)" 
          icon={IndianRupee} 
          placeholder="e.g., 120" 
          type="number"
          value={priceStr}
          onChange={(e) => setPriceStr(e.target.value)}
        />

        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-4 text-sm font-semibold text-foreground transition-all hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="btn-cta group flex flex-1 items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold uppercase tracking-wider disabled:opacity-50"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
            <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </form>
    </div>
  );
}
