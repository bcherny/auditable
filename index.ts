import * as Immutable from 'immutable'
import {first} from 'lodash'

export interface List<A> extends Array<A> {
  (): A[][]
}

export interface ListConstructor {
  <A>(...as: A[]): List<A>
  audit<A>(a: List<A>): A[][]
}

interface State<A> {
  audit: Immutable.List<A>[]
}

const AUDIT = Symbol()

export const List: ListConstructor = Object.assign(

  function List <A>(...as: A[]): List<A> {

    const state: State<A> = {
      audit: [
        Immutable.List(as)
      ]
    }

    const interceptor = {
      get: function (target: List<A>, prop: number | symbol): A | A[] | A[][] {
        console.log('get', prop)
        switch (prop) {
          case Symbol.toStringTag: return first(state.audit).toJS()
          case AUDIT: return state.audit.map(_ => _.toJS())
          default: return first(state.audit).get(prop as number)
        }
      },
      set: function (target: List<A>, prop: number | symbol, value: A) {
        console.log('set', prop, value)
        switch (prop) {
          case AUDIT: break
          default:
            state.audit = [
              first(state.audit).set(prop as number, value)
            ].concat(
              state.audit
            )
        }
        return true
      }
    }

    const p = new Proxy<List<A>>(this, interceptor)
    p[AUDIT] = () => state.audit
    return p
  }, {
    audit: function Audit <A>(a: List<A>): A[][] {
      console.log('audit', a)
      return a[AUDIT]
    }
  }
)

function getTrace() {
  try {
    throw new Error
  } catch (e) {
    console.log(e.stack)
  }
}