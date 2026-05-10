import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackButton({ to = "/" }: { to?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      BACK
    </Link>
  );
}
