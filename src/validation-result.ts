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
  public get success() {
    return this.error === undefined;
  }

  /**
   * @param error - error message
   */
  constructor(error?: T) {
    this.error = error;
  }

  /**
   * Initializes a successful result.
   *
   * @returns - successful result
   */
  static passed<T>() {
    return new ValidationResult<T>();
  }

  /**
   * Initializes a failed result.
   *
   * @param error - error message
   * @returns - failed result
   */
  static failed<T>(error: T) {
    return new ValidationResult<T>(error);
  }
}

export default ValidationResult;
