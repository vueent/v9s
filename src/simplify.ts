import Validator from './validator';

/**
 * Returns an unwrapped error message or `true`.
 *
 * It is necessary if you want to get a pure value instead of `ValidationResult`.
 *
 * @param v - {@link Validator} instance
 * @returns - unwrapped result
 */
export function simplify<T>(v: Validator<T>): (value: any, context?: any) => true | T {
  return (value: any, context?: any) => {
    const result = v.check(value, context);

    return result.passed ? true : (result.error as T);
  };
}
