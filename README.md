# v9s

<p align="center">
  <img src="docs-src/src/.vuepress/public/img/logo.png">
</p>

_v9s_ means _validations_. It is a small validation library with no dependencies and full TypeScript support. _Use chains of rules to get a complex validation._ See the [documentation](https://vueent.github.io/v9s/) (English and Russian).

[![Build Status](https://travis-ci.com/vueent/v9s.svg?branch=main)](https://travis-ci.com/vueent/v9s)

This is a README of 2.x follow the documentation pages to see [1.x](https://vueent.github.io/v9s/v1).

## Contents

1. [Motivation](#motivation)
2. [Goals](#goals)
3. [Installation](#installation)
4. [Migration](#migration)
5. [Usage](#usage)
   1. [Simple example](#simple-example)
   2. [Error messages](#error-messages)
   3. [Simplifier](#simplifier)
   4. [Sequence](#sequence)
   5. [Inversion](#inversion)
   6. [Optional modifier](#optional-modifier)
   7. [Composition](#composition)
   8. [External rules](#external-rules)
   9. [Modifiers](#modifiers)
   10. [Injections](#injections)
   11. [Internationalization](#internationalization)
   12. [Result object](#result-object)
   13. [Context](#context)
6. [Built-in rules](#built-in-rules)
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
7. [License](#license)

## Motivation

The searching of a small and flexible validation library which works with and without TypeScript was failed. Some libraries work with only with or without TypeScipt, others contain too many useless prepared validation rules, which aren't used in our project.

## Goals

So, our goal is a small and flexible library without external dependencies that works perfectly good with and without TypeScript.

## Installation

```sh
npm install v9s
```

## Migration

There are some breaking changes between v1 and v2 of v9s. First of all, the chain execution direction was changed to the human friendly _left-to-right_. Second, the default library export (`default export`) became a function which specifies a type of error messages and the optional default error message. Third, `check` method returns `T | undefined` (here `T` - the error message type) instead of `T | boolean`.

#### v1

```ts
import v9s from 'v9s';

const check = v9s.gte(100, 'too small').gte(10, 'too very small').number('not a number').check;

console.log(check('42')); // 'not a number'
console.log(check(5)); // 'too very small'
console.log(check(50)); // 'too small'
console.log(check(105)); // true
```

#### v2

```ts
import v9s from 'v9s';

const check = v9s<string>(/* default error message */)
  .number('not a number')
  .gte(10, 'too very small')
  .gte(100, 'too small').check;

console.log(check('42')); // 'not a number'
console.log(check(5)); // 'too very small'
console.log(check(50)); // 'too small'
console.log(check(105)); // undefined
```

If you want to preserve of v1 behavior use the `simplify` wrapper and reverse the rule order:

#### v1

```ts
import v9s from 'v9s';

const check = v9s.gte(100, 'too small').gte(10, 'too very small').number('not a number').check;

console.log(check('42')); // 'not a number'
console.log(check(5)); // 'too very small'
console.log(check(50)); // 'too small'
console.log(check(105)); // true
```

#### v2

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(
  v9s<string>(/* default error message */).number('not a number').gte(10, 'too very small').gte(100, 'too small')
);

console.log(check('42')); // 'not a number'
console.log(check(5)); // 'too very small'
console.log(check(50)); // 'too small'
console.log(check(105)); // true
```

To receive only a `true/false` result follow the next pattern (**the chain is different**):

#### v1

```ts
import v9s from 'v9s';

const check = v9s.lte(100).gte(10).number().check;

console.log(check('42')); // false
console.log(check(5)); // false
console.log(check(105)); // false
console.log(check(50)); // true
```

#### v2

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).number().gte(10).lte(100));

console.log(check('42')); // false
console.log(check(5)); // false
console.log(check(105)); // false
console.log(check(50)); // true
```

## Usage

### Simple example

`v9s` creates a rules chain. You may include your own rules in the chain with `use` or inject an extension via `inject` method. Call `check` method to validate a value.

Easy example:

```ts
import v9s from 'v9s';

// create a validator instance with rules.
const validator = v9s(false).lte(100).gte(10);

const small = validator.check(1); // check small value

console.log(small); // false

const big = validator.check(110); // check big value

console.log(big); // false

const normal = validator.check(50); // check normal value

console.log(normal); // undefined
```

As you can see, if there are no errors, the `undefined` value will be returned.

### Error messages

When you import the library you import the `def` function which sets up a type of error messages and optionally a default error message. By default `check` method returns `T | undefined` there `T` is a type of error messages. To use strings a error messages just set a message type (`T`) to `string`.

Example:

```ts
import v9s from 'v9s';

// create a validator instance with rules and error messages.
const validator = v9s<string>('invalid value').lte(100).gte(10);

const small = validator.check(1); // check small value

console.log(small); // 'invalid value'

const big = validator.check(110); // check big value

console.log(big); // 'invalid value'

const normal = validator.check(50); // check normal value

console.log(normal); // undefined
```

Let's rewrite the previous example to use different error messages for each rule:

```ts
import v9s from 'v9s';

// create a validator instance with rules and error messages.
const validator = v9s<string>().lte(100, 'too big').gte(10, 'too small');

const small = validator.check(1); // check small value

console.log(small); // 'too small'

const big = validator.check(110); // check big value

console.log(big); // 'too big'

const normal = validator.check(50); // check normal value

console.log(normal); // undefined
```

**WARNING**

If no default error message is specified and no error message is specified for some rule in the chain too, an exception will be thrown.

```ts
import v9s from 'v9s';

// create a validator instance with rules.
const validator = v9s<string>().lte(100).gte(10);

const normal = validator.check(50); // check normal value

console.log(normal); // undefined

const small = validator.check(1); // Ooops! Error('Undefined default negative value')
```

If you need to use an another message format - set the type:

```ts
import v9s from 'v9s';

enum ValidationError {
  tooSmall,
  tooBig
}

const validator = v9s<ValidationError>().lte(100, ValidationError.tooBig).gte(10, ValidationError.tooSmall);

const small = validator.check(1); // check small value

console.log(small); // 0

const big = validator.check(110); // check big value

console.log(big); // 1

const normal = validator.check(50); // check normal value

console.log(normal); // undefined
```

### Simplifier

Sometimes it is enough to get a boolean result without other special types or `undefined`. The library provides a function that wraps a validator instance for this. The `simplify` function returns a function with a signature similar to the signature of the `check` method:

```ts
type CheckFunc<T> = (value: any, context: any) => T | undefined;
```

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).lte(100).gte(10));

const small = check(1); // check small value

console.log(small); // false

const big = check(110); // check big value

console.log(big); // false

const normal = check(50); // check normal value

console.log(normal); // true
```

### Sequence

But what we have to do, if need to receive different error messages for the same rule with a number of thresholds? So, it's a time to remember a sequence of the chain execution.

```ts
import v9s from 'v9s';

// create a validator instance with a ordered chain of rules with error messages.
const validator = v9s<string>().gte(10, 'very small').gte(100, 'small');

const verySmall = validator.check(9); // check a very small value

console.log(verySmall); // 'very small'

const small = validator.check(50); // check a small value

console.log(small); // 'small'

const normal = validator.check(110); // check a normal value

console.log(normal); // undefined
```

### Inversion

Sometimes we want to inverse a result of a rule. Easy! Meet the `not` method:

```ts
import v9s from 'v9s';

// create a validation instance with an inversed rule.
const validator = v9s(false).not().string();

const isNumber = validator.check(42); // check a number

console.log(isNumber); // undefined

const isString = validator.check('42'); // check a string

console..log(isString); // false (not a string)
```

### Optional modifier

Otherwise it is possible to allow `undefined` values:

```ts
import v9s from 'v9s';

const validator = v9s(false).string().optional();

const isNumber = validator.check(42); // check a number

console.log(isNumber); // false

const isString = validator.check('42'); // check a string

console.log(isString); // undefined

const isNotDefined = validator.check(undefined); // check undefined

console.log(isNotDefined); // undefined
```

**WARNING**

The `optional` modifier applies only to the specified rule; the next rule ignores it.

### Composition

When it is necessary to add an alternative condition, it's time to use the `or` method:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).string().optional().or(v9s(false).number()));

const isString = check('42');

console.log(isString); // true

const isNotDefined = check(undefined);

console.log(isNotDefined); // true

const isNumber = check(42);

console.log(isNumber); // true

const isBoolean = check(true);

console.log(isBoolean); // false

const isNull = validator.check(null);

console.log(isNull); // false, because null !== undefined and may be a legal value
```

Usually it's not required to save a validator instance, just a check function:

```js
import v9s from 'v9s';

const check = v9s(false).string().optional().or(v9s(false).number()).check;

console.log(check('42')); // undefined
```

### External rules

Of course, the library contains a minimal number of rules inside, it is possible to use external rules. An external rule should be compatible with this signature:

```ts
type Rule = (value: any, context: any) => boolean;
```

Let's create our own rule which verifies that the string value is an integer number.

```ts
import v9s, { simplify } from 'v9s';

const integer = (value: string) => /^[0-9]+$/.test(value); // verify an integer string
const check = simplify(v9s(false).use(integer));

console.log(check('42')); // true
console.log(check('42a')); // false
```

### Modifiers

Okay, we are assured that our value is an integer string. Now add a range of valid values and convert the value to type `number` via `Modifier`:

```ts
import v9s, { simplify } from 'v9s';

const integer = (value: string) => /^[0-9]+$/.test(value);
const modify = (value: string) => Number(value); // convert a string to a number
const check = simplify(v9s(false).use(integer, undefined, modify).between(10, 100));

console.log(check('42')); // true
console.log(check('9')); // false
console.log(check('110')); // false
```

Modifier signature is:

```ts
type Modifier = (value: any, context: any) => any;
```

### Injections

Unlike external rules, injections allows to specify an other chain via a validator instance or a function with a signature similar to the signature of the `check` method. That chain will be checked before the main chain. For example, let's write primitive `each` injection:

```ts
import v9s, { CheckFunc, Message, MessageFactory, Validator } from 'v9s';

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

console.log(check('[1, 2, 3]')); // 'not array'
console.log(check(['1', '2', '3'])); // 'not a number'
console.log(check([1, 2, 3, 11])); // 'too small'
console.log(check([2, 3, 11])); // 'too big'
console.log(check([2, 3])); // undefined
}
```

**TIP**

Checking complete schemas isn't the goal of v9s, but as you can see it is possible.

### Internationalization

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

const check = v9s<string>().between(10, 100, errorMessageFactory).check;

console.log(check(50)); // undefined
console.log(check(110)); // 'Invalid value'

lang = Lang.de;

console.log(check(110)); // 'Ungültiger Wert'

lang = Lang.ru;

console.log(check(110)); // 'Неверное значение'
```

**TIP**

If you have to receive functions as error messages, specify messages via factories: `() => errorMessageFunction`.

### Result object

In some situations you may want to receive an object with a state field instead of the pure result or `undefined`. The `objectify` wrapper makes the chain return an instance of the following class:

```ts
/**
 * Successful or failed validation result.
 */
export class ValidationResult<T> {
  /**
   * Error message.
   */
  public readonly error?: T;

  /**
   * Validation result state.
   */
  public readonly success: boolean;

  constructor(error?: T) {
    this.error = error;
    this.success = error === undefined;
  }
}
```

Example:

```ts
import v9s, { objectify } from 'v9s';

const check = objectify(v9s('invalid').number('not a number').gte(10).lte(100));

const isString = check('42');

console.log(isString.success); // false
console.log(isString.error); // 'not a number'

const tooSmall = check(5);

console.log(tooSmall.success); // false
console.log(tooSmall.error); // 'invalid'

const tooBig = check(110);

console.log(tooBig.success); // false
console.log(tooBig.error); // 'invalid'

const normal = check(50);

console.log(normal.success); // true
console.log(normal.error); // undefined
```

### Context

You've seen a `context` parameter in the previous examples. This is an object (by default: `{}`) that moves between rules in the chain and allows communication between them. It may contain an intermediate calculations, other subject fields and so on. In the following example the intermediate calculations are moved between rules:

```ts
import v9s, { simplify } from 'v9s';

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

console.log(check([])); // false - empty
console.log(check([1, 6, 4, 2, 1])); // false - duplicates of `1`
console.log(check([1, 6, 4, 2])); // false - 1 < 10
console.log(check([10, 60, 105, 40, 20])); // false - 105 > 100
console.log(check([10, 60, 40, 20])); // true
```

Yet another way to use a context is a conditional check according to other fields of the object. `value` and `name` fields of the interface do matter only when all of them are not empty. In the following example the context argument is manually sent to the `check` function.

```ts
import v9s, { simplify } from 'v9s';

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
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).string());

console.log(check('42')); // true
console.log(check(42)); // false
```

or

```ts
import v9s from 'v9s';

const check = v9s(false).string().check;

console.log(check('42')); // undefined
console.log(check(42)); // false
```

### number

The `number()` method applies a built-in rule that verifies a value if the value type is `number`.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).number().check);

console.log(check(42)); // true
console.log(check('42')); // false
```

### boolean

The `boolean()` method applies a built-in rule that verifies a value if the value type is `boolean`.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).boolean().check);

console.log(check(true)); // true
console.log(check(42)); // false
```

### object

The `object()` method applies a built-in rule that verifies a value if the value type is `object` and the value is not `null`.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).object().check);

console.log(check({})); // true
console.log(check(null)); // false
console.log(check(42)); // false
```

### null

The `null()` method applies a built-in rule that verifies a value if the value is `null`.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).null().check);

console.log(check(null)); // true
console.log(check({})); // false
console.log(check(42)); // false
```

### defined

The `defined()` method applies a built-in rule that verifies a value if the value is not `undefined`.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).defined().check);

console.log(check(42)); // true
console.log(check(null)); // true
console.log(check(undefined)); // false
```

### notDefined

The `notDefined()` method applies a built-in rule that verifies a value if the value is `undefined`.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).notDefined().check);

console.log(check(undefined)); // true
console.log(check(42)); // false
console.log(check(null)); // false
```

### none

The `none()` method applies a built-in rule that verifies a value if the value is `null` or `undefined`.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).none().check);

console.log(check(undefined)); // true
console.log(check(null)); // true
console.log(check(42)); // false
```

### notNone

The `notNone()` method applies a built-in rule that verifies a value if the value is not `null` or `undefined`.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).none().check);

console.log(check(42)); // true
console.log(check(undefined)); // false
console.log(check(null)); // false
```

### eq

The `eq()` method applies a built-in rule that verifies a value if the value is equal to the referenced value.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).eq(42).check);

console.log(check(42)); // true
console.log(check(43)); // false
console.log(check('42')); // false
```

### ne

The `ne()` method applies a built-in rule that verifies a value if the value is not equal to the referenced value.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).ne(42).check);

console.log(check(43)); // true
console.log(check('42')); // true
console.log(check(42)); // false
```

### gt

The `gt()` method applies a built-in rule that verifies a value if the value is greater than the threshold.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).gt(42).check);

console.log(check(43)); // true
console.log(check(42)); // false
```

### gte

The `gte()` method applies a built-in rule that verifies a value if the value is greater than or equal to the threshold.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).gte(42).check);

console.log(check(43)); // true
console.log(check(42)); // true
console.log(check(41)); // false
```

### lt

The `lt()` method applies a built-in rule that verifies a value if the value is less than the threshold.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).lt(42).check);

console.log(check(41)); // true
console.log(check(42)); // false
```

### lte

The `lte()` method applies a built-in rule that verifies a value if the value is less than or equal to the threshold.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).lte(42).check);

console.log(check(41)); // true
console.log(check(42)); // true
console.log(check(43)); // false
```

### between

The `between()` method applies a built-in rule that verifies a value if the value is between minimum and maximum reference values, inclusive.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).between(10, 100).check);

console.log(check(10)); // true
console.log(check(50)); // true
console.log(check(9)); // false
console.log(check(101)); // false
```

### minLength

The `minLength()` method applies a built-in rule that verifies a value if the value length is greater than or equal to the specified minimum length.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).minLength(5).check);

console.log(check('halo')); // false
console.log(check('hello')); // true
console.log(check('hello, world')); // true
console.log(check([0, 1, 2, 3, 4])); // true
```

### maxLength

The `maxLength()` method applies a built-in rule that verifies a value if the value length is less than or equal to the specified minimum length.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).minLength(5).check);

console.log(check('halo')); // true
console.log(check('hello')); // true
console.log(check('hello, world')); // false
console.log(check([0, 1, 2, 3, 4])); // true
```

### strictLength

The `strictLength()` method applies a built-in rule that verifies a value if the value length is less than or equal to the specified minimum length.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).strictLength(5).check);

console.log(check('halo')); // false
console.log(check('hello')); // true
console.log(check('hello, world')); // false
console.log(check([0, 1, 2, 3, 4])); // true
```

### lengthBetween

The `lengthBetween()` method applies a built-in rule that verifies a value if the value length is between minimum and maximum lengths, inclusive.

Example:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).lengthBetween(5, 12).check);

console.log(check('halo')); // false
console.log(check('hello')); // true
console.log(check('hello, world')); // true
console.log(check([0, 1, 2, 3, 4])); // true
```

## LICENSE

[MIT](./LICENSE)
