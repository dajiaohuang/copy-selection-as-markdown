import { doCopy } from "../clipboard.js";
import {
  escapeHtml,
  escapeHtmlAttribute,
  escapeMarkdownLinkText,
} from "../utils/escape.js";

browser.runtime.onMessage.addListener(({ text, url }) =>
  doCopy(
    `[${escapeMarkdownLinkText(text)}](${url})`,
    `<a href="${escapeHtmlAttribute(url)}">${escapeHtml(text)}</a>`,
  ),
);
