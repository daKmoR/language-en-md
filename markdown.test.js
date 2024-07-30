import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { buildTag } from "bablr";
import { printPrettyCSTML } from "@bablr/agast-helpers/tree";

import * as language from "./markdown.js";

// import {
//   buildString,
//   buildBoolean,
//   buildNumber,
//   buildNull,
// } from "@bablr/agast-vm-helpers";

let enhancers = undefined;
const md = (...args) =>
  printPrettyCSTML(buildTag(language, "Root", undefined, enhancers)(...args));

describe("markdown", () => {
  it("headline # main", () => {
    treeEqual(
      md`
        # main
      `,
      `
        <Heading>
          level:
          <*HeadingLevel depth=1>
            '# '
          </>
          text:
          <*Literal>
            'main'
          </>
        </>
      `
    );
  });

  it("headline ## second", () => {
    treeEqual(
      md`
        ## second
      `,
      `
        <Heading>
          level:
          <*HeadingLevel depth=2>
            '## '
          </>
          text:
          <*Literal>
            'second'
          </>
        </>
      `
    );
  });

  it("paragraph", () => {
    treeEqual(
      md`
        hello world
      `,
      `
        <Paragraph>
          children[]:
          <*Literal>
            'hello world'
          </>
        </>
      `
    );
  });

  it("headline # followed by paragraph text", () => {
    treeEqual(
      md`
        # followed by

        paragraph text
      `,
      `
        <Heading>
          <*HeadingLevel depth=1>
            '# '
          </>
          <*Literal>
            'followed by'
          </>
        </>
        <Paragraph>
          children[]:
          <*Literal>
            'paragraph text'
          </>
        </>
      `
    );
  });
});

function treeEqual(actual, expected) {
  const expectedLines = expected.split("\n");
  const expectedIndentation = expectedLines[1].match(/^ */)[0].length;
  const expectedContent = expectedLines.map((line) =>
    line.slice(expectedIndentation)
  );
  expectedContent.shift();
  expectedContent.pop();

  const wrapped = [
    "<!0:cstml bablr-language='https://bablr.org/languages/markdown'>",
    "<>",
    "  <#*Space:Space>",
    "    '\\n        '",
    "  </>",
    "  <Root>",
    "    children[]:",
    ...expectedContent.map((line) => `    ${line}`),
    "  </>",
    "  <#*Space:Space>",
    "    '\\n      '",
    "  </>",
    "</>",
    "",
  ];
  return assert.deepEqual(actual, wrapped.join("\n"));
  //   return `<!0:cstml bablr-language='https://bablr.org/languages/markdown'>
  // <>
  //   <Root>
  //     ${content.split('\n').join('\n    ')}
  //   </>
  // </>
  // `
}
