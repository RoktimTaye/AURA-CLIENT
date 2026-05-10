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
      <div className="flex items-center justify-between">
        <BackButton to="/welcome" />
        <Logo />
        <div className="w-12" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-12"
      >
        <UploadForm />
      </motion.div>
    </PageShell>
  );
}
