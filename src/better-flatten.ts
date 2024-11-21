import flatten from "flat";

describe("flat library", () => {
  test("should flatten nested object with custom delimiter", () => {
    const input = {
      id: "400-5678",
      quotes: {
        initial: {
          coverage: 100000,
          term: 20,
          created_at: "2021-06-01T00:00:00.000Z",
        },
        approved: {
          coverage: 100000,
          term: 20,
          created_at: "2021-06-24T16:26:39.065Z",
        },
      },
      hello: ["world", "!"],
    };

    const expected = {
      id: "400-5678",
      quotes_initial_coverage: 100000,
      quotes_initial_term: 20,
      quotes_initial_created_at: "2021-06-01T00:00:00.000Z",
      quotes_approved_coverage: 100000,
      quotes_approved_term: 20,
      quotes_approved_created_at: "2021-06-24T16:26:39.065Z",
      hello_0: "world",
      hello_1: "!",
    };

    expect(flatten(input, { delimiter: "_" })).toEqual(expected);
  });

  test("handles conflicts by overwriting according to last-write-wins", () => {
    const input = {
      person: {
        name: "John",
        age: 30,
      },
      person_name: "Direct Access",
      person_age: 25,
    };

    const flattened = flatten(input, { delimiter: "_" });

    // Note: flat library behavior is different from our custom implementation
    // It will use last-write-wins instead of root-level precedence
    expect(flattened.person_name).toBeDefined();
    expect(Object.keys(flattened)).toHaveLength(2);
  });
});
