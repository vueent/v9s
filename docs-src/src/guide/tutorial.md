# Tutorial

## Simple example

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

## Error messages

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

::: danger
If no default error message is specified and no error message is specified for some rule in the chain too, an exception will be thrown.
:::

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

const validator = v9s<ValidationError>().lte(100, tooBig).gte(10, tooSmall);

const small = validator.check(1); // check small value

console.log(small); // 0

const big = validator.check(110); // check big value

console.log(big); // 1

const normal = validator.check(50); // check normal value

console.log(normal); // undefined
```

## Simplifier

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

## Sequence

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

## Inversion

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

## Optional modifier

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

::: warning
The `optional` modifier applies only to the specified rule; the next rule ignores it.
:::

## Composition

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

## External rules

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

## Modifiers

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

## Injections

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

::: tip
Checking complete schemas isn't the goal of v9s, but as you can see it is possible.
:::

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

const check = v9s<string>().between(10, 100, errorMessageFactory).check;

console.log(check(50)); // undefined
console.log(check(110)); // 'Invalid value'

lang = Lang.de;

console.log(check(110)); // 'Ungültiger Wert'

lang = Lang.ru;

console.log(check(110)); // 'Неверное значение'
```

::: tip
If you have to receive functions as error messages, specify messages via factories: `() => errorMessageFunction`.
:::

## Result object

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

## Context

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
