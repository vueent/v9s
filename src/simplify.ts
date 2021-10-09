import { Validator, CheckFunc } from './validator';

/**
 * Returns an error message or `true`.
 *
 * This function prevents to use a `true` value as an error.
 *
 * @param chain - {@link Validator} instance or {@link CheckFunc}
 * @returns - error message or `true`
 */
export function simplify<T>(chain: Validator<T> | CheckFunc<T>): (value: any, context?: any) => true | T {
  const check = typeof chain === 'function' ? chain : chain.check;

  return (value: any, context?: any) => {
    const error = check(value, context);

    return error === undefined ? true : error;
  };
}
