const { concat } = require("../prettier");
const { makeList } = require("../utils");

module.exports = {
  regexp: makeList,
  regexp_literal: (path, opts, print) => {
    const [contents, ending] = path.map(print, "body");

    const useSlash = ending[0] == "/";
    const beginning = useSlash ? "/" : "%r{";
    const newEnding =
      (useSlash ? "/" : "}") + (ending.substring(1, ending.length) || "");
    const parts = [beginning].concat(contents).concat(newEnding);

    return concat(parts);
  }
};
