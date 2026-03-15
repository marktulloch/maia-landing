"use client";

import { deleteArticleAction } from "../actions";
import { useTransition } from "react";

type Props = { id: string; title: string };

export function DeleteArticleButton({ id, title }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
    startTransition(() => {
      deleteArticleAction(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-muted hover:text-red-600 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
