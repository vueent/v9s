import v9s from '@/index';

test('Simple volume tuner validation (between)', () => {
  const check = v9s.between(0, 100, 'Unexpected volume').check;

  expect(check(10)).toBe(true);
  expect(check(120)).toBe('Unexpected volume');
  expect(check(-1)).toBe('Unexpected volume');
});

test('Simple volume tuner validation (gte and lte', () => {
  const check = v9s.lte(100, 'The volume is too loud').gte(0, 'The volume cannot be less than the silence').check;

  expect(check(10)).toBe(true);
  expect(check(120)).toBe('The volume is too loud');
  expect(check(-1)).toBe('The volume cannot be less than the silence');
});

test('Simple volume tuner validation (gt and lt)', () => {
  const check = v9s.lt(101, 'The volume is too loud').gt(-1, 'The volume cannot be less than the silence').check;

  expect(check(10)).toBe(true);
  expect(check(120)).toBe('The volume is too loud');
  expect(check(-1)).toBe('The volume cannot be less than the silence');
  expect(check(-0.5)).toBe(true);
});

test('Check the argument type to be a string', () => {
  const check = v9s.string().check;

  expect(check('string argument')).toBe(true);
  expect(check(1)).toBe(false);
});

test('Check the argument type to be a number', () => {
  const check = v9s.number().check;

  expect(check('string argument')).toBe(false);
  expect(check({})).toBe(false);
  expect(check(NaN)).toBe(true);
  expect(check(true)).toBe(false);
  expect(check(42)).toBe(true);
});

test('Check the argument type to be a boolean', () => {
  const check = v9s.boolean().check;

  expect(check(true)).toBe(true);
  expect(check(false)).toBe(true);
  expect(check(1)).toBe(false);
  expect(check('')).toBe(false);
  expect(check(null)).toBe(false);
});

test('Make sure the argument type is object', () => {
  const check = v9s.object().check;

  class testClass {}

  expect(check({})).toBe(true);
  expect(check(null)).toBe(false);
  expect(check(new testClass())).toBe(true);
  expect(check(1)).toBe(false);
  expect(check('')).toBe(false);
});

test('Make sure the argument is null', () => {
  const check = v9s.null().check;

  expect(check(null)).toBe(true);
  expect(check({})).toBe(false);
  expect(check(42)).toBe(false);
});

test('Make sure the argument is defined', () => {
  const check = v9s.defined().check;

  expect(check(undefined)).toBe(false);
  expect(check(0)).toBe(true);
  expect(check(null)).toBe(true);
  expect(check('')).toBe(true);
});

test('Make sure the argument is not defined', () => {
  const check = v9s.notDefined().check;

  expect(check(undefined)).toBe(true);
  expect(check(0)).toBe(false);
  expect(check(null)).toBe(false);
  expect(check('')).toBe(false);
});

test('Make sure the argument is none (null or undefined)', () => {
  const check = v9s.none().check;

  expect(check(undefined)).toBe(true);
  expect(check(null)).toBe(true);
  expect(check(false)).toBe(false);
  expect(check('')).toBe(false);
});

test('Make sure the argument is not null or undefined', () => {
  const check = v9s.notNone().check;

  expect(check(undefined)).toBe(false);
  expect(check(null)).toBe(false);
  expect(check(false)).toBe(true);
  expect(check('')).toBe(true);
});

test('Make sure the argument is equal to the reference', () => {
  const check = v9s.eq(24).check;

  expect(check(24)).toBe(true);
  expect(check(42)).toBe(false);
  expect(check('24')).toBe(false);

  const stringCheck = v9s.eq('str').check;

  expect(stringCheck('str')).toBe(true);
  expect(stringCheck('string')).toBe(false);
  expect(stringCheck(42)).toBe(false);
});

test("Make sure the argument isn't equal to the reference", () => {
  const check = v9s.ne(42).check;

  expect(check(24)).toBe(true);
  expect(check(42)).toBe(false);
  expect(check('24')).toBe(true);

  const stringCheck = v9s.ne('string').check;

  expect(stringCheck('str')).toBe(true);
  expect(stringCheck('string')).toBe(false);
  expect(stringCheck(42)).toBe(true);
});

test('Validate minimum and maximum string length (minLength and maxLength)', () => {
  const check = v9s.maxLength(10, 'too long').minLength(5, 'too short').check;

  expect(check('halo')).toBe('too short');
  expect(check('validations')).toBe('too long');
  expect(check('ready')).toBe(true);
  expect(check([])).toBe('too short');
  expect(check(new Array(20))).toBe('too long');
  expect(check([1, 2, 3, 4, 5, 6])).toBe(true);
});

test('Validate minimum and maximum string length (lengthBetween', () => {
  const check = v9s.lengthBetween(5, 10).check;

  expect(check('halo')).toBe(false);
  expect(check('validations')).toBe(false);
  expect(check('ready')).toBe(true);
  expect(check([])).toBe(false);
  expect(check(new Array(20))).toBe(false);
  expect(check([1, 2, 3, 4, 5, 6])).toBe(true);
});

test('Validate the strict length of a string', () => {
  const check = v9s.strictLength(2).check;

  expect(check('')).toBe(false);
  expect(check('validations')).toBe(false);
  expect(check('he')).toBe(true);
  expect(check(new Array(2))).toBe(true);
  expect(check(new Array(4))).toBe(false);
});
