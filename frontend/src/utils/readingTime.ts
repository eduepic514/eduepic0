/**
 * Calculates estimated reading time for a given piece of text/HTML content.
 * Strips HTML tags before counting words.
 */
export const calculateReadingTime = (content: string, wordsPerMinute = 200): number => {
  if (!content) return 1;
  const plainText = content.replace(/<[^>]+>/g, " ");
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};
