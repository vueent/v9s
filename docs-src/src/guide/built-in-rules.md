# Built-in rules

The library contains a minimal number of useful rules.

## String

The `string()` method applies a built-in rule that verifies a value if the value type is `string`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.string().check;

console.log(check('42')); // true
console.log(check(42)); // false
```

## Number

The `number()` method applies a built-in rule that verifies a value if the value type is `number`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.number().check;

console.log(check(42)); // true
console.log(check('42')); // false
```

## Boolean

The `boolean()` method applies a built-in rule that verifies a value if the value type is `boolean`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.boolean().check;

console.log(check(true)); // true
console.log(check(42)); // false
```

## Object

The `object()` method applies a built-in rule that verifies a value if the value type is `object` and the value is not `null`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.object().check;

console.log(check({})); // true
console.log(check(null)); // false
console.log(check(42)); // false
```

## Null

The `null()` method applies a built-in rule that verifies a value if the value is `null`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.null().check;

console.log(check(null)); // true
console.log(check({})); // false
console.log(check(42)); // false
```

## Defined

The `defined()` method applies a built-in rule that verifies a value if the value is not `undefined`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.defined().check;

console.log(check(42)); // true
console.log(check(null)); // true
console.log(check(undefined)); // false
```

## Not defined

The `notDefined()` method applies a built-in rule that verifies a value if the value is `undefined`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.notDefined().check;

console.log(check(undefined)); // true
console.log(check(42)); // false
console.log(check(null)); // false
```

## None

The `none()` method applies a built-in rule that verifies a value if the value is `null` or `undefined`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.none().check;

console.log(check(undefined)); // true
console.log(check(null)); // true
console.log(check(42)); // false
```

## Not none

The `notNone()` method applies a built-in rule that verifies a value if the value is not `null` or `undefined`.

Example:

```ts
import v9s from 'v9s';

const check = v9s.none().check;

console.log(check(42)); // true
console.log(check(undefined)); // false
console.log(check(null)); // false
```

## Equal

The `eq()` method applies a built-in rule that verifies a value if the value is equal to the referenced value.

Example:

```ts
import v9s from 'v9s';

const check = v9s.eq(42).check;

console.log(check(42)); // true
console.log(check(43)); // false
console.log(check('42')); // false
```

## Not Equal

The `ne()` method applies a built-in rule that verifies a value if the value is not equal to the referenced value.

Example:

```ts
import v9s from 'v9s';

const check = v9s.ne(42).check;

console.log(check(43)); // true
console.log(check('42')); // true
console.log(check(42)); // false
```

## Greater

The `gt()` method applies a built-in rule that verifies a value if the value is greater than the threshold.

Example:

```ts
import v9s from 'v9s';

const check = v9s.gt(42).check;

console.log(check(43)); // true
console.log(check(42)); // false
```

## Greater or equal

The `gte()` method applies a built-in rule that verifies a value if the value is greater than or equal to the threshold.

Example:

```ts
import v9s from 'v9s';

const check = v9s.gte(42).check;

console.log(check(43)); // true
console.log(check(42)); // true
console.log(check(41)); // false
```

## Less

The `lt()` method applies a built-in rule that verifies a value if the value is less than the threshold.

Example:

```ts
import v9s from 'v9s';

const check = v9s.lt(42).check;

console.log(check(41)); // true
console.log(check(42)); // false
```

## Less or equal

The `lte()` method applies a built-in rule that verifies a value if the value is less than or equal to the threshold.

Example:

```ts
import v9s from 'v9s';

const check = v9s.lte(42).check;

console.log(check(41)); // true
console.log(check(42)); // true
console.log(check(43)); // false
```

## Between

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

## Minimum length

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

## Maximum length

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

## Strict length

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

## Length between

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
