import { flattenObject, NestedObject, FlattenedObject } from "../src/flatten";

describe("flattenObject", () => {
  test("should return empty object when input is empty", () => {
    const input: NestedObject = {};
    const expected: FlattenedObject = {};
    expect(flattenObject(input)).toEqual(expected);
  });

  test("should handle primitive values", () => {
    const input: NestedObject = {
      string: "value",
      number: 42,
      boolean: true,
      null: null,
      undefined: undefined,
    };
    expect(flattenObject(input)).toEqual(input);
  });

  test("should flatten one level of nesting", () => {
    const input: NestedObject = {
      person: {
        name: "John",
        age: 30,
      },
    };
    const expected: FlattenedObject = {
      person_name: "John",
      person_age: 30,
    };
    expect(flattenObject(input)).toEqual(expected);
  });

  test("should flatten multiple levels of nesting", () => {
    const input: NestedObject = {
      user: {
        address: {
          street: {
            name: "Main St",
            number: 123,
          },
        },
      },
    };
    const expected: FlattenedObject = {
      user_address_street_name: "Main St",
      user_address_street_number: 123,
    };
    expect(flattenObject(input)).toEqual(expected);
  });

  test("should handle arrays with index notation", () => {
    const input: NestedObject = {
      arr: ["a", "b", "c"],
    };
    const expected: FlattenedObject = {
      arr_0: "a",
      arr_1: "b",
      arr_2: "c",
    };
    expect(flattenObject(input)).toEqual(expected);
  });

  test("should handle nested arrays and objects", () => {
    const input: NestedObject = {
      users: [{ name: "John" }, { name: "Jane" }],
    };
    const expected: FlattenedObject = {
      users_0_name: "John",
      users_1_name: "Jane",
    };
    expect(flattenObject(input)).toEqual(expected);
  });

  test("should handle the provided complex example", () => {
    const input: NestedObject = {
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

    expect(flattenObject(input)).toEqual(expected);
  });

  test("should handle empty arrays and objects", () => {
    const input: NestedObject = {
      emptyArr: [],
      emptyObj: {},
      nested: {
        emptyArr: [],
        emptyObj: {},
      },
    };
    const expected: FlattenedObject = {};
    expect(flattenObject(input)).toEqual(expected);
  });

  test("should handle null and undefined values", () => {
    const input: NestedObject = {
      nullValue: null,
      undefinedValue: undefined,
      nested: {
        nullValue: null,
        undefinedValue: undefined,
      },
    };
    const expected: FlattenedObject = {
      nullValue: null,
      undefinedValue: undefined,
      nested_nullValue: null,
      nested_undefinedValue: undefined,
    };
    expect(flattenObject(input)).toEqual(expected);
  });

  test("should throw error on field name conflicts", () => {
    const input: NestedObject = {
      user: {
        profile: {
          data: "nested data",
        },
        profile_data: "mid-level data",
      },
      user_profile: {
        data: "another nested data",
      },
      user_profile_data: "top-level data",
    };

    expect(() => flattenObject(input)).toThrow(
      "Conflicting field names: user_profile_data appears multiple times"
    );
  });

  test("should throw error on field name conflicts with arrays", () => {
    const input: NestedObject = {
      users: [
        {
          profile: {
            data: "nested array data",
          },
        },
      ],
      users_0_profile_data: "direct conflict with array nested data",
    };

    expect(() => flattenObject(input)).toThrow(
      "Conflicting field names: users_0_profile_data appears multiple times"
    );
  });
});
