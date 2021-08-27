import v9s, { simplify } from '@/index';

test('Simple volume tuner validation (between)', () => {
  const check = simplify(v9s<string>().between(0, 100, 'Unexpected volume'));

  expect(check(10)).toBe(true);
  expect(check(120)).toBe('Unexpected volume');
  expect(check(-1)).toBe('Unexpected volume');
});

test('Simple volume tuner validation (gte and lte', () => {
  const check = simplify(v9s<string>().lte(100, 'The volume is too loud').gte(0, 'The volume cannot be less than the silence'));

  expect(check(10)).toBe(true);
  expect(check(120)).toBe('The volume is too loud');
  expect(check(-1)).toBe('The volume cannot be less than the silence');
});

test('Simple volume tuner validation (gt and lt)', () => {
  const check = simplify(v9s<string>().lt(101, 'The volume is too loud').gt(-1, 'The volume cannot be less than the silence'));

  expect(check(10)).toBe(true);
  expect(check(120)).toBe('The volume is too loud');
  expect(check(-1)).toBe('The volume cannot be less than the silence');
  expect(check(-0.5)).toBe(true);
});

test('Check the argument type to be a string', () => {
  const check = simplify(v9s(false).string());

  expect(check('string argument')).toBe(true);
  expect(check(1)).toBe(false);
});

test('Check the argument type to be a number', () => {
  const check = simplify(v9s(false).number());

  expect(check('string argument')).toBe(false);
  expect(check({})).toBe(false);
  expect(check(NaN)).toBe(true);
  expect(check(true)).toBe(false);
  expect(check(42)).toBe(true);
});

test('Check the argument type to be a boolean', () => {
  const check = simplify(v9s(false).boolean());

  expect(check(true)).toBe(true);
  expect(check(false)).toBe(true);
  expect(check(1)).toBe(false);
  expect(check('')).toBe(false);
  expect(check(null)).toBe(false);
});

test('Make sure the argument type is object', () => {
  const check = simplify(v9s(false).object());

  class testClass {}

  expect(check({})).toBe(true);
  expect(check(null)).toBe(false);
  expect(check(new testClass())).toBe(true);
  expect(check(1)).toBe(false);
  expect(check('')).toBe(false);
});

test('Make sure the argument is null', () => {
  const check = simplify(v9s(false).null());

  expect(check(null)).toBe(true);
  expect(check({})).toBe(false);
  expect(check(42)).toBe(false);
});

test('Make sure the argument is defined', () => {
  const check = simplify(v9s(false).defined());

  expect(check(undefined)).toBe(false);
  expect(check(0)).toBe(true);
  expect(check(null)).toBe(true);
  expect(check('')).toBe(true);
});

test('Make sure the argument is not defined', () => {
  const check = simplify(v9s(false).notDefined());

  expect(check(undefined)).toBe(true);
  expect(check(0)).toBe(false);
  expect(check(null)).toBe(false);
  expect(check('')).toBe(false);
});

test('Make sure the argument is none (null or undefined)', () => {
  const check = simplify(v9s(false).none());

  expect(check(undefined)).toBe(true);
  expect(check(null)).toBe(true);
  expect(check(false)).toBe(false);
  expect(check('')).toBe(false);
});

test('Make sure the argument is not null or undefined', () => {
  const check = simplify(v9s(false).notNone());

  expect(check(undefined)).toBe(false);
  expect(check(null)).toBe(false);
  expect(check(false)).toBe(true);
  expect(check('')).toBe(true);
});

test('Make sure the argument is equal to the reference', () => {
  const check = simplify(v9s(false).eq(24));

  expect(check(24)).toBe(true);
  expect(check(42)).toBe(false);
  expect(check('24')).toBe(false);

  const stringCheck = simplify(v9s(false).eq('str'));

  expect(stringCheck('str')).toBe(true);
  expect(stringCheck('string')).toBe(false);
  expect(stringCheck(42)).toBe(false);
});

test("Make sure the argument isn't equal to the reference", () => {
  const check = simplify(v9s(false).ne(42));

  expect(check(24)).toBe(true);
  expect(check(42)).toBe(false);
  expect(check('24')).toBe(true);

  const stringCheck = simplify(v9s(false).ne('string'));

  expect(stringCheck('str')).toBe(true);
  expect(stringCheck('string')).toBe(false);
  expect(stringCheck(42)).toBe(true);
});

test('Validate minimum and maximum string length (minLength and maxLength)', () => {
  const check = simplify(v9s<string>().maxLength(10, 'too long').minLength(5, 'too short'));

  expect(check('halo')).toBe('too short');
  expect(check('validations')).toBe('too long');
  expect(check('ready')).toBe(true);
  expect(check([])).toBe('too short');
  expect(check(new Array(20))).toBe('too long');
  expect(check([1, 2, 3, 4, 5, 6])).toBe(true);
});

test('Validate minimum and maximum string length (lengthBetween', () => {
  const check = simplify(v9s(false).lengthBetween(5, 10));

  expect(check('halo')).toBe(false);
  expect(check('validations')).toBe(false);
  expect(check('ready')).toBe(true);
  expect(check([])).toBe(false);
  expect(check(new Array(20))).toBe(false);
  expect(check([1, 2, 3, 4, 5, 6])).toBe(true);
});

test('Validate the strict length of a string', () => {
  const check = simplify(v9s(false).strictLength(2));

  expect(check('')).toBe(false);
  expect(check('validations')).toBe(false);
  expect(check('he')).toBe(true);
  expect(check(new Array(2))).toBe(true);
  expect(check(new Array(4))).toBe(false);
});
