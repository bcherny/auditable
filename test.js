import {Map} from './index'
import {equal, notEqual} from 'assert'

const a = new Map({
  a: 1,
  b: 2
})

const b = a.a = 2
const c = b.a = 3
const d = c.a = 4

equal(a.a, 1)
equal(b.a, 2)
equal(c.a, 3)
equal(d.a, 4)

notEqual(a, b)
notEqual(b, c)
notEqual(c, d)