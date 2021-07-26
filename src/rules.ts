export function isString(value: any) {
  return typeof value === 'string';
}

export function isNumber(value: any) {
  return typeof value === 'number';
}

export function isBoolean(value: any) {
  return typeof value === 'boolean';
}

export function isObject(value: any) {
  return typeof value === 'object' && value !== null;
}

export function isNull(value: any) {
  return value === null;
}

export function isDefined(value: any) {
  return value !== undefined;
}

export function isUndefined(value: any) {
  return value === undefined;
}

export function isNone(value: any) {
  return value === undefined || value === null;
}

export function isNotNone(value: any) {
  return value !== undefined && value !== null;
}

export function eq(reference: any, value: any) {
  return reference === value;
}

export function ne(reference: any, value: any) {
  return reference !== value;
}

export function gt(threshold: number, value: any) {
  return threshold < value;
}

export function gte(threshold: number, value: any) {
  return threshold <= value;
}

export function lt(threshold: number, value: any) {
  return value < threshold;
}

export function lte(threshold: number, value: any) {
  return value <= threshold;
}

export function between(minimum: number, maximum: number, value: any) {
  return minimum <= value && value <= maximum;
}

export function minLength(length: number, value: any) {
  return value?.length >= length;
}

export function maxLength(length: number, value: any) {
  return value?.length <= length;
}

export function strictLength(length: number, value: any) {
  return value?.length === length;
}

export function lengthBetween(minimum: number, maximum: number, value: any) {
  return minimum <= value?.length && value?.length <= maximum;
}
