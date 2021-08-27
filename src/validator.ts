import * as rules from './rules';

export type Rule = (value: any, context: any) => boolean;

export type MessageFactory<T = boolean> = () => T;

export type Message<T = boolean> = T | MessageFactory<T>;

export type Modifier = (value: any, context: any) => any;

export type CheckFunc<T> = (value: any, context: any) => T | undefined;

/**
 * This class provides a single link of the chain.
 */
export class Validator<T = boolean> {
  /**
   * Default negative value.
   *
   * This value will be used as a fail result if the message is not set.
   */
  protected readonly _defaultNegative?: T;

  /**
   * The `check` method of the chain root.
   */
  protected readonly _rootCheck?: CheckFunc<T>;

  /**
   * Next validator in the chain.
   */
  protected _next?: Validator<T>;

  /**
   * Validation rule.
   */
  protected _rule?: Rule;

  /**
   * Error message or its factory.
   */
  protected _message?: Message<T>;

  /**
   * Modifies a values before send it to the next chain link.
   *
   * @param value - checked value
   * @returns - modified checked value
   */
  protected _modifier: Modifier = value => value;

  /**
   * Allow optional (`undefined`) values.
   */
  protected _strict = true;

  /**
   * Inverse (`not`) the result.
   */
  protected _inverse = false;

  /**
   * Composed chain.
   */
  protected _another?: CheckFunc<T> | Validator<T>;

  /**
   * An injected rule/subchain which have to be checked before the current chain.
   */
  protected _injection?: CheckFunc<T>;

  /**
   * @param defaultNegative - will be used as a fail result if the message is not set
   * @param rootCheck - the check method of a root validator
   */
  constructor(defaultNegative?: T, rootCheck?: CheckFunc<T>) {
    this._defaultNegative = defaultNegative;
    this._rootCheck = rootCheck;
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
  public use(rule: Rule, message?: Message<T>, modifier?: Modifier): Validator<T> {
    if (!this._rule) {
      this._rule = rule;
      this._modifier = modifier ?? this._modifier;
      this._message = message;

      return this;
    }

    this._next = new Validator<T>(this._defaultNegative, this._rootCheck ?? this.check).use(rule, message, modifier);

    return this._next;
  }

  /**
   * Verifies a value and returns a result.
   *
   * @param value - checked value
   * @param context - context object
   * @returns - checking result
   */
  public check(value: any, context: any = {}): T | undefined {
    if (this._rootCheck) return this._rootCheck(value, context);

    const response = this.verify(value, context);

    return response === true ? undefined : response;
  }

  /**
   * Applies a built-in rule that verifies a value if the value type is `string`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public string(message?: Message<T>, modifier?: Modifier): Validator<T> {
    return this.use(rules.isString, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value type is `number`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public number(message?: Message<T>, modifier?: Modifier): Validator<T> {
    return this.use(rules.isNumber, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value type is `boolean`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public boolean(message?: Message<T>, modifier?: Modifier): Validator<T> {
    return this.use(rules.isBoolean, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value type is `object` and the value is not `null`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public object(message?: Message<T>, modifier?: Modifier): Validator<T> {
    return this.use(rules.isObject, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is `null`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public null(message?: Message<T>, modifier?: Modifier): Validator<T> {
    return this.use(rules.isNull, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is not `undefined`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public defined(message?: Message<T>, modifier?: Modifier): Validator<T> {
    return this.use(rules.isDefined, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is `undefined`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public notDefined(message?: Message<T>, modifier?: Modifier): Validator<T> {
    return this.use(rules.isUndefined, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is `null` or `undefined`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public none(message?: Message<T>, modifier?: Modifier): Validator<T> {
    return this.use(rules.isNone, message, modifier);
  }

  /**
   * Applies a built-in rule that verifies a value if the value is not `null` or `undefined`.
   *
   * @param message - error message
   * @param modifier - value modifier (is used for in the next chain link)
   * @returns - next chain link
   */
  public notNone(message?: Message<T>, modifier?: Modifier): Validator<T> {
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
  public eq(reference: any, message?: Message<T>, modifier?: Modifier): Validator<T> {
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
  public ne(reference: any, message?: Message<T>, modifier?: Modifier): Validator<T> {
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
  public gt(threshold: number, message?: Message<T>, modifier?: Modifier): Validator<T> {
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
  public gte(threshold: number, message?: Message<T>, modifier?: Modifier): Validator<T> {
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
  public lt(threshold: number, message?: Message<T>, modifier?: Modifier): Validator<T> {
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
  public lte(threshold: number, message?: Message<T>, modifier?: Modifier): Validator<T> {
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
  public between(minimum: number, maximum: number, message?: Message<T>, modifier?: Modifier): Validator<T> {
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
  public minLength(length: number, message?: Message<T>, modifier?: Modifier): Validator<T> {
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
  public maxLength(length: number, message?: Message<T>, modifier?: Modifier): Validator<T> {
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
  public strictLength(length: number, message?: Message<T>, modifier?: Modifier): Validator<T> {
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
  public lengthBetween(minimum: number, maximum: number, message?: Message<T>, modifier?: Modifier): Validator<T> {
    return this.use(rules.lengthBetween.bind(undefined, minimum, maximum), message, modifier);
  }

  /**
   * Allows `undefined` values.
   *
   * @returns - current chain link or next chain link (for proxies)
   */
  public optional(): Validator<T> {
    this._strict = false;

    return this;
  }

  /**
   * Inversed the result.
   *
   * Only for defined values in the strict (not optional) mode.
   *
   * @returns - current chain link
   */
  public not(): Validator<T> {
    if (this._rule) {
      this._next = new Validator<T>(this._defaultNegative, this._rootCheck ?? this.check);

      return this._next.not();
    }

    this._inverse = true;

    return this;
  }

  /**
   * Appends an alternative chain that starts when the current rule returns `false`.
   *
   * @param another - alternative chain
   * @returns - current chain link or next chain link (for proxies)
   */
  public or(another: CheckFunc<T> | Validator<T>): Validator<T> {
    this._another = another;

    return this;
  }

  public inject(injection: CheckFunc<T>): Validator<T> {
    this._injection = injection;

    return this;
  }

  /**
   * Verifies a value and returns an instance of {@link ValidationResult} with an error or `true`.
   *
   * @param value - checked value
   * @param context - context object
   * @returns - checking result
   */
  protected verify(value: any, context: any): true | T {
    if (this._injection) {
      const subresult = this._injection(value, context);

      if (subresult !== undefined) return subresult;
    }

    if (!this._rule) {
      const error = this._next?.verify(this._modifier(value, context), context);

      return error === undefined ? true : error;
    }

    const optional = !this._strict && value === undefined;
    let result = optional || this._rule(value, context);

    if (this._inverse && !optional) result = !result;

    let response: true | T;

    if (!result && this._another) {
      const checkResult =
        typeof this._another === 'function'
          ? this._another(this._modifier(value, context), context)
          : this._another.check(this._modifier(value, context), context);

      response = checkResult === undefined ? true : checkResult;
    } else if (result) response = true;
    else {
      const message = typeof this._message === 'function' ? (this._message as MessageFactory<T>)() : this._message;

      if (message !== undefined) response = message;
      else if (this._defaultNegative === undefined) throw new Error('Undefined default negative value');
      else response = this._defaultNegative;
    }

    if (result) {
      const error = this._next?.verify(this._modifier(value, context), context);

      return error === undefined ? response : error;
    } else return response;
  }
}

export default Validator;
