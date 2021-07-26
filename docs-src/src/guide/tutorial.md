# Tutorial

## Simple example

v9s creates a rules chain. An execution of the chain starts at the end and finishes at the beginning (see the following examples). You may include your own rules in the chain with `use` method. Call `check` method to validate a value.

Easy example:

```ts
import v9s from 'v9s';

// create a validator instance with rules.
const validator = v9s.lte(100).gte(10);

const small = validator.check(1); // check small value

console.log(small); // false

const big = validator.check(110); // check big value

console.log(big); // false

const normal = validator.check(50); // check normal value

console.log(normal); // true
```

## Error messages

It is often necessary to add text messages instead of `true` or `false` result. Very easy, just add the second string parameter to a built-in rule or `use` method. Let's rewrite the previous example:

```ts
import v9s from 'v9s';

// create a validator instance with rules and error messages.
const validator = v9s.lte(100, 'too big').gte(10, 'too small');

const small = validator.check(1); // check small value

console.log(small); // 'too small'

const big = validator.check(110); // check big value

console.log(big); // 'too big'

const normal = validator.check(50); // check normal value

console.log(normal); // true
```

## Sequence

But what we have to do, if need to receive different error messages for the same rule with a number of thresholds? So, it's a time to remember a sequence of the chain execution.

```ts
import v9s from 'v9s';

// create a validator instance with a ordered chain of rules with error messages.
const validator = v9s.gte(100, 'small').gte(10, 'very small');

const verySmall = validator.check(9); // check a very small value

console.log(verySmall); // 'very small'

const small = validator.check(50); // check a small value

console.log(small); // 'small'

const normal = validator.check(110); // check a normal value

console.log(normal); // true
```

## Inversion

Sometimes we want to inverse a result of a rule. Easy! Meet the `not` method:

```ts
import v9s from 'v9s';

// create a validation instance with an inversed rule.
const validator = v9s.not().string();

const isNumber = validator.check(42); // check a number

console.log(isNumber); // true

const isString = validator.check('42'); // check a string

console..log(isString); // false (not a string)
```

## Optional modifier

Otherwise it is possible to allow `undefined` values:

```ts
import v9s from 'v9s';

const validator = v9s.string().optional();

const isNumber = validator.check(42); // check a number

console.log(isNumber); // false

const isString = validator.check('42'); // check a string

console.log(isString); // true

const isNotDefined = validator.check(undefined); // check undefined

console.log(isNotDefined); // true
```

The `optional` modifier applies only to the specified rule; the next rule ignores it.

## Composition

When it is necessary to add an alternative condition, it's time to use the `or` method:

```ts
import v9s from 'v9s';

const validator = v9s.string().optional().or(v9s.number());

const isString = validator.check('42');

console.log(isString); // true

const isNotDefined = validator.check(undefined);

console.log(isNotDefined); // true

const isNumber = validator.check(42);

console.log(isNumber); // true

const isBoolean = validator.check(true);

console.log(isBoolean); // false

const isNull = validator.check(null);

console.log(isNull); // false, because null !== undefined and may be a legal value
```

Usually it's not required to save a validator instance, just a check function:

```js
import v9s from 'v9s';

const check = v9s.string().optional().or(v9s.number()).check;

console.log(check('42')); // true
```

## External rules

Of course, the library contains a minimal number of rules inside, it is possible to use external rules. An external rule should be compatible with this signature:

```ts
type Rule = (value: any, context: any) => boolean;
```

Let's create our own rule which verifies that the string value is an integer number.

```ts
import v9s from 'v9s';

const integer = (value: string) => /^[0-9]+$/.test(value); // verify an integer string
const check = v9s.use(integer).check;

console.log(check('42')); // true
console.log(check('42a')); // false
```

## Modifiers

Okay, we are assured that our value is an integer string. Now add a range of valid values and convert the value to type `number` via `Modifier`:

```ts
import v9s from 'v9s';

const integer = (value: string) => /^[0-9]+$/.test(value);
const modify = (value: string) => Number(value); // convert a string to a number
const check = v9s.between(10, 100).use(integer, undefined, modify).check;

console.log(check('42')); // true
console.log(check('9')); // false
console.log(check('110')); // false
```

Modifier signature is:

```ts
type Modifier = (value: any, context: any) => any;
```

## Internationalization

Message factory functions can be used instead of string messages. That feature may be useful for internationalized applications.

```ts
import v9s from 'v9s';

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

const check = v9s.between(10, 100, errorMessageFactory).check;

console.log(check(50)); // true
console.log(check(110)); // 'Invalid value'

lang = Lang.de;

console.log(check(110)); // 'Ungültiger Wert'

lang = Lang.ru;

console.log(check(110)); // 'Неверное значение'
```

## Context

You've seen a `context` parameter in the previous examples. This is an object (by default: `{}`) that moves between rules in the chain and allows communication between them. It may contain an intermediate calculations, other subject fields and so on. In the following example the intermediate calculations are moved between rules:

```ts
import v9s from 'v9s';

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

const check = v9s.use(checkMaximum.bind(undefined, 100)).use(checkMinimum.bind(undefined, 10)).use(checkForDuplicates).check;

console.log(check([])); // false - empty
console.log(check([1, 6, 4, 2, 1])); // false - duplicates of `1`
console.log(check([1, 6, 4, 2])); // false - 1 < 10
console.log(check([10, 60, 105, 40, 20])); // false - 105 > 100
console.log(check([10, 60, 40, 20])); // true
```

Yet another way to use a context is a conditional check according to other fields of the object. `value` and `name` fields of the interface do matter only when all of them are not empty. In the following example the context argument is manually sent to the `check` function.

```ts
import v9s from 'v9s';

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

const checkName = v9s.use(checkNameRule).check;
const checkValue = v9s.use(checkValueRule).check;

const empty = { name: '', value: '' };

console.log(checkName(empty.name, empty), checkValue(empty.value, empty)); // true, true

const emptyName = { name: '', value: '42' };

console.log(checkName(emptyName.name, emptyName), checkValue(emptyName.value, emptyName)); // false, true

const emptyValue = { name: 'the answer', value: '' };

console.log(checkName(emptyValue.name, emptyValue), checkValue(emptyValue.value, emptyValue)); // true, false

const filled = { name: 'the answer', value: '42' };

console.log(checkName(filled.name, filled), checkValue(filled.value, filled)); // true, true
```
