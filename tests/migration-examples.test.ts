import v9s, { simplify } from '@/index';

test('Migration example #1', () => {
  const check = v9s<string>().number('not a number').gte(10, 'too very small').gte(100, 'too small').check;

  expect(check('42')).toBe('not a number');
  expect(check(5)).toBe('too very small');
  expect(check(50)).toBe('too small');
  expect(check(105)).toBe(undefined);
});

test('Migration example #2', () => {
  const check = simplify(v9s<string>().number('not a number').gte(10, 'too very small').gte(100, 'too small'));

  expect(check('42')).toBe('not a number');
  expect(check(5)).toBe('too very small');
  expect(check(50)).toBe('too small');
  expect(check(105)).toBe(true);
});

test('Migration example #3', () => {
  const check = simplify(v9s(false).number().gte(10).lte(100));

  expect(check('42')).toBe(false);
  expect(check(5)).toBe(false);
  expect(check(105)).toBe(false);
  expect(check(50)).toBe(true);
});
