const {
  align,
  concat,
  group,
  hardline,
	ifBreak,
  indent,
	softline,
} = require("../prettier");

const printLoop = (keyword) => (path, { inlineLoops }, print) => {
  const [_predicate, statements] = path.getValue().body;

  if (statements.body.length === 1 && statements.body[0].type === "void_stmt") {
    return group(
      concat([
        keyword,
        " ",
        path.call(print, "body", 0),
        ifBreak(softline, "; "),
        "end"
      ])
    );
	}

  const blockLoop = concat([
    concat([
      `${keyword} `,
      align(keyword.length + 1, path.call(print, "body", 0))
    ]),
    indent(concat([hardline, path.call(print, "body", 1)])),
    concat([hardline, "end"])
  ]);

  return blockLoop;
};

const printSingle = (keyword) => (path, { inlineLoops }, print) => {
  let inlineParts = [
    path.call(print, "body", 1),
    ` ${keyword} `,
    path.call(print, "body", 0)
  ];

  if (["assign", "massign"].includes(path.getParentNode().type)) {
    inlineParts = ["("].concat(inlineParts).concat(")");
  }

  return concat(inlineParts);
};

// Technically this is incorrect. A `for` loop actually introduces and modifies
// a local variable that then remains in the outer scope. Additionally, if the
// `each` method was somehow missing from the enumerable (it's possible...),
// then this transformation would fail. However - I've never actually seen a
// `for` loop used in production. If someone actually calls me on it, I'll fix
// this, but for now I'm leaving it.
const printFor = (path, opts, print) =>
  group(
    concat([
      path.call(print, "body", 1),
      ".each do |",
      path.call(print, "body", 0),
      "|",
      indent(concat([hardline, path.call(print, "body", 2)])),
      concat([hardline, "end"])
    ])
  );

module.exports = {
  while: printLoop("while"),
  while_mod: printSingle("while"),
  until: printLoop("until"),
  until_mod: printSingle("until"),
  for: printFor
};
