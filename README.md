# v9s

_v9s_ means _validations_. It is a small validation library with no dependencies and full TypeScript support. You use chains of rules to get a complex validation.

## Contents

1. [Motivation](#motivation)
2. [Goals](#goals)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Built-in rules](#built-in-rules)
   1. [string](#string)
   2. [number](#number)
   3. [boolean](#boolean)
   4. [object](#object)
   5. [null](#null)
   6. [defined](#defined)
   7. [notDefined](#notDefined)
   8. [none](#none)
   9. [notNone](#notNone)
   10. [eq](#eq)
   11. [ne](#ne)
   12. [gt](#gt)
   13. [gte](#gte)
   14. [lt](#lt)
   15. [lte](#lte)
   16. [between](#between)
   17. [minLength](#minLength)
   18. [maxLength](#maxLength)
   19. [strictLength](#strictLength)
   20. [lengthBetween](#lengthBetween)
6. [License](#license)

## Motivation

The searching of a small and flexible validation library which works with and without TypeScript was failed. Some libraries work with only with or without TypeScipt, others contain too many useless prepared validation rules, which aren't used in our project.

## Goals

So, our goal is a small and flexible library without external dependencies that works perfectly good with and without TypeScript.

## Installation

```sh
npm i v9s
```

## Usage

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

it is often necessary to add text messages instead of `true` or `false` result. Very easy, just add the second string parameter to a built-in rule or `use` method. Let's rewrite the previous example:

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

## Built-in rules

### string

The `string()` method applies a built-in rule that verifies a value if the value type is `string`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.string().check;

console.log(check('42')); // true
console.log(check(42)); // false
```

### number

The `number()` method applies a built-in rule that verifies a value if the value type is `number`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.number().check;

console.log(check(42)); // true
console.log(check('42')); // false
```

### boolean

The `boolean()` method applies a built-in rule that verifies a value if the value type is `boolean`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.boolean().check;

console.log(check(true)); // true
console.log(check(42)); // false
```

### object

The `object()` method applies a built-in rule that verifies a value if the value type is `object` and the value is not `null`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.object().check;

console.log(check({})); // true
console.log(check(null)); // false
console.log(check(42)); // false
```

### null

The `null()` method applies a built-in rule that verifies a value if the value is `null`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.null().check;

console.log(check(null)); // true
console.log(check({})); // false
console.log(check(42)); // false
```

### defined

The `defined()` method applies a built-in rule that verifies a value if the value is not `undefined`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.defined().check;

console.log(check(42)); // true
console.log(check(null)); // true
console.log(check(undefined)); // false
```

### notDefined

The `notDefined()` method applies a built-in rule that verifies a value if the value is `undefined`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.notDefined().check;

console.log(check(undefined)); // true
console.log(check(42)); // false
console.log(check(null)); // false
```

### none

The `none()` method applies a built-in rule that verifies a value if the value is `null` or `undefined`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.none().check;

console.log(check(undefined)); // true
console.log(check(null)); // true
console.log(check(42)); // false
```

### notNone

The `notNone()` method applies a built-in rule that verifies a value if the value is not `null` or `undefined`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.none().check;

console.log(check(42)); // true
console.log(check(undefined)); // false
console.log(check(null)); // false
```

### eq

The `eq()` method applies a built-in rule that verifies a value if the value is equal to the referenced value.

Example:

```ts
import v9s from 'v9s';

const check = v9s.eq(42).check;

console.log(check(42)); // true
console.log(check(43)); // false
console.log(check('42')); // false
```

### ne

The `ne()` method applies a built-in rule that verifies a value if the value is not equal to the referenced value.

Example:

```ts
import v9s from 'v9s';

const check = v9s.ne(42).check;

console.log(check(43)); // true
console.log(check('42')); // true
console.log(check(42)); // false
```

### gt

The `gt()` method applies a built-in rule that verifies a value if the value is greater than the threshold.

Example:

```ts
import v9s from 'v9s';

const check = v9s.gt(42).check;

console.log(check(43)); // true
console.log(check(42)); // false
```

### gte

The `gte()` method applies a built-in rule that verifies a value if the value is greater than or equal to the threshold.

Example:

```ts
import v9s from 'v9s';

const check = v9s.gte(42).check;

console.log(check(43)); // true
console.log(check(42)); // true
console.log(check(41)); // false
```

### lt

The `lt()` method applies a built-in rule that verifies a value if the value is less than the threshold.

Example:

```ts
import v9s from 'v9s';

const check = v9s.lt(42).check;

console.log(check(41)); // true
console.log(check(42)); // false
```

### lte

The `lte()` method applies a built-in rule that verifies a value if the value is less than or equal to the threshold.

Example:

```ts
import v9s from 'v9s';

const check = v9s.lte(42).check;

console.log(check(41)); // true
console.log(check(42)); // true
console.log(check(43)); // false
```

### between

The `between()` method applies a built-in rule that verifies a value if the value is between minimum and maximum reference values, inclusive.

Example:

```ts
import v9s from 'v9s';

const check = v9s.between(10, 100).check;

console.log(check(10)); // true
console.log(check(50)); // true
console.log(check(9)); // false
console.log(check(101)); // false
```

### minLength

The `minLength()` method applies a built-in rule that verifies a value if the value length is greater than or equal to the specified minimum length.

Example:

```ts
import v9s from 'v9s';

const check = v9s.minLength(5).check;

console.log(check('halo')); // false
console.log(check('hello')); // true
console.log(check('hello, world')); // true
console.log(check([0, 1, 2, 3, 4])); // true
```

### maxLength

The `maxLength()` method applies a built-in rule that verifies a value if the value length is less than or equal to the specified minimum length.

Example:

```ts
import v9s from 'v9s';

const check = v9s.minLength(5).check;

console.log(check('halo')); // true
console.log(check('hello')); // true
console.log(check('hello, world')); // false
console.log(check([0, 1, 2, 3, 4])); // true
```

### strictLength

The `strictLength()` method applies a built-in rule that verifies a value if the value length is less than or equal to the specified minimum length.

Example:

```ts
import v9s from 'v9s';

const check = v9s.strictLength(5).check;

console.log(check('halo')); // false
console.log(check('hello')); // true
console.log(check('hello, world')); // false
console.log(check([0, 1, 2, 3, 4])); // true
```

### lengthBetween

The `lengthBetween()` method applies a built-in rule that verifies a value if the value length is between minimum and maximum lengths, inclusive.

Example:

```ts
import v9s from 'v9s';

const check = v9s.lengthBetween(5, 12).check;

console.log(check('halo')); // false
console.log(check('hello')); // true
console.log(check('hello, world')); // true
console.log(check([0, 1, 2, 3, 4])); // true
```

## LICENSE

[MIT](./LICENSE)
