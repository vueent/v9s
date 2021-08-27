# Встроенные правила

Библиотека содержит минимальное количество полезных правил.

## Строка

Метод `string()` применяет встроенное правило, которое верифицирует значение, если его тип - `string`.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).string().check);

console.log(check('42')); // true
console.log(check(42)); // false
```

или

```ts
import v9s from 'v9s';

const check = v9s(false).string().check;

console.log(check('42')); // undefined
console.log(check(42)); // false
```

## Число

Метод `number()` применяет встроенное правило, которое верифицирует значение, если его тип - `number`.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).number().check);

console.log(check(42)); // true
console.log(check('42')); // false
```

## Булево значение

Метод `boolean()` применяет встроенное правило, которое верифицирует значение, если его тип - `boolean`.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).boolean().check);

console.log(check(true)); // true
console.log(check(42)); // false
```

## Объект

Метод `object()` применяет встроенное правило, которое верифицирует значение, если его тип - `object`, и если оно не `null`.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).object().check);

console.log(check({})); // true
console.log(check(null)); // false
console.log(check(42)); // false
```

## Null

Метод `null()` применяет встроенное правило, которое верифицирует значение, если оно равно `null`.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).null().check);

console.log(check(null)); // true
console.log(check({})); // false
console.log(check(42)); // false
```

## Определено

Метод `defined()` применяет встроенное правило, которое верифицирует значение, если оно не равно `undefined`.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).defined().check);

console.log(check(42)); // true
console.log(check(null)); // true
console.log(check(undefined)); // false
```

## Не определено

Метод `notDefined()` применяет встроенное правило, которое верифицирует значение, если оно равно `undefined`.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).notDefined().check);

console.log(check(undefined)); // true
console.log(check(42)); // false
console.log(check(null)); // false
```

## Ничто

Метод `none()` применяет встроенное правило, которое верифицирует значение, если оно равно `null` или `undefined`.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).none().check);

console.log(check(undefined)); // true
console.log(check(null)); // true
console.log(check(42)); // false
```

## Что-то

Метод `notNone()` применяет встроенное правило, которое верифицирует значение, если оно не равно `null` или `undefined`.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).none().check);

console.log(check(42)); // true
console.log(check(undefined)); // false
console.log(check(null)); // false
```

## Равно

Метод `eq()` применяет встроенное правило, которое верифицирует значение, если оно равно эталонному.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).eq(42).check);

console.log(check(42)); // true
console.log(check(43)); // false
console.log(check('42')); // false
```

## Не равно

Метод `ne()` применяет встроенное правило, которое верифицирует значение, если оно не равно эталонному.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).ne(42).check);

console.log(check(43)); // true
console.log(check('42')); // true
console.log(check(42)); // false
```

## Больше

Метод `gt()` применяет встроенное правило, которое верифицирует значение, если оно больше порогового.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).gt(42).check);

console.log(check(43)); // true
console.log(check(42)); // false
```

## Больше либо равно

Метод `gte()` применяет встроенное правило, которое верифицирует значение, если оно больше либо равно пороговому.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).gte(42).check);

console.log(check(43)); // true
console.log(check(42)); // true
console.log(check(41)); // false
```

## Меньше

Метод `lt()` применяет встроенное правило, которое верифицирует значение, если оно меньше порогового.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).lt(42).check);

console.log(check(41)); // true
console.log(check(42)); // false
```

## Меньше либо равно

Метод `lte()` применяет встроенное правило, которое верифицирует значение, если оно меньше либо равно пороговому.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).lte(42).check);

console.log(check(41)); // true
console.log(check(42)); // true
console.log(check(43)); // false
```

## Диапазон

Метод `between()` применяет встроенное правило, которое верифицирует значение, если оно находится между минимальным и максимальным эталонными значениями включительно.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).between(10, 100).check);

console.log(check(10)); // true
console.log(check(50)); // true
console.log(check(9)); // false
console.log(check(101)); // false
```

## Минимальная длина

Метод `minLength()` применяет встроенное правило, которое верифицирует значение, если его длина больше либо равна эталонной.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).minLength(5).check);

console.log(check('halo')); // false
console.log(check('hello')); // true
console.log(check('hello, world')); // true
console.log(check([0, 1, 2, 3, 4])); // true
```

## Максимальная длина

Метод `maxLength()` применяет встроенное правило, которое верифицирует значение, если его длина меньше либо равна эталонной.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).minLength(5).check);

console.log(check('halo')); // true
console.log(check('hello')); // true
console.log(check('hello, world')); // false
console.log(check([0, 1, 2, 3, 4])); // true
```

## Фиксированная длина

Метод `strictLength()` применяет встроенное правило, которое верифицирует значение, если его длина равна эталонной.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).strictLength(5).check);

console.log(check('halo')); // false
console.log(check('hello')); // true
console.log(check('hello, world')); // false
console.log(check([0, 1, 2, 3, 4])); // true
```

## Диапазон длины

Метод `lengthBetween()` применяет встроенное правило, которое верифицирует значение, если его длина находится между минимальным и максимальным эталонными значениями включительно.

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).lengthBetween(5, 12).check);

console.log(check('halo')); // false
console.log(check('hello')); // true
console.log(check('hello, world')); // true
console.log(check([0, 1, 2, 3, 4])); // true
```
