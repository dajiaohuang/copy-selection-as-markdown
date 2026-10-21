const htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const escapeHtml = (text) =>
  text.replace(/[&<>"']/g, (character) => htmlEscapes[character]);
