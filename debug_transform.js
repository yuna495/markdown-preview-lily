const { Transformer } = require('markmap-lib');
const transformer = new Transformer();

const markdown = `
# Heading 1
This is a paragraph under Heading 1.

- List item 1
- List item 2

## Heading 2
Another paragraph.
`;

const { root } = transformer.transform(markdown);
console.log(JSON.stringify(root, null, 2));
