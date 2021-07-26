import * as rules from './rules';

export type Rule = (value: any, context: any) => boolean;

export type MessageFactory = () => string;

export type Message = string | MessageFactory;

export type Modifier = (value: any, context: any) => any;

/**
 * This class provides a single link of the chain.
 */
export class Validator {
  /**
   * Next validator in the chain.
   */
  private readonly _next?: Validator;

  /**
   * Validation rule.
   */
  private _rule?: Rule;

  /**
   * Error message or its factory.
   */
  private _message?: Message;

  /**
   * Modifies a values before send it to the next chain link.
   *
   * @param value - checked value
   * @returns - modified checked value
   */
  private _modifier: Modifier = value => value;

  /**
   * Allow optional (`undefined`) values.
   */
  private _strict = true;

  /**
   * Inverse (`not`) the result.
   */
  private _inverse = false;

  /**
   * Composed chain.
   */
  private _another?: Validator;

  /**
   * The instance is a root instance.
   */
  private _proxy = false;

  /**
   * @param next - next validator
   * @param proxy - make instance root
   */
  constructor(next?: Validator, proxy = false) {
    this._next = next;
    this._proxy = proxy;
    this.check = this.check.bind(this);
  }

  /**
   * Apply a rule to the instance an returns a new next chain link.
   *
   * @param rule - validation rule function
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public use(rule: Rule, message?: Message, modifier?: Modifier): Validator {
    if (this._proxy) return new Validator().use(rule, message, modifier);

    this._rule = rule;
    this._modifier = modifier ?? this._modifier;
    this._message = message;

    return new Validator(this);
  }

  /**
   * Verifies a value and returns a result.
   *
   * @param value - checked value
   * @param context - context object
   * @returns - checking result
   */
  public check(value: any, context: any = {}): boolean | string {
    if (!this._rule) return this._next?.check(this._modifier(value, context), context) ?? true;

    const optional = !this._strict && value === undefined;
    let result = optional || this._rule(value, context);

    if (this._inverse && !optional) result = !result;

    let response: string | boolean;

    if (!result && this._another) response = this._another.check(this._modifier(value, context), context);
    else response = result ? true : (typeof this._message === 'function' ? this._message() : this._message) ?? false;

    return result ? this._next?.check(this._modifier(value, context), context) ?? response : response;
  }

  /**
   * Applies a built-in rule that verifies a value if the value type is `string`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public string(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isString, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value type is `number`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public number(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isNumber, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value type is `boolean`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public boolean(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isBoolean, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value type is `object` and the value is not `null`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public object(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isObject, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is `null`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public null(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isNull, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is not `undefined`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public defined(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isDefined, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is `undefined`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public notDefined(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isUndefined, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is `null` or `undefined`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public none(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isNone, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is not `null` or `undefined`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public notNone(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isNotNone, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is equal to the referenced value.
   *
   * @param reference - referenced value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public eq(reference: any, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.eq.bind(undefined, reference), message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is not equal to the referenced value.
   *
   * @param reference - referenced value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public ne(reference: any, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.ne.bind(undefined, reference), message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is greater than the threshold.
   *
   * @param threshold - threshold value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public gt(threshold: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.gt.bind(undefined, threshold), message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is greater than or equal to the threshold.
   *
   * @param threshold - threshold value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public gte(threshold: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.gte.bind(undefined, threshold), message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is less than the threshold.
   *
   * @param threshold - threshold value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public lt(threshold: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.lt.bind(undefined, threshold), message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is less than or equal to the threshold.
   *
   * @param threshold - threshold value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public lte(threshold: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.lte.bind(undefined, threshold), message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is between minimum and maximum reference values, inclusive.
   *
   * @param minimum - minimal referenced value
   * @param maximum  - maximal referenced value
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public between(minimum: number, maximum: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.between.bind(undefined, minimum, maximum), message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value length is greater than or equal to the specified minimum length.
   *
   * @param length - minimum value length
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public minLength(length: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.minLength.bind(undefined, length), message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value length is less than or equal to the specified minimum length.
   *
   * @param length - maximum value length
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public maxLength(length: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.maxLength.bind(undefined, length), message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value length is less than or equal to the specified minimum length.
   *
   * @param length - referenced value length
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public strictLength(length: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.strictLength.bind(undefined, length), message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value length is between minimum and maximum lengths, inclusive.
   *
   * @param minimum - minimum value length
   * @param maximum - maximum value length
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public lengthBetween(minimum: number, maximum: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.lengthBetween.bind(undefined, minimum, maximum), message, modifier);
  }

  /**
   * Allows `undefined` values.
   *
   * @param applyToCurrent - apply to the current instance instead of the next
   * @returns - current chain link or next chain link (for proxies)
   */
  public optional(applyToCurrent = false): Validator {
    if (this._proxy) return new Validator().optional();

    if (applyToCurrent) this._strict = false;
    else if (this._next) this._next.optional(true);

    return this;
  }

  /**
   * Inversed the result.
   *
   * Only for defined values in the strict (not optional) mode.
   *
   * @returns - current chain link
   */
  public not(): Validator {
    if (this._proxy) return new Validator().not();

    this._inverse = true;

    return this;
  }

  /**
   * Appends an alternative chain that starts when the current rule returns `false`.
   *
   * @param another - alternative chain
   * @param applyToCurrent - apply to the current instance instead of the next
   * @returns - current chain link or next chain link (for proxies)
   */
  public or(another: Validator, applyToCurrent = false): Validator {
    if (this._proxy) return new Validator().or(another);

    if (applyToCurrent) this._another = another;
    else if (this._next) this._next.or(another, true);

    return this;
  }
}

export default Validator;
