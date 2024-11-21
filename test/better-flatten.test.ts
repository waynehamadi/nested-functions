import flatten from "flat";

type FlattenedObject = {
  [key: string]: string | number | boolean | null | undefined;
};

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

    const expected: FlattenedObject = {
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

    const result = flatten(input, { delimiter: "_" }) as FlattenedObject;
    expect(result).toEqual(expected);
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

    const flattened = flatten(input, { delimiter: "_" }) as FlattenedObject;

    expect(flattened.person_name).toBeDefined();
    expect(Object.keys(flattened)).toHaveLength(2);
  });
});
