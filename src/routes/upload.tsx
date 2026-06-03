import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Logo } from "@/components/aura/Logo";
import { BackButton } from "@/components/aura/BackButton";
import { PageShell } from "@/components/aura/PageShell";
import { UploadForm } from "@/components/aura/UploadForm";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "Upload — AURA" }] }),
  component: UploadPage,
});

function UploadPage() {
  return (
    <PageShell>
      <div className="relative flex items-center justify-between">
        <BackButton to="/welcome" />
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <Logo />
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-12"
      >
        <UploadForm isAdmin={false} />
      </motion.div>
    </PageShell>
  );
}
