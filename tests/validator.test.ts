import v9s from '@/index';
import exp from 'constants';

test('Use an external validation function', () => {
  const min = function (minimum: number, value: string) {
    return minimum <= Number(value);
  };

  const check = v9s.use(min.bind(undefined, 10)).check;

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

  const check = v9s.use(minOrMax.bind(undefined, 10), 'invalid').use(minLength.bind(undefined, 2), 'short').check;

  expect(check(20)).toBe(true);
  expect(check(20, { set: true })).toBe(true);
  expect(check('20', { set: true })).toBe('invalid');
  expect(check('20')).toBe(true);
  expect(check('1')).toBe('short');
  expect(check(9)).toBe('invalid');
  expect(check(9, { inverse: true })).toBe(true);
});

test('Optional chain', () => {
  const check = v9s.lte(100).optional().check;

  expect(check(10)).toBe(true);
  expect(check(120)).toBe(false);
  expect(check(undefined)).toBe(true);
});

test('Inversed chain', () => {
  const check = v9s.not().gte(10).check;

  expect(check(9)).toBe(true);
  expect(check(11)).toBe(false);
});

test('Conditional chain (a string with a length between 2 and 10 chars or a number between 10 and 100)', () => {
  const check = v9s.lengthBetween(2, 10).string().or(v9s.between(10, 100).number()).check;

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
  const check = v9s.lte(100).gte(10, undefined, (value: number) => value * 2).check;

  expect(check(20)).toBe(true);
  expect(check(9)).toBe(false);
  expect(check(50)).toBe(true);
  expect(check(51)).toBe(false);
});

test('Combined not, or and optional methods usage', () => {
  const check = v9s.boolean().or(v9s.not().between(10, 100).number()).optional().check;

  expect(check(undefined)).toBe(true);
  expect(check(true)).toBe(true);
  expect(check(false)).toBe(true);
  expect(check('test')).toBe(false);
  expect(check(20)).toBe(false);
  expect(check(10)).toBe(false);
  expect(check(5)).toBe(true);
  expect(check(120)).toBe(true);

  const check2 = v9s.not().boolean().optional().check;

  expect(check2(undefined)).toBe(true);
  expect(check2(true)).toBe(false);
  expect(check2(false)).toBe(false);
  expect(check2(1)).toBe(true);
  expect(check2('')).toBe(true);
});

test('Proxy instance behavior', () => {
  expect(v9s.check(42)).toBe(true);
  expect(v9s.not().check(undefined)).toBe(true);
  expect(v9s.optional().check(null)).toBe(true);
  expect(v9s.or(v9s).check(true)).toBe(true);
});
