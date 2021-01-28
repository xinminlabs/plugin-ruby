const {
  concat,
  group,
  ifBreak,
  indent,
  join,
  line,
  softline
} = require("../../prettier");
const { getTrailingComma, printEmptyCollection } = require("../../utils");

// Prints out a word that is a part of a special array literal that accepts
// interpolation. The body is an array of either plain strings or interpolated
// expressions.
function printArrayLiteralWord(path, opts, print) {
  return concat(path.map(print, "body"));
}

// Prints out a special array literal. Accepts the parts of the array literal as
// an argument, where the first element of the parts array is a string that
// contains the special start.
function printArrayLiteral(start, parts) {
  return group(
    concat([
      start,
      "[",
      indent(concat([softline, join(line, parts)])),
      concat([softline, "]"])
    ])
  );
}

const arrayLiteralStarts = {
  qsymbols: "%i",
  qwords: "%w",
  symbols: "%I",
  words: "%W"
};

// An array node is any literal array in Ruby. This includes all of the special
// array literals as well as regular arrays. If it is a special array literal
// then it will have one child that represents the special array, otherwise it
// will have one child that contains all of the elements of the array.
function printArray(path, opts, print) {
  const array = path.getValue();
  const args = array.body[0];

  // If there is no inner arguments node, then we're dealing with an empty
  // array, so we can go ahead and return.
  if (args === null) {
    return printEmptyCollection(path, opts, "[", "]");
  }

  // If we don't have a regular args node at this point then we have a special
  // array literal. In that case we're going to print out the body (which will
  // return to us an array with the first one being the start of the array) and
  // send that over to the printArrayLiteral function.
  if (!["args", "args_add_star"].includes(args.type)) {
    return path.call(
      (arrayPath) =>
        printArrayLiteral(
          arrayLiteralStarts[arrayPath.getValue().type],
          arrayPath.map(print, "body")
        ),
      "body",
      0
    );
  }

  // Here we have a normal array of any type of object with no special literal
  // types or anything.
  return group(
    concat([
      "[",
      indent(
        concat([
          softline,
          join(concat([",", line]), path.call(print, "body", 0)),
          getTrailingComma(opts) ? ifBreak(",", "") : ""
        ])
      ),
      softline,
      "]"
    ])
  );
}

module.exports = {
  array: printArray,
  word: printArrayLiteralWord
};
