const {
  breakParent,
  concat,
  group,
  ifBreak,
  indent,
  join,
  removeLines,
  softline
} = require("../../prettier");

function printBlockVar(path, opts, print) {
  const parts = ["|", removeLines(path.call(print, "body", 0))];

  // The second part of this node is a list of optional block-local variables
  if (path.getValue().body[1]) {
    parts.push("; ", join(", ", path.map(print, "body", 1)));
  }

  parts.push("| ");
  return concat(parts);
}

function printBlock(braces) {
  return function printBlockWithBraces(path, opts, print) {
    const [variables, statements] = path.getValue().body;
    const stmts =
      statements.type === "stmts" ? statements.body : statements.body[0].body;

    let doBlockBody = "";
    if (
      stmts.length !== 1 ||
      stmts[0].type !== "void_stmt" ||
      stmts[0].comments
    ) {
      doBlockBody = indent(concat([softline, path.call(print, "body", 1)]));
    }

    const doBlock = concat([
      braces ? " {" : " do",
      variables ? concat([" ", path.call(print, "body", 0)]) : "",
      doBlockBody,
      concat([softline, braces ? "}" : "end"])
    ]);

    // We can hit this next pattern if within the block the only statement is a
    // comment.
    if (
      stmts.length === 1 &&
      stmts[0].type === "void_stmt" &&
      stmts[0].comments
    ) {
      return concat([breakParent, doBlock]);
    }

    const blockReceiver = path.getParentNode().body[0];

    // If the parent node is a command node, then there are no parentheses
    // around the arguments to that command, so we need to break the block
    if (
      ["command", "command_call", "method_add_arg"].includes(blockReceiver.type)
    ) {
      return concat([breakParent, doBlock]);
    }

    const hasBody = stmts.some(({ type }) => type !== "void_stmt");
    const braceBlock = concat([
      " {",
      hasBody || variables ? " " : "",
      variables ? path.call(print, "body", 0) : "",
      path.call(print, "body", 1),
      hasBody ? " " : "",
      "}"
    ]);

    if (braces) {
      return group(ifBreak(doBlock, braceBlock));
    } else {
      return doBlock;
    }
  };
}

module.exports = {
  block_var: printBlockVar,
  brace_block: printBlock(true),
  do_block: printBlock(false)
};
