import sanitizeHtml from 'sanitize-html';

export function sanitizeBigText(text: string) {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
    parser: { lowerCaseTags: true },
  });
}
