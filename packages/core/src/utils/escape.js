const escapeWith = (escapes) => (text) =>
  text.replace(/[&<>"]/g, (character) => escapes[character] || character);

export const escapeHtml = escapeWith({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
});

export const escapeHtmlAttribute = escapeWith({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
});

export const escapeMarkdownLinkText = (text) =>
  text.replace(/([\\`*_[\]<>])/g, "\\$1");
