type Props = {
  html: string;
  className?: string;
};

/** Renders trusted CMS HTML from TipTap (admin-authored only). */
export default function RichHtml({ html, className = "" }: Props) {
  return (
    <div
      className={`sucita-rich-html ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
