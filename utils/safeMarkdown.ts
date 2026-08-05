declare global {
  interface Window {
    marked: { parse: (markdown: string) => string };
  }
}

const escapeRawHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const neutralizeUnsafeLinkProtocols = (value: string): string =>
  value.replace(
    /\]\(\s*(?:javascript|vbscript|data):[^)]*\)/gi,
    '](#)',
  );

/**
 * Render model-generated Markdown while preventing raw HTML and common unsafe
 * link protocols from reaching dangerouslySetInnerHTML.
 */
export const renderSafeMarkdown = (markdown: string): string => {
  const escapedMarkdown = escapeRawHtml(markdown);
  const safeMarkdown = neutralizeUnsafeLinkProtocols(escapedMarkdown);
  return window.marked.parse(safeMarkdown);
};
