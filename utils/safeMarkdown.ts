declare global {
  interface Window {
    marked?: { parse: (markdown: string) => string };
  }
}

const escapeRawHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const isSafeHref = (value: string): boolean => {
  const href = value.trim();
  if (!href) return false;

  if (
    href.startsWith('#') ||
    href.startsWith('/') ||
    href.startsWith('./') ||
    href.startsWith('../')
  ) {
    return true;
  }

  try {
    const url = new URL(href, window.location.origin);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol);
  } catch {
    return false;
  }
};

const sanitizeRenderedHtml = (html: string): string => {
  const document = new DOMParser().parseFromString(html, 'text/html');

  document.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href') ?? '';
    if (!isSafeHref(href)) {
      anchor.removeAttribute('href');
      return;
    }

    anchor.setAttribute('rel', 'noopener noreferrer nofollow');
  });

  // Model-generated Markdown does not need to load remote or data-URI images.
  document.querySelectorAll('img').forEach((image) => image.remove());

  return document.body.innerHTML;
};

/**
 * Render model-generated Markdown while preventing raw HTML, unsafe link
 * protocols, and remote image loading from reaching dangerouslySetInnerHTML.
 */
export const renderSafeMarkdown = (markdown: string): string => {
  const escapedMarkdown = escapeRawHtml(markdown);
  const parseMarkdown = window.marked?.parse;

  if (!parseMarkdown) {
    return escapedMarkdown.replace(/\r?\n/g, '<br>');
  }

  return sanitizeRenderedHtml(parseMarkdown(escapedMarkdown));
};
