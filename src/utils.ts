import camelCase from "lodash.camelcase";
import isPlainObject from "lodash.isplainobject";
import { CamelCasedPropertiesDeep } from "type-fest";

const deepCamelCase = (
  obj: Record<string, any> | Array<Record<string, any>>
): CamelCasedPropertiesDeep<typeof obj> => {
  if (Array.isArray(obj)) {
    return obj.map((each) => deepCamelCase(each));
  }

  if (isPlainObject(obj)) {
    return Object.keys(obj).reduce(
      (acc, key) => ({
        ...acc,
        [camelCase(key)]: deepCamelCase(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

/**
 * Add quotes to keys in a JSON string
 * @param jsonString JSON string without quotes around keys
 * @returns {string}
 * @example
 * const jsonString = `{name: "John", age: 30}`;
 * const jsonStringWithQuotes = addJsonPropertyQuotes(jsonString);
 * console.log(jsonStringWithQuotes); // {"name": "John", "age": 30}
 *
 * @see [StackOverflow: Add double quotes to JSON keys](https://stackoverflow.com/questions/4843746/regular-expression-to-add-double-quotes-around-keys-in-javascript)
 */
const addJsonPropertyQuotes = (jsonString: string) =>
  jsonString.replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":');

/**
 * Remove quotes from keys in a JSON string
 * @param jsonString JSON string with quotes around keys
 * @returns {string}
 * @example
 * const jsonString = `{"name": "John", "age": 30}`;
 * const jsonStringWithoutQuotes = removeJsonPropertyQuotes(jsonString);
 * console.log(jsonStringWithoutQuotes); // {name: "John", age: 30}
 *
 * @see [StackOverflow: Remove quotes from keys](https://stackoverflow.com/questions/3651294/remove-quotes-from-keys-in-a-json-string-using-jquery)
 */
const removeJsonPropertyQuotes = (jsonString: string) =>
  jsonString.replace(/"(\w+)"\s*:/g, "$1:");

export const createFormattedJsonString = (jsonString: string) => {
  const jsonStringWithQuotes = addJsonPropertyQuotes(jsonString);
  const parsedJson = JSON.parse(jsonStringWithQuotes);
  const formattedJson = JSON.stringify(parsedJson, null, 2);
  const jsonStringWithoutQuotes = removeJsonPropertyQuotes(formattedJson);
  return jsonStringWithoutQuotes;
};
