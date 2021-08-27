import { Validator, CheckFunc } from './validator';

/**
 * Successful or failed validation result.
 */
export class ValidationResult<T> {
  /**
   * Error message.
   */
  public readonly error?: T;

  /**
   * Validation result state.
   */
  public readonly success: boolean;

  constructor(error?: T) {
    this.error = error;
    this.success = error === undefined;
  }
}

/**
 * Returns an instance of {@link ValidationResult} instead of pure error message or `undefined`.
 *
 * @param chain - {@link Validator} instance or {@link CheckFunc}
 * @returns - {@link ValidationResult} instance
 */
export function objectify<T>(chain: Validator<T> | CheckFunc<T>): (value: any, context?: any) => ValidationResult<T> {
  const check = typeof chain === 'function' ? chain : chain.check;

  return (value: any, context?: any) => {
    const error = check(value, context);

    return error === undefined ? new ValidationResult<T>() : new ValidationResult<T>(error);
  };
}
