export type Primitive = string | number | boolean | null | undefined;
export type NestedObject = {
  [key: string]: Primitive | NestedObject | Array<any>;
};
export type FlattenedObject = {
  [key: string]: Primitive;
};

export function flattenObject(obj: NestedObject): FlattenedObject {
  const result: FlattenedObject = {};
  const seenKeys = new Set<string>();

  // Process root level first for precedence
  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined || typeof value !== "object") {
      result[key] = value;
      seenKeys.add(key);
    }
  });

  function processValue(current: any, prefix: string = ""): void {
    // Handle primitives
    if (
      current === null ||
      current === undefined ||
      typeof current !== "object"
    ) {
      if (!obj.hasOwnProperty(prefix)) {
        // Skip if root level exists
        if (seenKeys.has(prefix)) {
          throw new Error(
            `Conflicting field names: ${prefix} appears multiple times`
          );
        }
        result[prefix] = current;
        seenKeys.add(prefix);
      }
      return;
    }

    // Handle empty arrays and objects
    if (Array.isArray(current) && current.length === 0) return;
    if (!Array.isArray(current) && Object.keys(current).length === 0) return;

    // Process arrays
    if (Array.isArray(current)) {
      current.forEach((item, index) => {
        const newKey = prefix ? `${prefix}_${index}` : `${index}`;
        if (
          seenKeys.has(newKey) &&
          (!obj.hasOwnProperty(newKey) || newKey.split("_").length > 2)
        ) {
          throw new Error(
            `Conflicting field names: ${newKey} appears multiple times`
          );
        }
        processValue(item, newKey);
      });
      return;
    }

    // Process objects
    Object.entries(current).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}_${key}` : key;
      if (
        seenKeys.has(newKey) &&
        (!obj.hasOwnProperty(newKey) || newKey.split("_").length > 2)
      ) {
        throw new Error(
          `Conflicting field names: ${newKey} appears multiple times`
        );
      }
      processValue(value, newKey);
    });
  }

  // Process nested structures
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined && typeof value === "object") {
      processValue(value, key);
    }
  });

  return result;
}
