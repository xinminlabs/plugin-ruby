const { long, ruby } = require("./utils");

describe.each(["while", "until"])("%s", keyword => {
  test("aligns predicates", () =>
    expect(`foo ${keyword} ${long} || ${long}`).toChangeFormat(
      ruby(`
      foo ${keyword} ${long} ||
        ${long}
    `)
    ));

  test("transforms to inline", () =>
    expect(`${keyword} a\n  1\nend`).toMatchFormat());

  test("maintains inlines", () => expect(`1 ${keyword} a`).toMatchFormat());

  test("breaks on large predicates", () =>
    expect(`${keyword} ${long}\n  1\nend`).toMatchFormat());

  test("breaks inlines on large predicates", () =>
    expect(`1 ${keyword} ${long}`).toMatchFormat());

  test("does not break into block when modifying a begin", () => {
    const content = ruby(`
      begin
        foo
      end ${keyword} bar
    `);

    return expect(content).toMatchFormat();
  });

  test("breaks when an assignment is in the predicate", () => {
    const content = ruby(`
      ${keyword} (a = 1)
        a
      end
    `);

    return expect(content).toMatchFormat();
  });

  test("breaks when a multi assignment is in the predicate", () => {
    const content = ruby(`
      ${keyword} (a, b = 1, 2)
        a
      end
    `);

    return expect(content).toMatchFormat();
  });

  test("wraps single lines in parens when assigning", () =>
    expect(
      `hash[:key] = ${keyword} false do break :value end`
    ).toChangeFormat(ruby(`
      hash[:key] =
        ${keyword} false
          break :value
        end
    `)));

  test("empty body", () => {
    const content = ruby(`
      while foo
      end
    `);

    return expect(content).toChangeFormat("while foo; end");
  });

  test("empty body, long predicate", () => {
    const content = ruby(`
      while ${long}
      end
    `);

    return expect(content).toMatchFormat();
  });
});
