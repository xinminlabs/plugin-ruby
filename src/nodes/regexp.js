const { concat } = require("../prettier");
const { makeList } = require("../utils");

const regexpPair = { ">": "<", ")": "(", "]": "[", "}": "{" };

module.exports = {
  regexp: makeList,
  regexp_literal: (path, opts, print) => {
    const [contents, ending] = path.map(print, "body");

    const useSlash = ending[0] == "/";
    const beginning = regexpPair[ending[0]] || ending[0];
    const parts = [useSlash ? "/" : `%r${beginning}`]
      .concat(contents)
      .concat(ending);

    return concat(parts);
  }
};
