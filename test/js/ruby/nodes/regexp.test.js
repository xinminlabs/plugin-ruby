const { ruby } = require("../../utils");

describe("regexp", () => {
  test("basic", () => expect("/abc/").toMatchFormat());

  test("unnecessary braces", () => expect("%r{abc}").toMatchFormat());

  test("unnecessary slashes", () => expect("%r/abc/").toMatchFormat());

  test("unnecessary brackets", () => expect("%r[abc]").toMatchFormat());

  test("unnecessary parens", () => expect("%r(abc)").toMatchFormat());

  test("necessary braces", () => expect("%r{a/b/c}").toMatchFormat());

  test("interpolation", () => expect("/a#{inter}c/").toMatchFormat());

  test("modifiers", () => expect("/abc/i").toMatchFormat());

  test("braces and modifiers", () => expect("%r{a/b/c}mi").toMatchFormat());

  test("global interpolation", () => expect("/#$&/").toMatchFormat());

  test("do not change if { and / in regexp literal", () =>
    expect("%r(a{b/c)").toMatchFormat());

  test("do not change if } and / in regexp literal", () =>
    expect("%r[a}b/c]").toMatchFormat());

  test("parens with }", () => expect("%r(a}bc)").toMatchFormat());

  test("comments in regex", () => {
    const content = ruby(`
      /\\A
        [[:digit:]]+ # 1 or more digits before the decimal point
        (\\.         # Decimal point
        [[:digit:]]+ # 1 or more digits after the decimal point
        )? # The decimal point and following digits are optional
      \\Z/x
    `);

    return expect(content).toMatchFormat();
  });

  test("forces braces if could be ambiguous with space in command", () =>
    expect("foo %r{ bar}").toMatchFormat());

  test("forces braces if could be ambiguous with equals in command", () =>
    expect("foo %r{= bar}").toMatchFormat());

  test("do not force braces if space is in parens", () =>
    expect("foo(/ bar/)").toMatchFormat());
});
