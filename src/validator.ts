import { Rule } from './rule';
import * as rules from './rules';

type MessageFactory = () => string;

type Message = string | MessageFactory;

export class Validator {
  private readonly next?: Validator;
  private rule?: Rule;
  private message?: string;
  private strict = true;
  private inverse = false;
  private another?: Validator;
  private proxy = false;

  constructor(next?: Validator, proxy = false) {
    this.next = next;
    this.proxy = proxy;
  }

  public use(rule: Rule, message?: Message): Validator {
    if (this.proxy) return new Validator().use(rule, message);

    this.rule = rule;
    this.message = typeof message === 'function' ? message() : message;

    return new Validator(this);
  }

  public check = (value: any): boolean | string => {
    if ((!this.strict && value === undefined) || !this.rule) return this.next?.check(value) ?? true;

    let result = this.rule(value);

    if (this.inverse) result = !result;

    if (!result && this.another?.check(value) === true) result = true;

    const response = result ? true : this.message ?? false;

    return result ? this.next?.check(value) ?? response : response;
  };

  public string(message?: Message): Validator {
    return this.use(rules.isString, message);
  }

  public number(message?: Message): Validator {
    return this.use(rules.isNumber, message);
  }

  public boolean(message?: Message): Validator {
    return this.use(rules.isBoolean, message);
  }

  public object(message?: Message): Validator {
    return this.use(rules.isObject, message);
  }

  public null(message?: Message): Validator {
    return this.use(rules.isNull, message);
  }

  public notDefined(message?: Message): Validator {
    return this.use(rules.isUndefined, message);
  }

  public min(minumum: number, message?: Message): Validator {
    return this.use(rules.min.bind(undefined, minumum), message);
  }

  public max(maximum: number, message?: Message): Validator {
    return this.use(rules.max.bind(undefined, maximum), message);
  }

  public gt(threshold: number, message?: Message): Validator {
    return this.use(rules.gt.bind(undefined, threshold), message);
  }

  public gte(threshold: number, message?: Message): Validator {
    return this.use(rules.gte.bind(undefined, threshold), message);
  }

  public lt(threshold: number, message?: Message): Validator {
    return this.use(rules.lt.bind(undefined, threshold), message);
  }

  public lte(threshold: number, message?: Message): Validator {
    return this.use(rules.lte.bind(undefined, threshold), message);
  }

  public between(minimum: number, maximum: number, message?: Message): Validator {
    return this.use(rules.lt.bind(undefined, minimum, maximum), message);
  }

  public minLength(length: number, message?: Message): Validator {
    return this.use(rules.minLength.bind(undefined, length), message);
  }

  public maxLength(length: number, message?: Message): Validator {
    return this.use(rules.maxLength.bind(undefined, length), message);
  }

  public optional(): Validator {
    if (this.proxy) return new Validator().optional();

    this.strict = false;

    return this;
  }

  public not(): Validator {
    if (this.proxy) return new Validator().not();

    this.inverse = true;

    return this;
  }

  public or(another: Validator): Validator {
    if (this.proxy) return new Validator().or(another);

    this.another = another;

    return this;
  }
}

export default Validator;
