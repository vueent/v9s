import Validator from './validator';

export { simplify } from './simplify';
export { ValidationResult, objectify } from './objectify';
export { Rule, MessageFactory, Message, Modifier, CheckFunc, Validator } from './validator';

/**
 * Sets a default negative value, which will be used as a fail result if the message is not set.
 * @param defaultNegative - default negative value
 * @returns - `Validator` instance
 */
export function def<T = boolean>(defaultNegative?: T) {
  return new Validator<T>(defaultNegative);
}

export default def;