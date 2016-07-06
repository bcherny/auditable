# Auditable

> Auditable data structures for modern browsers

### Installation

```sh
npm install --save auditable
```

### Usage

```ts
import {List} from 'auditable'

// Make a new List
const myList = List(1, 2, 3)

// Modify it
a[0] = 10
a[1] = 20

// Get back a list of changes
console.log(List.audit(myList))
// => [
//      [10, 20, 3],
//      [10, 2, 3],
//      [1, 2, 3]
//    ]

// Get back a list of changes and causes
console.log(List.auditWithTraces(myList))
// => [
//      {
//        data: [10, 20, 3],
//        time: "2016-07-06T01:49:22.559Z",
//        trace: [Test.fn (/Users/boris/auditable/test.js:7:5)", ...]
//      },
//      {data: [10, 2, 3], time: "...", trace: [...]},
//      {data: [1, 2, 3], time: "...", trace: [...]}
//    ]
```

### Scripts

|               |            |
|---------------|------------|
| Run tests     | `npm test` |
| Compile TypeScript | `npm run build` |
| Watch Typescript | `npm run watch` |
| Watch Typescript & TDD tests     | `npm run tdd` |

### TODO

- [x] Array
- [ ] Set
- [ ] WeakSet
- [ ] Object
- [ ] Map
- [ ] WeakMap

### Future direction

If the [operator overloading proposal](https://esdiscuss.org/topic/operator-overloading-proposal) is adopted, we can apply pass-by-value semantics to our auditable types for far more efficient functional data structures:

```ts
const a = Set(1, 2, 3)
const b = a.add(4)
assert(a !== b)
assert(a === Set(1, 2, 3))
assert(b === Set(1, 2, 3, 4))
```