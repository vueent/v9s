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
   * @param value - verifying value
   * @returns - modified verifying value
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
   * Initial value
   */
  private _proxy = false;

  constructor(next?: Validator, proxy = false) {
    this._next = next;
    this._proxy = proxy;
    this.check = this.check.bind(this);
  }

  public use(rule: Rule, message?: Message, modifier?: Modifier): Validator {
    if (this._proxy) return new Validator().use(rule, message, modifier);

    this._rule = rule;
    this._modifier = modifier ?? this._modifier;
    this._message = message;

    return new Validator(this);
  }

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

  public string(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isString, message, modifier);
  }

  public number(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isNumber, message, modifier);
  }

  public boolean(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isBoolean, message, modifier);
  }

  public object(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isObject, message, modifier);
  }

  public null(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isNull, message, modifier);
  }

  public defined(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isDefined, message, modifier);
  }

  public notDefined(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isUndefined, message, modifier);
  }

  public none(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isNone, message, modifier);
  }

  public notNone(message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.isNotNone, message, modifier);
  }

  public eq(reference: any, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.eq.bind(undefined, reference), message, modifier);
  }

  public ne(reference: any, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.ne.bind(undefined, reference), message, modifier);
  }

  public gt(threshold: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.gt.bind(undefined, threshold), message, modifier);
  }

  public gte(threshold: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.gte.bind(undefined, threshold), message, modifier);
  }

  public lt(threshold: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.lt.bind(undefined, threshold), message, modifier);
  }

  public lte(threshold: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.lte.bind(undefined, threshold), message, modifier);
  }

  public between(minimum: number, maximum: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.between.bind(undefined, minimum, maximum), message, modifier);
  }

  public minLength(length: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.minLength.bind(undefined, length), message, modifier);
  }

  public maxLength(length: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.maxLength.bind(undefined, length), message, modifier);
  }

  public strictLength(length: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.strictLength.bind(undefined, length), message, modifier);
  }

  public lengthBetween(minimum: number, maximum: number, message?: Message, modifier?: Modifier): Validator {
    return this.use(rules.lengthBetween.bind(undefined, minimum, maximum), message, modifier);
  }

  public optional(applyToCurrent = false): Validator {
    if (this._proxy) return new Validator().optional();

    if (applyToCurrent) this._strict = false;
    else if (this._next) this._next.optional(true);

    return this;
  }

  public not(): Validator {
    if (this._proxy) return new Validator().not();

    this._inverse = true;

    return this;
  }

  public or(another: Validator, applyToCurrent = false): Validator {
    if (this._proxy) return new Validator().or(another);

    if (applyToCurrent) this._another = another;
    else if (this._next) this._next.or(another, true);

    return this;
  }
}

export default Validator;
