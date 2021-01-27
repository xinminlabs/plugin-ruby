const {
  concat,
  group,
  ifBreak,
  indent,
  join,
  line,
  softline
} = require("../../prettier");
const { getTrailingComma } = require("../../utils");

const noTrailingComma = ["command", "command_call"];

function getArgParenTrailingComma(node) {
  // If we have a block, then we don't want to add a trailing comma.
  if (node.type === "args_add_block" && node.body[1]) {
    return "";
  }

  // If we only have one argument and that first argument necessitates that we
  // skip putting a comma (because it would interfere with parsing the argument)
  // then we don't want to add a trailing comma.
  if (node.body.length === 1 && noTrailingComma.includes(node.body[0].type)) {
    return "";
  }

  return ifBreak(",", "");
}

function printArgParen(path, opts, print) {
  const argsNode = path.getValue().body[0];

  if (argsNode === null) {
    return "";
  }

  // Here we can skip the entire rest of the method by just checking if it's
  // an args_forward node, as we're guaranteed that there are no other arg
  // nodes.
  if (argsNode.type === "args_forward") {
    return group(
      concat([
        "(",
        indent(concat([softline, path.call(print, "body", 0)])),
        softline,
        ")"
      ])
    );
  }

  // Now here we return a doc that represents the whole grouped expression,
  // including the surrouding parentheses.
  return group(
    concat([
      "(",
      indent(
        concat([
          softline,
          join(concat([",", line]), path.call(print, "body", 0)),
          getTrailingComma(opts) && getArgParenTrailingComma(argsNode)
        ])
      ),
      softline,
      ")"
    ])
  );
}

function printArgs(path, opts, print) {
  const args = path.map(print, "body");

  return args;
}

module.exports = {
  arg_paren: printArgParen,
  args: printArgs,
  args_add_block: (path, opts, print) => {
    const parts = path.call(print, "body", 0);

    if (path.getValue().body[1]) {
      parts.push(concat(["&", path.call(print, "body", 1)]));
    }

    return parts;
  },
  args_add_star: (path, opts, print) => {
    const printed = path.map(print, "body");
    const parts = printed[0]
      .concat([concat(["*", printed[1]])])
      .concat(printed.slice(2));

    return parts;
  },
  blockarg: (path, opts, print) => concat(["&", path.call(print, "body", 0)])
};
