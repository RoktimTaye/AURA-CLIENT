import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link
      to={to}
      className={cn("flex items-center text-2xl font-semibold tracking-[0.3em] pl-[0.3em] text-foreground", className)}
    >
      A<span className="text-mint">U</span>RA
    </Link>
  );
}
