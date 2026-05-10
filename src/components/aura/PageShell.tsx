import type { ReactNode } from "react";
import { GlowBackground } from "./GlowBackground";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full">
      <GlowBackground />
      <div className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 md:py-10">{children}</div>
    </div>
  );
}
