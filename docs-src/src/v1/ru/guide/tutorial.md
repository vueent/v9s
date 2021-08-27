# Обучение

## Простой пример

v9s создает цепочку правил. Исполнение цепочки начинается с конца и заканчивается в начале цепочки (см. примеры ниже). Вы можете интегрировать собственные правила в цепочку при помощи метода `use`. Для валидации значение вызовите метод `check`.

Просто пример:

```ts
import v9s from 'v9s';

// создаем экземпляр валидатора с правилами
const validator = v9s.lte(100).gte(10);

const small = validator.check(1); // проверяем маленькое значение

console.log(small); // false

const big = validator.check(110); // проверяем большое значение

console.log(big); // false

const normal = validator.check(50); // проверяем нормальное значение

console.log(normal); // true
```

## Сообщения об ошибках

Часто необходимо добавить текст сообщения вместо результата в виде `true` или `false`. Легко, просто добавим второй строковый параметр во встроенное правило или метод `use`. Давайте перепишем предыдущий пример:

```ts
import v9s from 'v9s';

// создаем экземпляр валидатора с правилами и сообщениями об ошибках.
const validator = v9s.lte(100, 'too big').gte(10, 'too small');

const small = validator.check(1); // проверяем маленькое значение

console.log(small); // 'too small'

const big = validator.check(110); // проверяем большое значение

console.log(big); // 'too big'

const normal = validator.check(50); // проверяем нормальное значение

console.log(normal); // true
```

Если вам нужно использовать другой формат сообщения - задайте его тип (кроме `boolean` или `Function`):

```ts
import v9s from 'v9s';

enum ValidationError {
  tooSmall,
  tooBig
}

const validator = v9s.lte<ValidationError>(100, tooBig).gte(10, tooSmall);

const small = validator.check(1); // check small value

console.log(small); // 0

const big = validator.check(110); // check big value

console.log(big); // 1

const normal = validator.check(50); // check normal value

console.log(normal); // true
```

## Последовательности

Но что делать, если нам нужно получать разные сообщения об ошибках для одного и того же правила, но с некоторым набором пороговых значений? Что ж, пришло время вспомнить последовательность выполнения цепочки.

```ts
import v9s from 'v9s';

// создаем экземпляр валидатора с сортированной цепочкой правил и сообщениями об ошибках.
const validator = v9s.gte(100, 'small').gte(10, 'very small');

const verySmall = validator.check(9); // проверяем очень маленькое значение

console.log(verySmall); // 'very small'

const small = validator.check(50); // проверяем маленькое значение

console.log(small); // 'small'

const normal = validator.check(110); // проверяем нормальное значение

console.log(normal); // true
```

## Инверсия

Иногда нужно инвертировать результат работы правила. Легко! Встречайте метод `not`:

```ts
import v9s from 'v9s';

// создадим экземпляр валидатора с инвертированным правилом
const validator = v9s.not().string();

const isNumber = validator.check(42); // проверяем число

console.log(isNumber); // true

const isString = validator.check('42'); // проверяем строку

console..log(isString); // false (не строка)
```

## Модификатор опциональности

В противном случае можно разрешить `undefined` значения:

```ts
import v9s from 'v9s';

const validator = v9s.string().optional();

const isNumber = validator.check(42); // проверяем число

console.log(isNumber); // false

const isString = validator.check('42'); // проверяем строку

console.log(isString); // true

const isNotDefined = validator.check(undefined); // проверяем undefined

console.log(isNotDefined); // true
```

Модификатор `optional` применяется только к конкретному правилу, следующее правило его игнорирует.

## Композиция

Когда необходимо добавить альтернативное условие - самое время использовать метод `or`:

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

console.log(isNull); // false, потому что null !== undefined и может быть корректным значением
```

Обычно не требуется сохранять экземпляр валидатора, только функцию проверки:

```js
import v9s from 'v9s';

const check = v9s.string().optional().or(v9s.number()).check;

console.log(check('42')); // true
```

## Внешние правила

Конечно, библиотека содержит минимальное количество правил внутри, но можно использовать внешние правила. Внешнее правило должно быть совместимо с этой сигнатурой:

```ts
type Rule = (value: any, context: any) => boolean;
```

Давайте создадим собственное правило, которое проверяет, является ли строковое значение целым числом.

```ts
import v9s from 'v9s';

const integer = (value: string) => /^[0-9]+$/.test(value); // проверяем целочисленную строку
const check = v9s.use(integer).check;

console.log(check('42')); // true
console.log(check('42a')); // false
```

## Модификаторы

Хорошо, мы уверены, что наше значение является целочисленной строкой. Теперь добавим диапазон допустимых значений и преобразуем значение в тип `number` при помощи `Modifier`:

```ts
import v9s from 'v9s';

const integer = (value: string) => /^[0-9]+$/.test(value);
const modify = (value: string) => Number(value); // пробразование сроки в число
const check = v9s.between(10, 100).use(integer, undefined, modify).check;

console.log(check('42')); // true
console.log(check('9')); // false
console.log(check('110')); // false
```

Сигнатура модификатора:

```ts
type Modifier = (value: any, context: any) => any;
```

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

const check = v9s.between(10, 100, errorMessageFactory).check;

console.log(check(50)); // true
console.log(check(110)); // 'Invalid value'

lang = Lang.de;

console.log(check(110)); // 'Ungültiger Wert'

lang = Lang.ru;

console.log(check(110)); // 'Неверное значение'
```

## Контекст

Вы видели параметр `context` в предыдущих примерах. Это объект (по умолчанию: `{}`), который перемещается между правилами в цепочке и позволяет обмениваться данными между ними. Контекст может содержать промежуточные вычисления, другие поля субъекта и так далее. В следующем примере промежуточные вычисления перемещаются между правилами:

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

console.log(check([])); // false - пустой
console.log(check([1, 6, 4, 2, 1])); // false - дубликаты `1`
console.log(check([1, 6, 4, 2])); // false - 1 < 10
console.log(check([10, 60, 105, 40, 20])); // false - 105 > 100
console.log(check([10, 60, 40, 20])); // true
```

Еще один вариант применения контекста - условная проверка с привязкой к другим полям объекта. Поля `value` и `name` интерфейса имеют значение только тогда, когда оба не пусты. В следующем примере аргумент контекста вручную передается в функцию `check`.

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
