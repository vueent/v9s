import { v9s, simplify, objectify, CheckFunc, Message, MessageFactory, Validator } from '@/index';

test('Example #1', () => {
  const check = simplify(v9s(false).lte(100).gte(10));

  expect(check(1)).toBe(false);
  expect(check(110)).toBe(false);
  expect(check(50)).toBe(true);
});

test('Example #2', () => {
  const check = simplify(v9s<string>().lte(100, 'too big').gte(10, 'too small'));

  expect(check(1)).toBe('too small');
  expect(check(110)).toBe('too big');
  expect(check(50)).toBe(true);
});

test('Example #3', () => {
  enum ValidationError {
    tooSmall,
    tooBig
  }

  const check = simplify(v9s<ValidationError>().lte(100, ValidationError.tooBig).gte(10, ValidationError.tooSmall));

  expect(check(1)).toBe(ValidationError.tooSmall);
  expect(check(110)).toBe(ValidationError.tooBig);
  expect(check(50)).toBe(true);
});

test('Example #4', () => {
  const check = simplify(v9s(false).lte(100).gte(10));

  expect(check(1)).toBe(false);
  expect(check(110)).toBe(false);
  expect(check(50)).toBe(true);
});

test('Example #5', () => {
  const check = simplify(v9s<string>().gte(10, 'very small').gte(100, 'small'));

  expect(check(9)).toBe('very small');
  expect(check(50)).toBe('small');
  expect(check(110)).toBe(true);
});

test('Example #6', () => {
  const check = simplify(v9s(false).not().string());

  expect(check(42)).toBe(true);
  expect(check('42')).toBe(false);
});

test('Example #7', () => {
  const check = simplify(v9s(false).string().optional());

  expect(check(42)).toBe(false);
  expect(check('42')).toBe(true);
  expect(check(undefined)).toBe(true);
});

test('Example #8', () => {
  const check = simplify(v9s(false).string().optional().or(v9s(false).number()));

  expect(check('42')).toBe(true);
  expect(check(undefined)).toBe(true);
  expect(check(42)).toBe(true);
  expect(check(true)).toBe(false);
  expect(check(null)).toBe(false);
});

test('Example #9', () => {
  const check = simplify(v9s(false).string().optional().or(v9s(false).number()));

  expect(check('42')).toBe(true);
});

test('Example #10', () => {
  const integer = (value: string) => /^[0-9]+$/.test(value);
  const check = simplify(v9s(false).use(integer));

  expect(check('42')).toBe(true);
  expect(check('42a')).toBe(false);
});

test('Example #11', () => {
  const integer = (value: string) => /^[0-9]+$/.test(value);
  const modify = (value: string) => Number(value);
  const check = simplify(v9s(false).use(integer, undefined, modify).between(10, 100));

  expect(check('42')).toBe(true);
  expect(check('9')).toBe(false);
  expect(check('110')).toBe(false);
});

test('Example #12', () => {
  function each<T>(chain: CheckFunc<T> | Validator<T>, message: Message<T>): CheckFunc<T> {
    return (value: any, context: any = {}) => {
      const getMessage = () => (typeof message === 'function' ? (message as MessageFactory<T>)() : message);
      const check = typeof chain === 'function' ? chain : chain.check;

      if (!Array.isArray(value)) return getMessage();
      else
        return value.reduce<T | undefined>((prev, current) => (prev === undefined ? check(current, context) : prev), undefined);
    };
  }

  const check = v9s<string>().inject(
    each(v9s<string>().number('not a number').gte(2, 'too small').lte(10, 'too big'), 'not array')
  ).check;

  expect(check('[1, 2, 3]')).toBe('not array');
  expect(check(['1', '2', '3'])).toBe('not a number');
  expect(check([1, 2, 3, 11])).toBe('too small');
  expect(check([2, 3, 11])).toBe('too big');
  expect(check([2, 3])).toBe(undefined);
});

test('Example #13', () => {
  enum Lang {
    de,
    en,
    ru
  }

  let lang: Lang = Lang.en;

  const errorMessageFactory = () => {
    switch (lang) {
      case Lang.de:
        return 'Ungültiger Wert';
      case Lang.ru:
        return 'Неверное значение';
      default:
        return 'Invalid value';
    }
  };

  const check = simplify(v9s<string>().between(10, 100, errorMessageFactory));

  expect(check(50)).toBe(true);
  expect(check(110)).toBe('Invalid value');

  lang = Lang.de;

  expect(check(110)).toBe('Ungültiger Wert');

  lang = Lang.ru;

  expect(check(110)).toBe('Неверное значение');
});

test('Example #14', () => {
  const check = objectify(v9s('invalid').number('not a number').gte(10).lte(100));

  const isString = check('42');

  expect(isString.success).toBe(false);
  expect(isString.error).toBe('not a number');

  const tooSmall = check(5);

  expect(tooSmall.success).toBe(false);
  expect(tooSmall.error).toBe('invalid');

  const tooBig = check(110);

  expect(tooBig.success).toBe(false);
  expect(tooBig.error).toBe('invalid');

  const normal = check(50);

  expect(normal.success).toBe(true);
  expect(normal.error).toBe(undefined);
});

test('Example #15', () => {
  const checkForDuplicates = function (value: number[], context: { sorted?: number[] }) {
    const sorted = value.slice().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

    const noDuplicates = sorted.every((v, i) => !i || sorted[i - 1] !== v);

    if (noDuplicates) context.sorted = sorted;

    return noDuplicates;
  };

  const checkMinimum = function (minimum: number, value: number[], context: { sorted: number[] }) {
    const { sorted } = context;

    return sorted.length > 0 && minimum <= sorted[0];
  };

  const checkMaximum = function (maximum: number, value: number[], context: { sorted: number[] }) {
    const { sorted } = context;

    return sorted.length > 0 && maximum >= sorted[sorted.length - 1];
  };

  const check = simplify(
    v9s(false).use(checkForDuplicates).use(checkMinimum.bind(undefined, 10)).use(checkMaximum.bind(undefined, 100))
  );

  expect(check([])).toBe(false); // empty
  expect(check([1, 6, 4, 2, 1])).toBe(false); // duplicates of `1`
  expect(check([1, 6, 4, 2])).toBe(false); // 1 < 10
  expect(check([10, 60, 105, 40, 20])).toBe(false); // 105 > 100
  expect(check([10, 60, 40, 20])).toBe(true);
});

test('Example #16', () => {
  interface Data {
    name: string;
    value: string;
  }

  const checkNameRule = function (value: string, context: Data) {
    return (!value && !context.value) || value.length > 0;
  };

  const checkValueRule = function (value: string, context: Data) {
    return (!value && !context.name) || /^[0-9]+$/.test(value);
  };

  const checkName = simplify(v9s(false).use(checkNameRule));
  const checkValue = simplify(v9s(false).use(checkValueRule));

  const empty = { name: '', value: '' };

  expect(checkName(empty.name, empty)).toBe(true);
  expect(checkValue(empty.value, empty)).toBe(true);

  const emptyName = { name: '', value: '42' };

  expect(checkName(emptyName.name, emptyName)).toBe(false);
  expect(checkValue(emptyName.value, emptyName)).toBe(true);

  const emptyValue = { name: 'the answer', value: '' };

  expect(checkName(emptyValue.name, emptyValue)).toBe(true);
  expect(checkValue(emptyValue.value, emptyValue)).toBe(false);

  const filled = { name: 'the answer', value: '42' };

  expect(checkName(filled.name, filled)).toBe(true);
  expect(checkValue(filled.value, filled)).toBe(true);
});
