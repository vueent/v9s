/**
 * Returns `true` if the value type is `string`.
 *
 * @param value
 */
export function isString(value: any) {
  return typeof value === 'string';
}

/**
 * Returns `true` if the value type is `string`.
 *
 * @param value
 */
export function isNumber(value: any) {
  return typeof value === 'number';
}

/**
 * Returns `true` if the value type is `boolean`.
 *
 * @param value
 */
export function isBoolean(value: any) {
  return typeof value === 'boolean';
}

/**
 * Returns `true` if the value type is `object` and the value is not `null`.
 *
 * @param value
 */
export function isObject(value: any) {
  return typeof value === 'object' && value !== null;
}

/**
 * Returns `true` if the value is `null`.
 *
 * @param value
 */
export function isNull(value: any) {
  return value === null;
}

/**
 * Returns `true` if the value is not `undefined`.
 *
 * @param value
 */
export function isDefined(value: any) {
  return value !== undefined;
}

/**
 * Returns `true` if the value is `undefined`.
 *
 * @param value
 */
export function isUndefined(value: any) {
  return value === undefined;
}

/**
 * Returns `true` if the value is `null` or `undefined`.
 * @param value
 */
export function isNone(value: any) {
  return value === undefined || value === null;
}

/**
 * Returns `true` if the value is not `null` or `undefined`.
 *
 * @param value
 */
export function isNotNone(value: any) {
  return value !== undefined && value !== null;
}

/**
 * Returns `true` if the value is equal to the referenced value.
 *
 * @param reference - referenced value
 * @param value
 */
export function eq(reference: any, value: any) {
  return reference === value;
}

/**
 * Returns `true` if the value is not equal to the referenced value.
 *
 * @param reference - referenced value
 * @param value
 */
export function ne(reference: any, value: any) {
  return reference !== value;
}

/**
 * Returns `true` if the value is greater than the threshold.
 *
 * @param threshold - threshold value
 * @param value
 */
export function gt(threshold: number, value: any) {
  return threshold < value;
}

/**
 * Returns `true` if the value is greater than or equal to the threshold.
 *
 * @param threshold - threshold value
 * @param value
 */
export function gte(threshold: number, value: any) {
  return threshold <= value;
}

/**
 * Returns `true` if the value is less than the threshold.
 *
 * @param threshold - threshold value
 * @param value
 */
export function lt(threshold: number, value: any) {
  return value < threshold;
}

/**
 * Returns `true` if the value is less than or equal to the threshold.
 *
 * @param threshold - threshold value
 * @param value
 */
export function lte(threshold: number, value: any) {
  return value <= threshold;
}

/**
 * Returns `true` if the value is between minimum and maximum reference values, inclusive.
 *
 * @param minimum - minimal referenced value
 * @param maximum  - maximal referenced value
 * @param value
 */
export function between(minimum: number, maximum: number, value: any) {
  return minimum <= value && value <= maximum;
}

/**
 * Returns `true` if the length of the value is greater than or equal to the specified minimum length.
 *
 * @param length - minimum value length
 * @param value
 */
export function minLength(length: number, value: any) {
  return value?.length >= length;
}

/**
 * Returns `true` if the length of the value is less than or equal to the specified maximum length.
 *
 * @param length - maximum value length
 * @param value
 */
export function maxLength(length: number, value: any) {
  return value?.length <= length;
}

/**
 * Returns `true` if the length of the value is equal to the referenced length.
 *
 * @param length - referenced value length
 * @param value
 */
export function strictLength(length: number, value: any) {
  return value?.length === length;
}

/**
 * Returns `true` if the length of the value is between minimum and maximum lengths, inclusive.
 *
 * @param minimum - minimum value length
 * @param maximum - maximum value length
 * @param value
 */
export function lengthBetween(minimum: number, maximum: number, value: any) {
  return minimum <= value?.length && value?.length <= maximum;
}
