# Migration guide

There are some breaking changes between v1 and v2 of v9s. First of all, the chain execution direction was changed to the human friendly _left-to-right_. Second, the default library export (`default export`) became a function which specifies a type of error messages and the optional default error message. Third, `check` method returns `T | undefined` (here `T` - the error message type) instead of `T | boolean`.

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

If you want to preserve of v1 behavior use the `simplify` wrapper and reverse the rule order:

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

To receive only a `true/false` result follow the next pattern (**the chain is different**):

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
