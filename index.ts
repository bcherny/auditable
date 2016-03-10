import * as Immutable from 'immutable'
import {last} from 'lodash'

export function Map (data?: Object) {
  const history = [
    new Immutable.Map(data)
  ]
  const interceptor = {
    get: function (target: Object, prop: string): any {
      return last(history).get(prop)
    },
    set: function <A>(target: Object, prop: string, value: A): A {
      history.push(
        last(history).set(prop, value)
      )
      return this
    }
  }
  return new Proxy(data, interceptor)
}