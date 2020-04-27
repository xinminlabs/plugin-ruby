const {
  concat,
  group,
  ifBreak,
  indent,
  join,
  line,
  softline
} = require("../prettier");

const { docLength, makeList, makeArgs } = require("../utils");

const MAX_NOT_WRAP_LINE_ARGS_LENGTH = 20;
const shouldWrapLine = (args) =>
  args.reduce((sum, arg) => sum + docLength(arg), 0) >
    MAX_NOT_WRAP_LINE_ARGS_LENGTH ||
  (args.length == 1 &&
    args[0].type === "group" &&
    docLength(args[0]) > MAX_NOT_WRAP_LINE_ARGS_LENGTH) ||
  (args[0].type === "concat" &&
    args[0].parts.some((part) => part.type === "group"));

module.exports = {
  arg_paren: (path, opts, print) => {
    if (path.getValue().body[0] === null) {
      return "";
    }

    // Here we can skip the entire rest of the method by just checking if it's
    // an args_forward node, as we're guaranteed that there are no other arg
    // nodes.
    if (path.getValue().body[0].type === "args_forward") {
      return "(...)";
    }

    const { addTrailingCommas } = opts;
    const { args, heredocs } = makeArgs(path, opts, print, 0);

    const argsNode = path.getValue().body[0];
    const hasBlock = argsNode.type === "args_add_block" && argsNode.body[1];

    if (heredocs.length > 1) {
      return concat(["(", join(", ", args), ")"].concat(heredocs));
    }

    let parenDoc;
    if (shouldWrapLine(args)) {
      parenDoc = group(
        concat([
          "(",
          indent(
            concat([
              softline,
              join(concat([",", line]), args),
              addTrailingCommas && !hasBlock ? ifBreak(",", "") : ""
            ])
          ),
          concat([softline, ")"])
        ])
      );
    } else {
      parenDoc = group(
        concat([
          "(",
          indent(
            concat([
              join(concat([",", line]), args),
              addTrailingCommas && !hasBlock ? ifBreak(",", "") : ""
            ])
          ),
          ")"
        ])
      );
    }

    if (heredocs.length === 1) {
      return group(concat([parenDoc].concat(heredocs)));
    }

    return parenDoc;
  },
  args: makeList,
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
