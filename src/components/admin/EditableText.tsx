"use client";

type EditableTextProps = {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
  label?: string;
};

export default function EditableText({
  value,
  onChange,
  multiline = false,
  className = "",
  label,
}: EditableTextProps) {
  const shared = {
    className: `admin-editable-text ${multiline ? "is-multiline" : ""} ${className}`.trim(),
    value,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => onChange(event.target.value),
    "aria-label": label || "Editable text",
  };

  return multiline ? (
    <textarea {...shared} rows={4} />
  ) : (
    <input type="text" {...shared} />
  );
}
