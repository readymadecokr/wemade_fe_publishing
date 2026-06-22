/**
 * Simple markdown-like content renderer for news/notice detail pages.
 * Supports: **Bold heading** lines, - bullet lists, 1. numbered lists, plain paragraphs.
 */
interface ContentRendererProps {
  content: string;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Bold heading: **Heading Text:**
    if (/^\*\*[^*]+\*\*$/.test(line.trim()) || /^\*\*[^*]+:\*\*$/.test(line.trim())) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-foreground mt-5 mb-2">
          {line.replace(/\*\*/g, "")}
        </h3>
      );
      i++;
      continue;
    }

    // Bullet list block
    if (line.trim().startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().replace(/^- /, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 text-muted-foreground text-sm mb-3 ml-2">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list block
    if (/^\d+\./.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\./.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s*/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 text-muted-foreground text-sm mb-3 ml-2">
          {items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Plain paragraph
    elements.push(
      <p key={i} className="text-muted-foreground text-sm leading-relaxed mb-3">
        {line}
      </p>
    );
    i++;
  }

  return <div className="space-y-0">{elements}</div>;
}
