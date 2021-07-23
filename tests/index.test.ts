import v9s from '@/index';

test('Simple volume tuner validation (min and max)', () => {
  const check = v9s.max(100, 'The volume is to loud').min(0, 'The volume cannot be less than the silence').check;

  expect(check(10)).toBe(true);
  expect(check(120)).toBe('The volume is to loud');
  expect(check(-1)).toBe('The volume cannot be less than the silence');
});

test('Simple volume tuner validation (between)', () => {
  const check = v9s.between(0, 100, 'Unexpected volume').check;

  expect(check(10)).toBe(true);
  expect(check(120)).toBe('Unexpected volume');
  expect(check(-1)).toBe('Unexpected volume');
});

test('Simple volume tuner validation (gte and lte', () => {
  const check = v9s.lte(100, 'The volume is to loud').gte(0, 'The volume cannot be less than the silence').check;

  expect(check(10)).toBe(true);
  expect(check(120)).toBe('The volume is to loud');
  expect(check(-1)).toBe('The volume cannot be less than the silence');
});
