import Validator from './validator';

/**
 * Returns an error message or `true`.
 *
 * This function prevents to use a `true` value as an error.
 *
 * @param v - {@link Validator} instance
 * @returns - error message or `true`
 */
export function simplify<T>(v: Validator<T>): (value: any, context?: any) => true | T {
  return (value: any, context?: any) => {
    const error = v.check(value, context);

    return error === undefined ? true : error;
  };
}
