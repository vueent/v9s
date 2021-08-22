import Validator, { Rule, ErrorType, Message, Modifier } from './validator';

export { Rule, ErrorType, MessageFactory, Message, Modifier, Validator } from './validator';

export default {
  /**
   * Apply a rule to the instance an returns a new next chain link.
   *
   * @param rule - validation rule function
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  use<T = string, E extends ErrorType<T> = ErrorType<T>>(
    rule: Rule,
    message?: Message<T, E>,
    modifier?: Modifier
  ): Validator<T, E> {
    return new Validator<T, E>().use(rule, message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value type is `string`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  string<T = string, E extends ErrorType<T> = ErrorType<T>>(message?: Message<T, E>, modifier?: Modifier): Validator<T, E> {
    return new Validator<T, E>().string(message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value type is `number`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  number<T = string, E extends ErrorType<T> = ErrorType<T>>(message?: Message<T, E>, modifier?: Modifier): Validator<T, E> {
    return new Validator<T, E>().number(message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value type is `boolean`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  boolean<T = string, E extends ErrorType<T> = ErrorType<T>>(message?: Message<T, E>, modifier?: Modifier): Validator<T, E> {
    return new Validator<T, E>().boolean(message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value type is `object` and the value is not `null`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  object<T = string, E extends ErrorType<T> = ErrorType<T>>(message?: Message<T, E>, modifier?: Modifier): Validator<T, E> {
    return new Validator<T, E>().object(message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value is `null`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  null<T = string, E extends ErrorType<T> = ErrorType<T>>(message?: Message<T, E>, modifier?: Modifier): Validator<T, E> {
    return new Validator<T, E>().null(message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value is not `undefined`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  defined<T = string, E extends ErrorType<T> = ErrorType<T>>(message?: Message<T, E>, modifier?: Modifier): Validator<T, E> {
    return new Validator<T, E>().defined(message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value is `undefined`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  notDefined<T = string, E extends ErrorType<T> = ErrorType<T>>(message?: Message<T, E>, modifier?: Modifier): Validator<T, E> {
    return new Validator<T, E>().notDefined(message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value is `null` or `undefined`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  none<T = string, E extends ErrorType<T> = ErrorType<T>>(message?: Message<T, E>, modifier?: Modifier): Validator<T, E> {
    return new Validator<T, E>().none(message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value is not `null` or `undefined`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  notNone<T = string, E extends ErrorType<T> = ErrorType<T>>(message?: Message<T, E>, modifier?: Modifier): Validator<T, E> {
    return new Validator<T, E>().notNone(message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value is equal to the referenced value.
   *
   * @param reference - referenced value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  eq<T = string, E extends ErrorType<T> = ErrorType<T>>(
    reference: any,
    message?: Message<T, E>,
    modifier?: Modifier
  ): Validator<T, E> {
    return new Validator<T, E>().eq(reference, message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value is not equal to the referenced value.
   *
   * @param reference - referenced value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  ne<T = string, E extends ErrorType<T> = ErrorType<T>>(
    reference: any,
    message?: Message<T, E>,
    modifier?: Modifier
  ): Validator<T, E> {
    return new Validator<T, E>().ne(reference, message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value is greater than the threshold.
   *
   * @param threshold - threshold value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  gt<T = string, E extends ErrorType<T> = ErrorType<T>>(
    threshold: number,
    message?: Message<T, E>,
    modifier?: Modifier
  ): Validator<T, E> {
    return new Validator<T, E>().gt(threshold, message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value is greater than or equal to the threshold.
   *
   * @param threshold - threshold value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  gte<T = string, E extends ErrorType<T> = ErrorType<T>>(
    threshold: number,
    message?: Message<T, E>,
    modifier?: Modifier
  ): Validator<T, E> {
    return new Validator<T, E>().gte(threshold, message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value is less than the threshold.
   *
   * @param threshold - threshold value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  lt<T = string, E extends ErrorType<T> = ErrorType<T>>(
    threshold: number,
    message?: Message<T, E>,
    modifier?: Modifier
  ): Validator<T, E> {
    return new Validator<T, E>().lt(threshold, message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value is less than or equal to the threshold.
   *
   * @param threshold - threshold value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  lte<T = string, E extends ErrorType<T> = ErrorType<T>>(
    threshold: number,
    message?: Message<T, E>,
    modifier?: Modifier
  ): Validator<T, E> {
    return new Validator<T, E>().lte(threshold, message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value is between minimum and maximum reference values, inclusive.
   *
   * @param minimum - minimal referenced value
   * @param maximum  - maximal referenced value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  between<T = string, E extends ErrorType<T> = ErrorType<T>>(
    minimum: number,
    maximum: number,
    message?: Message<T, E>,
    modifier?: Modifier
  ): Validator<T, E> {
    return new Validator<T, E>().between(minimum, maximum, message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value length is greater than or equal to the specified minimum length.
   *
   * @param length - minimum value length
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  minLength<T = string, E extends ErrorType<T> = ErrorType<T>>(
    length: number,
    message?: Message<T, E>,
    modifier?: Modifier
  ): Validator<T, E> {
    return new Validator<T, E>().minLength(length, message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value length is less than or equal to the specified minimum length.
   *
   * @param length - maximum value length
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  maxLength<T = string, E extends ErrorType<T> = ErrorType<T>>(
    length: number,
    message?: Message<T, E>,
    modifier?: Modifier
  ): Validator<T, E> {
    return new Validator<T, E>().maxLength(length, message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value length is less than or equal to the specified minimum length.
   *
   * @param length - referenced value length
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  strictLength<T = string, E extends ErrorType<T> = ErrorType<T>>(
    length: number,
    message?: Message<T, E>,
    modifier?: Modifier
  ): Validator<T, E> {
    return new Validator<T, E>().strictLength(length, message, modifier);
  },

  /**
   * Applies a built-in rule that verifies a value if the value length is between minimum and maximum lengths, inclusive.
   *
   * @param minimum - minimum value length
   * @param maximum - maximum value length
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  lengthBetween<T = string, E extends ErrorType<T> = ErrorType<T>>(
    minimum: number,
    maximum: number,
    message?: Message<T, E>,
    modifier?: Modifier
  ): Validator<T, E> {
    return new Validator<T, E>().lengthBetween(minimum, maximum, message, modifier);
  },

  /**
   * Inversed the result.
   *
   * Only for defined values in the strict (not optional) mode.
   *
   * @returns - current chain link
   */
  not<T = string, E extends ErrorType<T> = ErrorType<T>>(): Validator<T, E> {
    return new Validator<T, E>().not();
  }
};
