"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { adminUploadFile } from "@/lib/content/adminClient";

type RichTextEditorProps = {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`sucita-rte-btn${active ? " is-active" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Write your content…",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastEmitted = useRef(content);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: { class: "sucita-rte-image" },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "sucita-rte-link" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      lastEmitted.current = html;
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: "sucita-rte-body ProseMirror",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (content === lastEmitted.current) return;
    if (editor.getHTML() === content) return;
    lastEmitted.current = content;
    editor.commands.setContent(content, { emitUpdate: false });
  }, [content, editor]);

  async function handleImageFile(file: File | undefined) {
    if (!file || !editor) return;
    try {
      const src = await adminUploadFile(file);
      editor.chain().focus().setImage({ src }).run();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const next = window.prompt("Link URL", previous || "https://");
    if (next === null) return;
    if (!next.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: next.trim() })
      .run();
  }

  if (!editor) {
    return <div className="sucita-rte-loading">Loading editor…</div>;
  }

  return (
    <div className="sucita-rte">
      <div className="sucita-rte-toolbar" role="toolbar" aria-label="Formatting">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="H3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <ToolbarButton
          label="List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Numbered"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink} />
        <ToolbarButton
          label="Image"
          onClick={() => fileInputRef.current?.click()}
        />
        <ToolbarButton
          label="Undo"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          label="Redo"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>
      <EditorContent editor={editor} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void handleImageFile(e.target.files?.[0])}
      />
    </div>
  );
}
