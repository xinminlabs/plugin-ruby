const { concat } = require("../../prettier");

// This function is responsible for printing out regexp_literal nodes. They can
// either use the special %r literal syntax or they can use forward slashes. At
// the end of either of those they can have modifiers like m or x that have
// special meaning for the regex engine.
//
// We favor the use of forward slashes unless the regex contains a forward slash
// itself. In that case we switch over to using %r with braces.
function printRegexpLiteral(path, opts, print) {
  const node = path.getValue();
  const docs = path.map(print, "body");

  return concat([node.beging].concat(docs).concat(node.ending));
}

module.exports = {
  regexp_literal: printRegexpLiteral
};
