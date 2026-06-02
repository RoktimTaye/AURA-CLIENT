import { createFileRoute } from "@tanstack/react-router";
import { UploadForm } from "@/components/aura/UploadForm";

export const Route = createFileRoute("/admin/upload")({
  // head: () => ({ meta: [{ title: "Upload — AURA Admin" }] }),
  component: () => <UploadForm isAdmin={true} title="Admin: Upload Data" />,
});
