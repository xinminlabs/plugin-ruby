const { long, ruby } = require("../../utils");

describe.each(["while", "until"])("%s", (keyword) => {
  test("aligns predicates", () =>
    expect(`foo ${keyword} ${long} || ${long}`).toChangeFormat(
      ruby(`
        foo ${keyword} ${long} ||
          ${long}
      `)
    ));

  describe("inlines allowed", () => {
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

    test("breaks the parent when there is an assignment", () => {
      const content = ruby(`
        foo do
          while foo = foo
            yield foo
          end
        end
      `);

      return expect(content).toMatchFormat();
    });

    test("wraps single lines in parens when assigning", () =>
      expect(
        `hash[:key] = ${keyword} false do break :value end`
      ).toChangeFormat(
        ruby(`
        hash[:key] =
          ${keyword} false
            break :value
          end
      `)
      ));

    test("empty body", () => {
      const content = ruby(`
        while foo
        end
      `);

      return expect(content).toMatchFormat();
    });

    test("empty body, long predicate", () => {
      const content = ruby(`
        while ${long}
        end
      `);

      return expect(content).toMatchFormat();
    });
  });

  describe("inlines not allowed", () => {
    test("maintains multiline", () =>
      expect(`${keyword} a\n  1\nend`).toMatchFormat());

    test("transforms to multiline", () =>
      expect(`1 ${keyword} a`).toMatchFormat());

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

    test("empty body", () => {
      const content = ruby(`
        while foo
        end
      `);

      return expect(content).toMatchFormat();
    });

    test("empty body, long predicate", () => {
      const content = ruby(`
        while ${long}
        end
      `);

      return expect(content).toMatchFormat();
    });
  });

  describe.each(["while", "until"])(
    "add parens when necessary %s",
    (keyword) => {
      test("args", () =>
        expect(`[${keyword} foo? do bar end]`).toChangeFormat(
          ruby(`
          [
            ${keyword} foo?
              bar
            end
          ]
        `)
        ));

      test("assign", () =>
        expect(`foo = ${keyword} bar? do baz end`).toChangeFormat(
          ruby(`
          foo =
            ${keyword} bar?
              baz
            end
        `)
        ));

      test("assoc_new", () =>
        expect(`{ foo: ${keyword} bar? do baz end }`).toChangeFormat(
          ruby(`
          {
            foo:
              ${keyword} bar?
                baz
              end
          }
        `)
        ));

      test("massign", () =>
        expect(`f, o, o = ${keyword} bar? do baz end`).toChangeFormat(
          ruby(`
          f, o, o =
            ${keyword} bar?
              baz
            end
        `)
        ));

      test("opassign", () =>
        expect(`foo ||= ${keyword} bar? do baz end`).toChangeFormat(
          ruby(`
          foo ||=
            ${keyword} bar?
              baz
            end
        `)
        ));
    }
  );

  // https://github.com/prettier/plugin-ruby/issues/759
  test("handles do keyword", () => {
    const content = ruby(`
      %w[foo bar].each do |resource|
        puts resource

        # comment comment
        ${keyword} @client.missing?(resource) do
          sleep 1
        end
      end
    `);

    const expected = ruby(`
      %w[foo bar].each do |resource|
        puts resource

        # comment comment
        ${keyword} @client.missing?(resource)
          sleep 1
        end
      end
    `);

    return expect(content).toChangeFormat(expected);
  });
});
