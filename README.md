# Immut

> Better immutable data structures for modern browsers

### Usage

```ts
import {List} from 'immut'

// Make a new List
const myList = List(1, 2, 3)

// Modify it (looks mutable, but is immutable under the hood!)
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
//      {data: [10, 20, 3], trace: [
//        "Test.fn (/Users/boris/immut/test.js:7:5)",
//        ...
//      ]},
//      {data: [10, 2, 3], trace: [...]},
//      {data: [1, 2, 3], trace: [...]}
//    ]
```