import { Validator } from './validator';

export { simplify } from './simplify';
export { ValidationResult, objectify } from './objectify';
export { Rule, MessageFactory, Message, Modifier, CheckFunc, Validator } from './validator';

/**
 * Sets a default negative value, which will be used as a fail result if the message is not set.
 * @param defaultNegative - default negative value
 * @returns - `Validator` instance
 */
export function v9s<T = boolean>(defaultNegative?: T) {
  return new Validator<T>(defaultNegative);
}

/**
 * Sets a default negative value, which will be used as a fail result if the message is not set.
 *
 * Use named `v9s` function instead.
 *
 * @param defaultNegative - default negative value
 * @returns - `Validator` instance
 *
 * @deprecated
 */
const depv9s = v9s;

export default depv9s;
