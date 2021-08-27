import v9s, { CheckFunc, simplify, Message, MessageFactory } from '@/index';

test('Use an external validation function', () => {
  const min = function (minimum: number, value: string) {
    return minimum <= Number(value);
  };

  const check = simplify(v9s(false).use(min.bind(undefined, 10)));

  expect(check('20')).toBe(true);
  expect(check('10')).toBe(true);
  expect(check('9')).toBe(false);
});

test('A chain of external validation functions have to use the context', () => {
  const minOrMax = function (threshold: number, value: number | string, context: { inverse: boolean }) {
    return context.inverse ? threshold >= Number(value) : threshold <= Number(value);
  };

  const minLength = function (minimum: number, value: number | string, context: { set?: boolean; inverse?: boolean }) {
    const isString = typeof value === 'string';

    if (context.set) context.inverse = isString;

    return isString ? minimum <= (value as string).length : true;
  };

  const check = simplify(v9s<string>().use(minLength.bind(undefined, 2), 'short').use(minOrMax.bind(undefined, 10), 'invalid'));

  expect(check(20)).toBe(true);
  expect(check(20, { set: true })).toBe(true);
  expect(check('20', { set: true })).toBe('invalid');
  expect(check('20')).toBe(true);
  expect(check('1')).toBe('short');
  expect(check(9)).toBe('invalid');
  expect(check(9, { inverse: true })).toBe(true);
});

test('Optional chain', () => {
  const check = simplify(v9s(false).lte(100).optional());

  expect(check(10)).toBe(true);
  expect(check(120)).toBe(false);
  expect(check(undefined)).toBe(true);
});

test('Inversed chain', () => {
  const check = simplify(v9s(false).not().gte(10));

  expect(check(9)).toBe(true);
  expect(check(11)).toBe(false);
});

test('Conditional chain (a string with a length between 2 and 10 chars or a number between 10 and 100)', () => {
  const check = simplify(v9s(false).string().or(v9s(false).number().between(10, 100)).lengthBetween(2, 10));

  expect(check('validations')).toBe(false);
  expect(check('a')).toBe(false);
  expect(check('hello')).toBe(true);
  expect(check(9)).toBe(false);
  expect(check(120)).toBe(false);
  expect(check(50)).toBe(true);
  expect(check(null)).toBe(false);
  expect(check(true)).toBe(false);
  expect(check(new Array(5))).toBe(false);
});

test('Value modifier', () => {
  const check = simplify(
    v9s(false)
      .gte(10, undefined, (value: number) => value * 2)
      .lte(100)
  );

  expect(check(20)).toBe(true);
  expect(check(9)).toBe(false);
  expect(check(50)).toBe(true);
  expect(check(51)).toBe(false);
});

test('Combined not, or and optional methods usage', () => {
  const check = simplify(v9s(false).boolean().or(v9s(false).number().not().between(10, 100).check).optional());

  expect(check(undefined)).toBe(true);
  expect(check(true)).toBe(true);
  expect(check(false)).toBe(true);
  expect(check('test')).toBe(false);
  expect(check(20)).toBe(false);
  expect(check(10)).toBe(false);
  expect(check(5)).toBe(true);
  expect(check(120)).toBe(true);

  const check2 = simplify(v9s(false).not().boolean().optional());

  expect(check2(undefined)).toBe(true);
  expect(check2(true)).toBe(false);
  expect(check2(false)).toBe(false);
  expect(check2(1)).toBe(true);
  expect(check2('')).toBe(true);
});

test('A generic message type using', () => {
  const check = v9s<number>().boolean(0).check;

  expect(check('true')).toBe(0);

  const checkFactory = v9s<number>().boolean(() => 0).check;

  expect(checkFactory('true')).toBe(0);

  interface MyError {
    code: number;
    text: string;
  }

  const check2 = v9s<MyError>({ code: 0, text: 'Unexpected' }).boolean({ code: 1, text: 'Not boolean' }).check;

  expect(check2(true)).toBe(undefined);
  expect(check2('true')).toStrictEqual({ code: 1, text: 'Not boolean' });
});

test('Injections using', () => {
  function every<T>(chain: CheckFunc<T>, message: Message<T>): CheckFunc<T> {
    return (value: any, context: any = {}) => {
      const getMessage = () => (typeof message === 'function' ? (message as MessageFactory<T>)() : message);

      if (!Array.isArray(value)) return getMessage();
      else {
        for (const v of value) {
          const error = chain(v, context);

          if (error !== undefined) return error;
        }

        return undefined;
      }
    };
  }

  const check = simplify(v9s(false).inject(every(v9s(false).between(2, 10).check, false)));

  expect(check([2, 3, 4, 5, 6])).toBe(true);
  expect(check([1, 2, 3, 4, 5, 6])).toBe(false);
});

test('Undefined default value', () => {
  const check = simplify(v9s<boolean>().number());

  try {
    check(true);
  } catch (e) {
    expect(e).toStrictEqual(new Error('Undefined default negative value'));
  }
});

test('Null as error', () => {
  const check = v9s(null).number().check;

  expect(check(1)).toBe(undefined);
  expect(check('1')).toBe(null);
});

test('True as error', () => {
  const check = v9s(true).number().check;

  expect(check(1)).toBe(undefined);
  expect(check('1')).toBe(true);
  expect(check(true)).toBe(true);
  expect(check(false)).toBe(true);
});

test('Inject another chain', () => {
  const injection = v9s<string>().number('not a number');
  const check = v9s<string>().gte(10, 'less than 10').inject(injection).check;

  expect(check(true)).toBe('not a number');
  expect(check(5)).toBe('less than 10');
  expect(check(10)).toBe(undefined);
});
