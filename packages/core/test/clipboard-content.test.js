import { jest } from "@jest/globals";

const copied = [];

jest.unstable_mockModule("../src/clipboard.js", () => ({
  doCopy: (text, html) => {
    copied.push({ text, html });
    return Promise.resolve();
  },
}));

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  copied.length = 0;
});

test("copies the page title as plain text and escaped HTML", async () => {
  document.title = 'A & B <i>italic</i> "quoted"';
  document.body.innerHTML = "<p>hello</p>";
  const range = document.createRange();
  range.selectNodeContents(document.body);
  const selection = document.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  await import("../src/content-scripts/copy.js");
  await flushPromises();

  expect(copied).toEqual([
    {
      text: '[A & B <i>italic</i> "quoted"](http://localhost/)\n\n> hello',
      html: '<a href="http://localhost/">A &amp; B &lt;i&gt;italic&lt;/i&gt; "quoted"</a><br><br><blockquote><p>hello</p></blockquote>',
    },
  ]);
});

test("copies a context menu link with escaped Markdown and HTML", async () => {
  let listener;
  browser.runtime = {
    onMessage: {
      addListener: (callback) => {
        listener = callback;
      },
    },
  };

  await import("../src/content-scripts/copy-link.js");
  await listener({
    text: "R&D [beta] `code`",
    url: "https://example.com/a_b?x=1&y=2",
  });

  expect(copied).toEqual([
    {
      text: "[R&D \\[beta\\] \\`code\\`](https://example.com/a_b?x=1&y=2)",
      html: '<a href="https://example.com/a_b?x=1&amp;y=2">R&amp;D [beta] `code`</a>',
    },
  ]);
});
