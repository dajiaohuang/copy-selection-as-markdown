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
  window.history.replaceState(null, "", "/?x=1&y=2");
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
      text: '[A & B <i>italic</i> "quoted"](http://localhost/?x=1&y=2)\n\n> hello',
      html: '<a href="http://localhost/?x=1&amp;y=2">A &amp; B &lt;i&gt;italic&lt;/i&gt; &quot;quoted&quot;</a><br><br><blockquote><p>hello</p></blockquote>',
    },
  ]);
});
