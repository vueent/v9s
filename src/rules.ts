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

export function isUndefined(value: any) {
  return value === undefined;
}

export function min(minimum: number, value: any) {
  return minimum <= value;
}

export function max(maximum: number, value: any) {
  return value <= maximum;
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
