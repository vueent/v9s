import Validator from './validator';

export { simplify } from './simplify';
export { ValidationResult } from './validation-result';
export { Rule, MessageFactory, Message, Modifier, CheckFunc, Validator } from './validator';

export default {
  /**
   * Sets a default negative value, which will be used as a fail result if the message is not set.
   * @param defaultNegative - default negative value
   * @returns - `Validator` instance
   */
  def<T = boolean>(defaultNegative?: T) {
    return new Validator<T>(defaultNegative);
  }
};
