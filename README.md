# Nested Object Flattener

This project demonstrates two approaches to flatten nested objects with underscore notation: a custom implementation and one using the established `flat` library.

## Installation

```bash
# Clone the repository
git clone git@github.com:waynehamadi/nested-functions.git
cd nested-functions

# Install dependencies
npm install
```

## Usage

### Custom Implementation

The custom implementation (`src/flatten.ts`) flattens nested objects with specific rules:

- Uses underscore (\_) as delimiter
- Handles arrays with index notation
- Strict conflict handling:
  - Root level fields take precedence in simple conflicts
  - Throws errors for complex nested conflicts
- Omits empty arrays and objects

```typescript
import { flattenObject } from "./src/flatten";

const input = {
  person: {
    name: "John",
    age: 30,
  },
  addresses: [
    {
      street: "Main St",
    },
  ],
};

const flattened = flattenObject(input);
// Result:
// {
//   person_name: "John",
//   person_age: 30,
//   addresses_0_street: "Main St"
// }
```

### Recommended Approach: Using `flat` library

Instead of using the custom implementation, it's recommended to use the established `flat` library:

```typescript
import flatten from "flat";

const input = {
  person: {
    name: "John",
    age: 30,
  },
};

const flattened = flatten(input, { delimiter: "_" });
```

## Running Tests

```bash
# Run all tests
npm test

# Run only custom implementation tests
npm test flatten.test.ts

# Run only flat library tests
npm test better-flatten.test.ts
```

## Key Differences Between Implementations

1. **Conflict Handling**

```typescript
// Custom throws error:
const input = {
  user: {
    profile: { data: "nested" },
    profile_data: "mid-level",
  },
  user_profile_data: "top-level",
};

// This throws error with custom implementation
flattenObject(input); // Error: "Conflicting field names: user_profile_data appears multiple times"

// flat just overwrites:
flatten(input, { delimiter: "_" }); // Works fine, last value wins
```

2. **Empty Structures**

```typescript
const input = {
  emptyArr: [],
  emptyObj: {},
};

// Custom removes empty structures
flattenObject(input); // {}

// flat keeps them
flatten(input, { delimiter: "_" }); // { emptyArr: [], emptyObj: {} }
```

3. **Type Safety**

```typescript
// Custom is strictly typed
type Primitive = string | number | boolean | null | undefined;
type NestedObject = {
  [key: string]: Primitive | NestedObject | Array<any>;
};

// flat is more permissive with types
```

## Why Use `flat`?

While the custom implementation demonstrates interesting edge cases and strict type safety, for production use you should use the `flat` library because:

1. No need to maintain custom code
2. Better tested in production environments
3. Regular updates and bug fixes
4. Community support
5. Better performance

## Development

```bash
# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

## License

ISC
