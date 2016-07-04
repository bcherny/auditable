"use strict";
const ava_1 = require('ava');
const index_1 = require('./index');
ava_1.default('List', t => {
    const a = index_1.List(1, 2, 3);
    t.is(index_1.List.audit(a).length, 1);
    a[0] = 10;
    a[1] = 20;
    t.is(index_1.List.audit(a).length, 3);
    // t.deepEqual(List.audit(a)[0], [10, 20, 3])
    // t.deepEqual(List.audit(a)[1], [10, 2, 3])
    // t.deepEqual(List.audit(a)[2], [1, 2, 3])
    // t.is(a[0], 10)
    // t.is(a[1], 20)
    // t.is(a.audit[0], 42)
});
// const a = new Map({
//   a: 1,
//   b: 2
// })
// const b = a.a = 2
// const c = b.a = 3
// const d = c.a = 4
// equal(a.a, 1)
// equal(b.a, 2)
// equal(c.a, 3)
// equal(d.a, 4)
// notEqual(a, b)
// notEqual(b, c)
// notEqual(c, d) 
