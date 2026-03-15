"use server";

// AUTH (enforce here when connecting MAIA backend):
// The admin layout only hides the UI; it does NOT prevent direct calls to these actions.
// Add a guard at the top of each action: e.g. if (!isAdminAllowed()) redirect(routes.home);
// Replace isAdminAllowed() in src/lib/admin/guard.ts with real session + role checks.
//
// SAVE: Replace createArticle/updateArticle (local storage) with API calls to your backend/CMS.
import { createArticle, updateArticle, deleteArticle } from "@/lib/articles/store";
import type { CreateArticleInput, UpdateArticleInput } from "@/lib/articles/types";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export async function createArticleAction(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim() ?? "";
  const content = (formData.get("content") as string)?.trim() ?? "";
  // 3) IMAGE: Cover/image currently URL-only. Replace with file upload to MAIA/storage and store returned URL.
  const coverImage = (formData.get("coverImage") as string)?.trim() ?? "";
  const coverImageAlt = (formData.get("coverImageAlt") as string)?.trim() ?? "";
  const seoTitle = (formData.get("seoTitle") as string)?.trim() ?? "";
  const seoDescription = (formData.get("seoDescription") as string)?.trim() ?? "";
  const statusParam = formData.get("status") as string | null;
  const publishedCheckbox = formData.get("published") === "on";
  const published =
    statusParam === "published" || (statusParam === null && publishedCheckbox);

  if (!title) {
    redirect(`${routes.adminArticlesNew}?error=Title+is+required`);
  }
  if (!slug) {
    redirect(`${routes.adminArticlesNew}?error=Slug+is+required`);
  }
  const contentTrimmed = content.replace(/<p><\/p>/g, "").trim();
  if (!contentTrimmed) {
    redirect(`${routes.adminArticlesNew}?error=Content+is+required`);
  }

  const input: CreateArticleInput = {
    title,
    slug,
    excerpt,
    content,
    coverImage: coverImage || undefined,
    coverImageAlt: coverImageAlt || undefined,
    seoTitle: seoTitle || undefined,
    seoDescription: seoDescription || undefined,
    status: published ? "published" : "draft",
  };
  await createArticle(input);
  redirect(routes.adminArticles);
}

export async function updateArticleAction(id: string, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim() ?? "";
  const content = (formData.get("content") as string)?.trim() ?? "";
  const published = formData.get("published") === "on";

  if (!title) {
    redirect(`${routes.adminArticleEdit(id)}?error=Title+is+required`);
  }

  const coverImageAlt = (formData.get("coverImageAlt") as string)?.trim() ?? "";
  const data: UpdateArticleInput = {
    title,
    ...(slug ? { slug } : {}),
    excerpt,
    content,
    coverImageAlt: coverImageAlt || undefined,
    status: published ? "published" : "draft",
  };
  const updated = await updateArticle(id, data);
  if (!updated) {
    redirect(`${routes.adminArticles}?error=Article+not+found`);
  }
  redirect(routes.adminArticles);
}

export async function deleteArticleAction(id: string) {
  const removed = await deleteArticle(id);
  if (!removed) {
    redirect(`${routes.adminArticles}?error=Article+not+found`);
  }
  redirect(routes.adminArticles);
}
