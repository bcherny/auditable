import test, {ContextualTestContext} from 'ava'
import {List} from './index'

test('List', t => {
  const a = beforeEach(t)
  t.is(a[0], 10)
  t.is(a[1], 20)
  t.is(a[2], 3)
})

test('List#audit', t => {
  const a = beforeEach(t)
  t.is(List.audit(a).length, 3)
  t.deepEqual(List.audit(a)[0], [10, 20, 3])
  t.deepEqual(List.audit(a)[1], [10, 2, 3])
  t.deepEqual(List.audit(a)[2], [1, 2, 3])
})

test('List#auditWithTraces', function testAuditWithTraces(t) {
  const a = beforeEach(t)
  a[2] = 30
  t.is(List.auditWithTraces(a).length, 4)
  t.deepEqual(List.auditWithTraces(a)[0].data, [10, 20, 30])
  t.deepEqual(List.auditWithTraces(a)[1].data, [10, 20, 3])
  t.deepEqual(List.auditWithTraces(a)[2].data, [10, 2, 3])
  t.is(List.auditWithTraces(a)[0].trace[0].indexOf('Test.testAuditWithTraces'), 0)
  t.is(List.auditWithTraces(a)[1].trace[0].indexOf('beforeEach'), 0)
})

function beforeEach(t: ContextualTestContext): List<number> {
  const a = List(1, 2, 3)
  a[0] = 10
  a[1] = 20
  return a
}

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