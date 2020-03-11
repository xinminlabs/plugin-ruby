const {
  align,
  breakParent,
  concat,
  hardline,
  group,
  ifBreak,
  indent,
  softline
} = require("../prettier");
const { containsAssignment } = require("../utils");

const printWithAddition = (keyword, path, print, { breaking = false } = {}) =>
  concat([
    `${keyword} `,
    align(keyword.length + 1, path.call(print, "body", 0)),
    indent(concat([softline, path.call(print, "body", 1)])),
    concat([softline, path.call(print, "body", 2)]),
    concat([softline, "end"]),
    breaking ? breakParent : ""
  ]);

// For the unary `not` operator, we need to explicitly add parentheses to it in
// order for it to be valid from within a ternary. Otherwise if the clause of
// the ternary isn't a unary `not`, we can just pass it along.
const printTernaryClause = clause => {
  if (clause.type === "concat") {
    const [part] = clause.parts;

    if (part.type === "concat" && part.parts[0] === "not") {
      // We are inside of a statements list and the statement is a unary `not`.
      return concat(["not(", part.parts[2], ")"]);
    }

    if (clause.parts[0] === "not") {
      // We are inside a ternary condition and the clause is a unary `not`.
      return concat(["not(", clause.parts[2], ")"]);
    }
  }

  return clause;
};

// The conditions for a ternary look like `foo : bar` where `foo` represents
// the truthy clause and `bar` represents the falsy clause. In the case that the
// parent node is an `unless`, these have to flip in order.
const printTernaryClauses = (keyword, truthyClause, falsyClause) => {
  const parts = [
    printTernaryClause(truthyClause),
    " : ",
    printTernaryClause(falsyClause)
  ];

  return keyword === "if" ? parts : parts.reverse();
};

// Handles ternary nodes. If it does not fit on one line, then we break out into
// an if/else statement. Otherwise we remain as a ternary.
const printTernary = (path, _opts, print) => {
  const [predicate, truthyClause, falsyClause] = path.map(print, "body");
  const ternaryClauses = printTernaryClauses("if", truthyClause, falsyClause);

  return group(
    ifBreak(
      concat([
        predicate,
        " ? ",
        indent(concat([softline, truthyClause])),
        " : ",
        indent(concat([softline, falsyClause]))
      ]),
      concat([predicate, " ? "].concat(ternaryClauses))
    )
  );
};

const makeSingleBlockForm = (keyword, path, print) =>
  concat([
    `${keyword} `,
    align(keyword.length + 1, path.call(print, "body", 0)),
    indent(concat([hardline, path.call(print, "body", 1)])),
    concat([hardline, "end"])
  ]);

// Prints an `if_mod` or `unless_mod` node. Because it was previously in the
// modifier form, we're guaranteed to not have an additional node, so we can
// just work with the predicate and the body.
const printSingle = keyword => (path, opts, print) => {
  const [_predicate, stmts] = path.getValue().body;

  return concat([
    path.call(print, "body", 1),
    ` ${keyword} `,
    path.call(print, "body", 0)
  ]);
};

// A normalized print function for both `if` and `unless` nodes.
const printConditional = keyword => (path, opts, print) => {
  const [predicate, statements, addition] = path.getValue().body;

  // If there's an additional clause that wasn't matched earlier, we know we
  // can't go for the inline option.
  if (addition) {
    return group(printWithAddition(keyword, path, print, { breaking: true }));
  }

  // If the body of the conditional is empty, then we explicitly have to use the
  // block form.
  if (statements.type === "stmts" && statements.body[0].type === "void_stmt") {
    return concat([
      `${keyword} `,
      align(keyword.length + 1, path.call(print, "body", 0)),
      concat([hardline, "end"])
    ]);
  }

  return makeSingleBlockForm(keyword, path, print);
};

module.exports = {
  else: (path, opts, print) => {
    const stmts = path.getValue().body[0];

    return concat([
      stmts.body.length === 1 && stmts.body[0].type === "command"
        ? breakParent
        : "",
      "else",
      indent(concat([softline, path.call(print, "body", 0)]))
    ]);
  },
  elsif: (path, opts, print) => {
    const [_predicate, _statements, addition] = path.getValue().body;
    const parts = [
      group(
        concat([
          "elsif ",
          align("elsif".length - 1, path.call(print, "body", 0))
        ])
      ),
      indent(concat([hardline, path.call(print, "body", 1)]))
    ];

    if (addition) {
      parts.push(group(concat([hardline, path.call(print, "body", 2)])));
    }

    return group(concat(parts));
  },
  if: printConditional("if"),
  ifop: printTernary,
  if_mod: printSingle("if"),
  unless: printConditional("unless"),
  unless_mod: printSingle("unless")
};
