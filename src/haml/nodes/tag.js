const {
  align,
  concat,
  fill,
  group,
  hardline,
  ifBreak,
  indent,
  join,
  line,
  softline
} = require("../../prettier");

function getDynamicAttributes(header, attributes) {
  const pairs = attributes
    .slice(1, -2)
    .split(",")
    .map((pair) => pair.slice(1).split('" => '));

  const parts = [concat([pairs[0][0], "=", pairs[0][1]])];
  pairs.slice(1).forEach((pair) => {
    parts.push(line, concat([pair[0], "=", pair[1]]));
  });

  return group(concat(["(", align(header + 1, fill(parts)), ")"]));
}

function getHashValue(value, opts) {
  if (typeof value !== "string") {
    return value.toString();
  }

  // This is a very special syntax created by the parser to let us know that
  // this should be printed literally instead of as a string.
  if (value.startsWith("&")) {
    return value.slice(1);
  }

  const quote = opts.rubySingleQuote ? "'" : '"';
  return `${quote}${value}${quote}`;
}

function isValidHashLabel(key) {
  return key.match(/^[_A-Za-z]/) && !key.endsWith("=");
}

function getHashKey(key, opts) {
  let quoted = key;
  const joiner = isValidHashLabel(key) ? ":" : " =>";

  if (key.includes(":") || key.includes("-")) {
    const quote = opts.rubySingleQuote ? "'" : '"';
    quoted = `${quote}${key}${quote}`;
  }

  return `${isValidHashLabel(key) ? "" : ":"}${quoted}${joiner}`;
}

function getKeyValuePair(key, value, opts) {
  return `${getHashKey(key, opts)} ${getHashValue(value, opts)}`;
}

function getStaticAttributes(header, attributes, opts) {
  const keys = Object.keys(attributes).filter(
    (name) => !["class", "id"].includes(name)
  );

  const parts = [getKeyValuePair(keys[0], attributes[keys[0]], opts)];

  keys.slice(1).forEach((key) => {
    parts.push(",", line, getKeyValuePair(key, attributes[key], opts));
  });

  return group(concat(["{", align(header + 1, fill(parts)), "}"]));
}

function getAttributesObject(object, opts, level = 0) {
  if (typeof object !== "object") {
    return getHashValue(object, opts);
  }

  const boundary = level === 0 ? softline : line;
  const parts = Object.keys(object).map((key) =>
    concat([
      getHashKey(key, opts),
      " ",
      getAttributesObject(object[key], opts, level + 1)
    ])
  );

  return group(
    concat([
      "{",
      indent(group(concat([boundary, join(concat([",", line]), parts)]))),
      boundary,
      "}"
    ])
  );
}

function getHeader(value, opts) {
  const { attributes } = value;
  const parts = [];

  if (value.name !== "div") {
    parts.push(`%${value.name}`);
  }

  if (attributes.class) {
    parts.push(`.${attributes.class.replace(/ /g, ".")}`);
  }

  if (attributes.id) {
    parts.push(`#${attributes.id}`);
  }

  if (value.dynamic_attributes.new) {
    parts.push(
      getDynamicAttributes(parts.join("").length, value.dynamic_attributes.new)
    );
  }

  if (
    Object.keys(attributes).some((name) => name !== "class" && name !== "id")
  ) {
    parts.push(getStaticAttributes(parts.join("").length, attributes, opts));
  }

  if (value.dynamic_attributes.old) {
    if (parts.length === 0) {
      parts.push("%div");
    }

    if (typeof value.dynamic_attributes.old === "string") {
      parts.push(value.dynamic_attributes.old);
    } else {
      parts.push(getAttributesObject(value.dynamic_attributes.old, opts));
    }
  }

  if (value.object_ref) {
    if (parts.length === 0) {
      parts.push("%div");
    }
    parts.push(value.object_ref);
  }

  if (value.nuke_outer_whitespace) {
    parts.push(">");
  }

  if (value.nuke_inner_whitespace) {
    parts.push("<");
  }

  if (value.self_closing) {
    parts.push("/");
  }

  if (value.value) {
    const prefix = value.parse ? "= " : ifBreak("", " ");

    return group(
      concat([
        group(concat(parts)),
        indent(concat([softline, prefix, value.value]))
      ])
    );
  }

  // In case none of the other if statements have matched and we're printing a
  // div, we need to explicitly add it back into the array.
  if (parts.length === 0 && value.name === "div") {
    parts.push("%div");
  }

  return group(concat(parts));
}

// https://haml.info/docs/yardoc/file.REFERENCE.html#element-name-
function tag(path, opts, print) {
  const { children, value } = path.getValue();
  const header = getHeader(value, opts);

  if (children.length === 0) {
    return header;
  }

  return group(
    concat([
      header,
      indent(concat([hardline, join(hardline, path.map(print, "children"))]))
    ])
  );
}

module.exports = tag;
