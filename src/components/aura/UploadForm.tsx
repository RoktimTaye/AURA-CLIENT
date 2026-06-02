import { Upload, MapPin, Package, IndianRupee, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { toast } from "sonner";
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

export function UploadForm({ title = "Upload Grocery Price Details", isAdmin = false }: { title?: string; isAdmin?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [entries, setEntries] = useState([{ id: Date.now(), item: "", price: "" }]);

  const addEntry = () => {
    setEntries([...entries, { id: Date.now(), item: "", price: "" }]);
  };

  const removeEntry = (id: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const updateEntry = (id: number, field: "item" | "price", value: string) => {
    setEntries(
      entries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submit initiated...");
    setLoading(true);

    try {
      const token = getSession();
      console.log("Token retrieved:", token ? "Yes" : "No");
      
      // const userId = 1;

      if (isAdmin && !token) {
        console.warn("No token found, showing error toast");
        toast.error("You must be logged in to upload data");
        setLoading(false);
        return;
      }

      if (!location.trim()) {
        toast.error("Please enter a location");
        setLoading(false);
        return;
      }

      console.log("Preparing payload for", entries.length, "entries");

      const uploadPromises = entries.map(async (entry) => {
        // Simple parsing for price (extracting digits)
        const rawPrice = entry.price || "0";
        const numericPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 0;
        
        // Parsing location string: "State, District, Market"
        const locParts = (location || "").split(',').map(p => p.trim());

        const payload = {
          item_name: entry.item || "Unknown Item",
          location_name: locParts[2] || locParts[0] || "Unknown Location",
          district: locParts[1] || "Unknown District",
          state: locParts[0] || "Unknown State",
          price: numericPrice,
          distance_miles: 0.0
        };

        console.log("Sending payload:", payload);

        const response = await fetch(`/api/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? {'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.text().catch(() => "Unknown error");
          console.error("Upload failed for item:", entry.item, "Status:", response.status, "Error:", errorData);
          throw new Error(`Failed to upload ${entry.item}: ${response.statusText}`);
        }
        
        return response.json();
      });

      await Promise.all(uploadPromises);
      console.log("All uploads completed successfully");
      toast.success("All price details uploaded successfully!");
      
      // Reset form on success
      setEntries([{ id: Date.now(), item: "", price: "" }]);
      setLocation("");
    } catch (error) {
      console.error("Catastrophic upload error:", error);
      const message = error instanceof Error ? error.message : "Failed to upload data";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Fill in the details below to upload.</p>

      <form
        className="mt-8 space-y-6"
        onSubmit={handleSubmit}
        /* Old placeholder logic:
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => setLoading(false), 1200);
        }}
        */
      >
        <Field 
          label="Location" 
          icon={MapPin} 
          placeholder="Enter Location (State, District, Market)" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Items</h3>
            <button
              type="button"
              onClick={addEntry}
              className="flex items-center gap-1.5 rounded-lg bg-mint-soft px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground transition-transform hover:scale-105"
            >
              <Plus className="h-3 w-3" /> Add Item
            </button>
          </div>

          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div 
                key={entry.id} 
                className="group relative grid grid-cols-1 items-end gap-4 rounded-3xl border border-border/50 bg-muted/10 p-6 transition-colors hover:bg-muted/20 md:grid-cols-[1fr_1fr_auto]"
              >
                <Field
                  label="Grocery Item"
                  icon={Package}
                  placeholder="e.g., Rice, Tea"
                  value={entry.item}
                  onChange={(e) => updateEntry(entry.id, "item", e.target.value)}
                  className="flex-1"
                />
                <Field
                  label="Price (Modal)"
                  icon={IndianRupee}
                  placeholder="e.g., 80-120/kg"
                  value={entry.price}
                  onChange={(e) => updateEntry(entry.id, "price", e.target.value)}
                  className="flex-1"
                />
                
                <div className={cn("flex justify-end pt-2 md:pt-0", index === 0 && "hidden md:flex md:invisible")}>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeEntry(entry.id)}
                      className="flex h-[50px] w-full items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500 md:w-[50px]"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-cta group flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-semibold uppercase tracking-wider"
        >
          {loading ? "Uploading..." : "Upload Data"}
          <Upload className="h-4 w-4 transition-transform group-hover:translate-y-[-2px]" />
        </button>
      </form>
    </div>
  );
}
