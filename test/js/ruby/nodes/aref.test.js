const { long, ruby } = require("../../utils");

describe("aref", () => {
  test("literal reference", () => expect("array[5]").toMatchFormat());

  test("dynamic reference", () => expect("array[idx]").toMatchFormat());

  test("reference with comment", () =>
    expect("array[idx] # foo").toMatchFormat());

  test("literal assignment", () => expect("array[5] = 6").toMatchFormat());

  test("dynamic assignment", () => expect("array[idx] = 6").toMatchFormat());

  test("comments within assignment", () => {
    const contents = ruby(`
      array = %w[foo bar]
      array[1] = [
        # abc
        %w[abc]
      ]
    `);

    return expect(contents).toMatchFormat();
  });

  test("long reference", () => expect(`${long}[idx]`).toMatchFormat());
});
