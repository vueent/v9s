export class ValidationResult<T> {
  public readonly error?: T;

  public get passed() {
    return this.error === undefined;
  }

  constructor(error?: T) {
    this.error = error;
  }

  static passed<T>() {
    return new ValidationResult<T>();
  }

  static failed<T>(error: T) {
    return new ValidationResult<T>(error);
  }
}

export default ValidationResult;
