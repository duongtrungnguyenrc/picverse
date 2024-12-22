import isPlainObject from "lodash.isplainobject";
import { Db } from "mongodb";

import { ComparatorResult } from "./types";

const version = "6.12.0";

export function shouldListenOnDb(v = version): boolean {
  const [major, minor, patch] = v.split(".").map((vn) => Number(vn));
  if (major === 3) {
    if (minor <= 5) {
      return true;
    }

    return minor === 6 && patch < 4;
  }

  return major < 4;
}

export function compare(object1: any, object2: any): boolean {
  let prop;
  let comp;
  let value1;
  let value2;
  let keys1 = 0;
  let keys2 = 0;

  // If objects are equal by identity stop testing
  if (object1 === object2) {
    return true;
  }

  // Falsey and plain objects with no properties are equivalent
  if (!object1 || !object2) {
    if (!object1 && !object2) {
      return true;
    }

    return !(object1 ? hasKeys(object1) : hasKeys(object2));
  }

  // Check both own and inherited properties, MongoDb doesn't care where the property was defined
  /* eslint-disable-next-line guard-for-in */
  for (prop in object1) {
    value1 = object1[prop];
    value2 = object2[prop];
    // If one object has one property not present in the other they are different
    if (prop in object2) {
      comp = compareBy(value1, value2);
      switch (comp) {
        case "object":
          // If both values are plain objects recursively compare its properties
          if (!compare(value1, value2)) {
            return false;
          }

          break;
        case "array":
          // If both values are arrays compare buffers and strings by content and every other value by identity
          if (!compareArrays(value1, value2)) {
            return false;
          }

          break;
        case "buffer":
          // If both values are buffers compare them by content
          if (Buffer.compare(value1, value2) !== 0) {
            return false;
          }

          break;
        default:
          // All other values are compared by identity
          if (value1 !== value2) {
            return false;
          }

          break;
      }

      keys1++;
    } else {
      return false;
    }
  }

  // Count all properties from the target object
  /* eslint-disable-next-line guard-for-in */
  for (prop in object2) {
    keys2++;
  }

  // If the target object has more properties than source they are different
  return keys1 === keys2;
}

export function compareArrays(array1: any[], array2: any[]): boolean {
  let value1;
  let value2;
  if (array1.length !== array2.length) {
    return false;
  }

  for (const [i, element] of array1.entries()) {
    value1 = element;
    value2 = array2[i];
    if (compareBy(value1, value2) === "buffer") {
      if (Buffer.compare(value1, value2) !== 0) {
        return false;
      }
    } else if (value1 !== value2) {
      return false;
    }
  }

  return true;
}

export function compareBy(object1: any, object2: any): ComparatorResult {
  if (isPlainObject(object1) && isPlainObject(object2)) {
    return "object";
  }

  if (Array.isArray(object1) && Array.isArray(object2)) {
    return "array";
  }

  if (Buffer.isBuffer(object1) && Buffer.isBuffer(object2)) {
    return "buffer";
  }

  // All values are compared by identity unless they are both arrays, buffers or plain objects
  return "identity";
}

export function hasKeys(object: any): boolean {
  /* eslint-disable-next-line guard-for-in, no-unreachable-loop */
  for (const prop in object) {
    // Stop testing if the object has at least one property
    return true;
  }

  return false;
}

export function compareUris(uri1, uri2): boolean {
  // Compare properties that are string values
  const stringProps = ["scheme", "username", "password", "database"];
  const diff = stringProps.find((prop) => uri1[prop] !== uri2[prop]);
  if (diff) {
    return false;
  }

  // Compare query parameter values
  if (!compare(uri1.options, uri2.options)) {
    return false;
  }

  const hosts1 = uri1.hosts;
  const hosts2 = uri2.hosts;
  // Check if both uris have the same number of hosts
  if (hosts1.length !== hosts2.length) {
    return false;
  }

  // Check if every host in one array is present on the other array no matter where is positioned
  for (const hostObject of hosts1) {
    if (!hosts2.some((h) => h.host === hostObject.host && h.port === hostObject.port)) {
      return false;
    }
  }

  return true;
}

export function getDatabase(object: any): Db {
  // If the object has a db property should be a mongoose connection instance
  // Mongo 2 has a db property but its a function. See issue #14
  if (object.db && typeof object.db !== "function") {
    return object.db;
  }

  // If it has a connection property with a db property on it is a mongoose instance
  if (object?.connection?.db) {
    return object.connection.db;
  }

  // If none of the above are true it should be a mongo database object
  return object;
}
