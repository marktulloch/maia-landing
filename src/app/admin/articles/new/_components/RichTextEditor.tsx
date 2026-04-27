"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef } from "react";

type RichTextEditorProps = {
  /** Initial HTML (e.g. when editing). */
  initialContent?: string;
  /** Placeholder when empty. */
  placeholder?: string;
  /** Called when content changes (HTML). */
  onChange?: (html: string) => void;
  /** Ref to read current HTML on submit (avoids lifting state). */
  contentRef?: React.MutableRefObject<string | null>;
  /** Optional id for the editable region (a11y). */
  id?: string;
};

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const setLink = useCallback(() => {
    const url = window.prompt("URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const setImage = useCallback(() => {
    const url = window.prompt("Image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-surface rounded-t-lg">
      <SelectHeading editor={editor} />
      <ToolbarDivider />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={toolbarBtnClass(editor.isActive("bold"))}
        title="Bold"
      >
        <span className="font-bold">B</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={toolbarBtnClass(editor.isActive("italic"))}
        title="Italic"
      >
        <span className="italic">I</span>
      </button>
      <ToolbarDivider />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={toolbarBtnClass(editor.isActive("bulletList"))}
        title="Bullet list"
      >
        <ListIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={toolbarBtnClass(editor.isActive("orderedList"))}
        title="Ordered list"
      >
        <OrderedListIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={toolbarBtnClass(editor.isActive("blockquote"))}
        title="Blockquote"
      >
        <QuoteIcon />
      </button>
      <ToolbarDivider />
      <button
        type="button"
        onClick={setLink}
        className={toolbarBtnClass(editor.isActive("link"))}
        title="Insert link"
      >
        Link
      </button>
      <button
        type="button"
        onClick={setImage}
        className={toolbarBtnClass(false)}
        title="Insert image by URL"
      >
        Image
      </button>
    </div>
  );
}

function SelectHeading({ editor }: { editor: Editor }) {
  const value =
    editor.getAttributes("heading").level === 1
      ? "h1"
      : editor.getAttributes("heading").level === 2
        ? "h2"
        : editor.getAttributes("heading").level === 3
          ? "h3"
          : "p";

  return (
    <select
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "p") editor.chain().focus().setParagraph().run();
        else editor.chain().focus().setHeading({ level: Number(v.slice(1)) as 1 | 2 | 3 }).run();
      }}
      className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
    >
      <option value="p">Paragraph</option>
      <option value="h1">Heading 1</option>
      <option value="h2">Heading 2</option>
      <option value="h3">Heading 3</option>
    </select>
  );
}

function ToolbarDivider() {
  return <span className="w-px h-5 bg-border mx-0.5" aria-hidden />;
}

function toolbarBtnClass(active: boolean) {
  return [
    "px-2 py-1.5 rounded text-sm transition-colors",
    active ? "bg-primary/15 text-primary" : "text-muted hover:text-foreground hover:bg-surface",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
  ].join(" ");
}

function ListIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

function OrderedListIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M5 8v.01M5 12v.01M5 16v.01" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z" />
    </svg>
  );
}

export function RichTextEditor({
  initialContent = "",
  placeholder = "Write your article…",
  onChange,
  contentRef,
  id,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded max-w-full h-auto" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "admin-editor-body min-h-[240px] px-4 py-3 text-foreground focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      contentRef && (contentRef.current = html);
      onChange?.(html);
    },
  });

  useEffect(() => {
    if (contentRef) contentRef.current = editor?.getHTML() ?? null;
  }, [editor, contentRef]);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} id={id} />
    </div>
  );
}
