export interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Parses simple HTML content and extracts h2/h3 headings for building
 * an auto-generated Table of Contents with anchor links.
 */
export const extractHeadings = (html: string): Heading[] => {
  const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi;
  const headings: Heading[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]+>/g, "");
    const id = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
  }
  return headings;
};

/** Injects id attributes into h2/h3 tags so ToC anchors can scroll to them. */
export const injectHeadingIds = (html: string): string =>
  html.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (_full, level, attrs, text) => {
    const plain = text.replace(/<[^>]+>/g, "");
    const id = plain
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
  });
