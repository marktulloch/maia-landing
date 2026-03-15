"use client";

import Link from "next/link";
import { useRef, useState, useCallback, useTransition } from "react";
import { createArticleAction } from "../../actions";
import { routes } from "@/lib/routes";
import { RichTextEditor } from "./RichTextEditor";
import { slugFromTitle } from "@/lib/articles/slug";

const inputClass =
  "w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted focus:ring-2 focus:ring-ring focus:border-transparent";
const labelClass = "block text-sm font-medium text-foreground mb-1";

export function NewArticleForm() {
  const [isPending, startTransition] = useTransition();
  const contentRef = useRef<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [slugValue, setSlugValue] = useState("");

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setTitleValue(title);
    if (!slugTouched) setSlugValue(slugFromTitle(title));
  }, [slugTouched]);

  const handleSlugBlur = useCallback(() => setSlugTouched(true), []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);

      const title = (formData.get("title") as string)?.trim();
      const slug = (formData.get("slug") as string)?.trim();
      const content = (contentRef.current ?? "").trim();

      if (!title) {
        form.querySelector<HTMLInputElement>('[name="title"]')?.focus();
        return;
      }
      if (!slug) {
        form.querySelector<HTMLInputElement>('[name="slug"]')?.focus();
        return;
      }
      if (!content || content === "<p></p>") {
        return;
      }

      formData.set("content", content);
      startTransition(() => {
        createArticleAction(formData);
      });
    },
    []
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className={labelClass}>
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={titleValue}
          onChange={handleTitleChange}
          className={inputClass}
          placeholder="Article title"
        />
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>
          Slug *
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slugValue}
          onChange={(e) => setSlugValue(e.target.value)}
          onBlur={handleSlugBlur}
          className={inputClass}
          placeholder="url-slug"
        />
        <p className="mt-1 text-xs text-muted">Auto-generated from title; edit if needed.</p>
      </div>

      <div>
        <label htmlFor="excerpt" className={labelClass}>
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          className={inputClass}
          placeholder="Short summary for listings"
        />
      </div>

      <div>
        <label htmlFor="coverImage" className={labelClass}>
          Cover Image URL
        </label>
        <input
          id="coverImage"
          name="coverImage"
          type="url"
          className={inputClass}
          placeholder="https://…"
        />
        {/* TODO: Replace with real file upload to MAIA/storage when backend is available. */}
      </div>

      <div>
        <label htmlFor="coverImageAlt" className={labelClass}>
          Cover Image Alt Text
        </label>
        <input
          id="coverImageAlt"
          name="coverImageAlt"
          type="text"
          className={inputClass}
          placeholder="Describe the image for SEO and accessibility"
        />
      </div>

      <div>
        <label htmlFor="seoTitle" className={labelClass}>
          SEO Title
        </label>
        <input
          id="seoTitle"
          name="seoTitle"
          type="text"
          className={inputClass}
          placeholder="Optional; defaults to article title"
        />
      </div>

      <div>
        <label htmlFor="seoDescription" className={labelClass}>
          SEO Description
        </label>
        <textarea
          id="seoDescription"
          name="seoDescription"
          rows={2}
          className={inputClass}
          placeholder="Optional; used for search and social"
        />
      </div>

      <div>
        <span className={labelClass}>Status</span>
        <div className="flex gap-4 mt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="status" value="draft" defaultChecked className="text-primary focus:ring-ring" />
            <span className="text-sm text-foreground">Draft</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="status" value="published" className="text-primary focus:ring-ring" />
            <span className="text-sm text-foreground">Published</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="content-editor" className={labelClass}>
          Content *
        </label>
        <RichTextEditor
          id="content-editor"
          placeholder="Write your article…"
          contentRef={contentRef}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          {isPending ? "Creating…" : "Create article"}
        </button>
        <Link
          href={routes.adminArticles}
          className="px-5 py-2.5 text-sm font-medium rounded-md border border-border text-foreground hover:bg-surface transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
