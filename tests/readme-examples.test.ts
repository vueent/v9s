import v9s, { simplify } from '@/index';

test('Example #1', () => {
  const check = simplify(v9s.def(false).lte(100).gte(10));

  expect(check(1)).toBe(false);
  expect(check(110)).toBe(false);
  expect(check(50)).toBe(true);
});

test('Example #2', () => {
  const check = simplify(v9s.def<string>().lte(100, 'too big').gte(10, 'too small'));

  expect(check(1)).toBe('too small');
  expect(check(110)).toBe('too big');
  expect(check(50)).toBe(true);
});

test('Example #3', () => {
  enum ValidationError {
    tooSmall,
    tooBig
  }

  const check = simplify(v9s.def<ValidationError>().lte(100, ValidationError.tooBig).gte(10, ValidationError.tooSmall));

  expect(check(1)).toBe(ValidationError.tooSmall);
  expect(check(110)).toBe(ValidationError.tooBig);
  expect(check(50)).toBe(true);
});

test('Example #4', () => {
  const check = simplify(v9s.def<string>().gte(10, 'very small').gte(100, 'small'));

  expect(check(9)).toBe('very small');
  expect(check(50)).toBe('small');
  expect(check(110)).toBe(true);
});

test('Example #5', () => {
  const check = simplify(v9s.def(false).not().string());

  expect(check(42)).toBe(true);
  expect(check('42')).toBe(false);
});

test('Example #6', () => {
  const check = simplify(v9s.def(false).string().optional());

  expect(check(42)).toBe(false);
  expect(check('42')).toBe(true);
  expect(check(undefined)).toBe(true);
});

test('Example #7', () => {
  const check = simplify(v9s.def(false).string().optional().or(v9s.def(false).number()));

  expect(check('42')).toBe(true);
  expect(check(undefined)).toBe(true);
  expect(check(42)).toBe(true);
  expect(check(true)).toBe(false);
  expect(check(null)).toBe(false);
});

test('Example #8', () => {
  const check = simplify(v9s.def(false).string().optional().or(v9s.def(false).number()));

  expect(check('42')).toBe(true);
});

test('Example #9', () => {
  const integer = (value: string) => /^[0-9]+$/.test(value);
  const check = simplify(v9s.def(false).use(integer));

  expect(check('42')).toBe(true);
  expect(check('42a')).toBe(false);
});

test('Example #10', () => {
  const integer = (value: string) => /^[0-9]+$/.test(value);
  const modify = (value: string) => Number(value);
  const check = simplify(v9s.def(false).use(integer, undefined, modify).between(10, 100));

  expect(check('42')).toBe(true);
  expect(check('9')).toBe(false);
  expect(check('110')).toBe(false);
});

test('Example #11', () => {
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

  const check = simplify(v9s.def<string>().between(10, 100, errorMessageFactory));

  expect(check(50)).toBe(true);
  expect(check(110)).toBe('Invalid value');

  lang = Lang.de;

  expect(check(110)).toBe('Ungültiger Wert');

  lang = Lang.ru;

  expect(check(110)).toBe('Неверное значение');
});

test('Example #12', () => {
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
    v9s.def(false).use(checkForDuplicates).use(checkMinimum.bind(undefined, 10)).use(checkMaximum.bind(undefined, 100))
  );

  expect(check([])).toBe(false); // empty
  expect(check([1, 6, 4, 2, 1])).toBe(false); // duplicates of `1`
  expect(check([1, 6, 4, 2])).toBe(false); // 1 < 10
  expect(check([10, 60, 105, 40, 20])).toBe(false); // 105 > 100
  expect(check([10, 60, 40, 20])).toBe(true);
});

test('Example #13', () => {
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

  const checkName = simplify(v9s.def(false).use(checkNameRule));
  const checkValue = simplify(v9s.def(false).use(checkValueRule));

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
