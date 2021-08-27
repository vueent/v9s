# Руководство по миграции

Есть несколько критических различий между версиями 1 и 2 v9s. Во-первых, направление исполнения цепочки было изменене на человекочитаемое _слева-направо_. Во-вторых, экспортом библиотеки по умолчанию (`default export`) стала функция, которая определяет тип сообщений об ошибках и опциональное значение ошибки по умолчанию. В-третьих, метод `check` возвращает `T | undefined` (здесь `T` - тип сообщения об ошибке) вместо `T | boolean`.

<code-group>
<code-block title="V1">

```ts
import v9s from 'v9s';

const check = v9s.gte(100, 'too small').gte(10, 'too very small').number('not a number').check;

console.log(check('42')); // 'not a number'
console.log(check(5)); // 'too very small'
console.log(check(50)); // 'too small'
console.log(check(105)); // true
```

</code-block>

<code-block title="V2">

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

</code-block>
</code-group>

Если хотите сохранить поведение версии 1 - используйте обертку `simplify` и реверсируйте порядок правил:

<code-group>
<code-block title="V1">

```ts
import v9s from 'v9s';

const check = v9s.gte(100, 'too small').gte(10, 'too very small').number('not a number').check;

console.log(check('42')); // 'not a number'
console.log(check(5)); // 'too very small'
console.log(check(50)); // 'too small'
console.log(check(105)); // true
```

</code-block>

<code-block title="V2">

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

</code-block>
</code-group>

Чтобы получить только результат `true/false`, следуйте следующему шаблону (**это другая цепочка**):

<code-group>
<code-block title="V1">

```ts
import v9s from 'v9s';

const check = v9s.lte(100).gte(10).number().check;

console.log(check('42')); // false
console.log(check(5)); // false
console.log(check(105)); // false
console.log(check(50)); // true
```

</code-block>

<code-block title="V2">

```ts
import v9s, { simplify } from 'v9s';

const check = simplify(v9s(false).number().gte(10).lte(100));

console.log(check('42')); // false
console.log(check(5)); // false
console.log(check(105)); // false
console.log(check(50)); // true
```

</code-block>
</code-group>
