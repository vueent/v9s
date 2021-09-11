# Обучение

## Простой пример

v9s создает цепочку правил. Вы можете интегрировать собственные правила в цепочку при помощи метода `use` или внедрить расширения при помощи метода `inject`. Для валидации значение вызовите метод `check`.

Простой пример:

<code-group>

<code-block title="TS ES Module">

```ts
import v9s from 'v9s';

// создаем экземпляр валидатора с правилами.
const validator = v9s(false).lte(100).gte(10);

const small = validator.check(1); // проверяем маленькое значение

console.log(small); // false

const big = validator.check(110); // проверяем большое значение

console.log(big); // false

const normal = validator.check(50); // проверяем нормальное значение

console.log(normal); // true
```

</code-block>

<code-block title="JS CommonJS">

```js
const { v9s } = require('v9s');

// создаем экземпляр валидатора с правилами.
const validator = v9s(false).lte(100).gte(10);

const small = validator.check(1); // проверяем маленькое значение

console.log(small); // false

const big = validator.check(110); // проверяем большое значение

console.log(big); // false

const normal = validator.check(50); // проверяем нормальное значение

console.log(normal); // undefined
```

</code-block>
</code-group>

Как видите, если ошибок нет, то будет возвращено `undefined`.

## Сообщения об ошибках

Когда вы импортируете библиотеку - вы импортируете функцию `def`, которая устанавливает тип для сообщений об ошибках и опциональное значение ошибки по умолчанию. По умолчанию метод `check` возвращает `T | undefined`, где `T` - тип значения сообщения об ошибке. Для того, чтобы использовать строковые сообщения об ошибках, просто установите типом сообщения (`T`) `string`.

Пример:

```ts
import v9s from 'v9s';

// создаем экземпляр валидатора с правилами и сообщениями об ошибках.
const validator = v9s<string>('invalid value').lte(100).gte(10);

const small = validator.check(1); // проверяем маленькое значение

console.log(small); // 'invalid value'

const big = validator.check(110); // проверяем большое значение

console.log(big); // 'invalid value'

const normal = validator.check(50); // проверяем нормальное значение

console.log(normal); // undefined
```

Давайте перепишем предыдущий пример так, чтобы он получать разные сообщения для каждого из правил:

```ts
import v9s from 'v9s';

// создаем экземпляр валидатора с правилами и сообщениями об ошибках.
const validator = v9s<string>().lte(100, 'too big').gte(10, 'too small');

const small = validator.check(1); // проверяем маленькое значение

console.log(small); // 'too small'

const big = validator.check(110); // проверяем большое значение

console.log(big); // 'too big'

const normal = validator.check(50); // проверяем нормальное значение

console.log(normal); // undefined
```

::: danger ПРЕДУПРЕЖДЕНИЕ
Если значение сообщения об ошибке по умолчанию не задано и не задано сообщение об ошибке для какого либо правила в цепочке - будет выброшено исключение.
:::

```ts
import v9s from 'v9s';

// create a validator instance with rules.
const validator = v9s<string>().lte(100).gte(10);

const normal = validator.check(50); // проверяем нормальное значение

console.log(normal); // undefined

const small = validator.check(1); // Уппс! Error('Undefined default negative value')
```

Если вам нужно использовать другой формат сообщения - задайте его тип:

```ts
import v9s from 'v9s';

enum ValidationError {
  tooSmall,
  tooBig
}

const validator = v9s.lte<ValidationError>(100, ValidationError.tooBig).gte(10, ValidationError.tooSmall);

const small = validator.check(1); // проверяем маленькое значение

console.log(small); // 0

const big = validator.check(110); // проверяем большое значение

console.log(big); // 1

const normal = validator.check(50); // проверяем нормальное значение

console.log(normal); // undefined
```

## Упрощение результата

Порой достаточно получить булево значение без других специальных типов или `undefined` в качестве результата. Для таких целей библиотека предоставляет специальную обертку экземпляра валидатора. Функция `simplify` возвращает функцию с сигнатурой, соответствующей сигнатуре метода `check`:

```ts
type CheckFunc<T> = (value: any, context: any) => T | undefined;
```

Пример:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).lte(100).gte(10));

const small = check(1); // проверяем маленькое значение

console.log(small); // false

const big = check(110); // проверяем большое значение

console.log(big); // false

const normal = check(50); // проверяем нормальное значение

console.log(normal); // true
```

## Последовательности

Но что делать, если нам нужно получать разные сообщения об ошибках для одного и того же правила, но с некоторым набором пороговых значений? Что ж, пришло время вспомнить последовательность выполнения цепочки.

```ts
import v9s from 'v9s';

// создаем экземпляр валидатора с сортированной цепочкой правил и сообщениями об ошибках.
const validator = v9s<string>().gte(10, 'very small').gte(100, 'small');

const verySmall = validator.check(9); // проверяем очень маленькое значение

console.log(verySmall); // 'very small'

const small = validator.check(50); // проверяем маленькое значение

console.log(small); // 'small'

const normal = validator.check(110); // проверяем нормальное значение

console.log(normal); // undefined
```

## Инверсия

Иногда нужно инвертировать результат работы правила. Это легко делается при помощи метода `not`:

```ts
import v9s from 'v9s';

// создадим экземпляр валидатора с инвертированным правилом
const validator = v9s(false).not().string();

const isNumber = validator.check(42); // проверяем число

console.log(isNumber); // undefined

const isString = validator.check('42'); // проверяем строку

console..log(isString); // false (не строка)
```

## Модификатор опциональности

Также можно разрешить `undefined` значения:

```ts
import v9s from 'v9s';

const validator = v9s(false).string().optional();

const isNumber = validator.check(42); // проверяем число

console.log(isNumber); // false

const isString = validator.check('42'); // проверяем строку

console.log(isString); // undefined

const isNotDefined = validator.check(undefined); // проверяем undefined

console.log(isNotDefined); // undefined
```

::: warning ПРЕДУПРЕЖДЕНИЕ
Модификатор `optional` применяется только к конкретному правилу, следующее правило его игнорирует.
:::

## Композиция

Когда необходимо добавить альтернативное условие - самое время использовать метод `or`:

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).string().optional().or(v9s(false).number()));

const isString = validator.check('42');

console.log(isString); // true

const isNotDefined = validator.check(undefined);

console.log(isNotDefined); // true

const isNumber = validator.check(42);

console.log(isNumber); // true

const isBoolean = validator.check(true);

console.log(isBoolean); // false

const isNull = validator.check(null);

console.log(isNull); // false, потому что null !== undefined и может быть корректным значением
```

Обычно не требуется сохранять экземпляр валидатора, только функцию проверки:

```js
import v9s from 'v9s';

const check = v9s(false).string().optional().or(v9s(false).number()).check;

console.log(check('42')); // undefined
```

## Внешние правила

Конечно, библиотека содержит минимальное количество правил внутри, но можно использовать внешние правила. Внешнее правило должно быть совместимо с этой сигнатурой:

```ts
type Rule = (value: any, context: any) => boolean;
```

Давайте создадим собственное правило, которое проверяет, является ли строковое значение целым числом.

```ts
import v9s, { simplify } from 'v9s';

const integer = (value: string) => /^[0-9]+$/.test(value); // проверяем целочисленную строку
const check = simplify(v9s(false).use(integer));

console.log(check('42')); // true
console.log(check('42a')); // false
```

## Модификаторы

Хорошо, мы уверены, что наше значение является целочисленной строкой. Теперь добавим диапазон допустимых значений и преобразуем значение в тип `number` при помощи `Modifier`:

```ts
import v9s, { simplify } from 'v9s';

const integer = (value: string) => /^[0-9]+$/.test(value);
const modify = (value: string) => Number(value); // пробразование сроки в число
const check = simplify(v9s(false).use(integer, undefined, modify).between(10, 100));

console.log(check('42')); // true
console.log(check('9')); // false
console.log(check('110')); // false
```

Сигнатура модификатора:

```ts
type Modifier = (value: any, context: any) => any;
```

## Инъекции

В отличие от внешних правил, инъекции позволяют указать другую цепочку через экземпляр валидатора или функцию с сигнатурой, аналогичной сигнатуре метода `check`. Эта цепочка будет проверяться перед основной. Например, напишем примитивную инъекцию `each`:

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

::: tip ПРИМЕЧАНИЕ
Проверка полных схем не является целью v9s, но, как видите, это возможно.
:::

## Интернационализация

Вместо строковых сообщений можно использовать фабрики сообщений. Эта функция может быть полезна для интернационализированных приложений.

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

::: tip ПРИМЕЧАНИЕ
Если вам нужно получать функции как сообщения об ошибках, задайте сообщения через фабрики: `() => errorMessageFunction`.
:::

## Возврат объекта

В некоторых случаях вы можете захотеть получить объект с полем, отражающим состояние, вместо чистого результата или `undefined`. Обертка `objectify` заставляет цепочку возвращать экземпляр следующего класса:

```ts
/**
 * Успешный или неудачный результат валидации.
 */
export class ValidationResult<T> {
  /**
   * Сообщение об ошибке.
   */
  public readonly error?: T;

  /**
   * Состояние результата валидации.
   */
  public readonly success: boolean;

  constructor(error?: T) {
    this.error = error;
    this.success = error === undefined;
  }
}
```

Пример:

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

## Контекст

Вы видели параметр `context` в предыдущих примерах. Это объект (по умолчанию: `{}`), который перемещается между правилами в цепочке и позволяет обмениваться данными между ними. Контекст может содержать промежуточные вычисления, другие поля субъекта и так далее. В следующем примере промежуточные вычисления перемещаются между правилами:

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

console.log(check([])); // false - пустой
console.log(check([1, 6, 4, 2, 1])); // false - дубликаты `1`
console.log(check([1, 6, 4, 2])); // false - 1 < 10
console.log(check([10, 60, 105, 40, 20])); // false - 105 > 100
console.log(check([10, 60, 40, 20])); // true
```

Еще один вариант применения контекста - условная проверка с привязкой к другим полям объекта. Поля `value` и `name` интерфейса имеют значение только тогда, когда оба не пусты. В следующем примере аргумент контекста вручную передается в функцию `check`.

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
