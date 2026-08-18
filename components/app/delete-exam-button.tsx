"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiTrash2 } from "react-icons/fi";

export default function DeleteExamButton({
  examId,
  examName,
}: {
  examId: string;
  examName: string;
}) {
  const router = useRouter();

  const handleDelete = () => {
    toast.warning(`Delete ${examName}?`, {
      description: "This removes the exam from your preparation plan and can't be undone.",
      duration: 15000,
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const response = await fetch(`/api/exams/${examId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            toast.success("Exam deleted");
            router.refresh();
          } catch {
            toast.error("Failed to delete exam");
          }
        },
      },
      cancel: {
        label: "Keep exam",
        onClick: () => {},
      },
    });
  };

  return (
    <button
      onClick={handleDelete}
      aria-label={`Delete ${examName}`}
      title="Delete exam"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-error/10 hover:text-error transition"
    >
      <FiTrash2 className="w-4 h-4" aria-hidden="true" />
    </button>
  );
}
