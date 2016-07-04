import * as Immutable from 'immutable'
import {first} from 'lodash'

const AUDIT = Symbol()
const AUDIT_WITH_TRACES = Symbol()

export interface List<A> extends Array<A> { }

type Data<A> = A[][]

interface DataWithTraces<A> {
  data: A[]
  trace: string[]
}

export interface ListConstructor {
  <A>(...as: A[]): List<A>
  audit<A>(a: List<A>): Data<A>
  auditWithTraces<A>(a: List<A>): DataWithTraces<A>[]
}

interface State<A> {
  audit: {
    data: Immutable.List<A>,
    trace: string[]
  }[]
}

function JustList <A>(...as: A[]): List<A> {

  const state: State<A> = {
    audit: [
      { data: Immutable.List(as), trace: null }
    ]
  }

  const interceptor = {
    get: function (target: List<A>, prop: number | symbol): A | A[] | Data<A> | {data: A[], trace: string[]}[] {
      switch (prop) {
        case Symbol.toStringTag:
          return first(state.audit).data.toJS()
        case AUDIT:
          return state.audit.map(_ => _.data.toJS())
        case AUDIT_WITH_TRACES:
          return state.audit.map(({data, trace}) => ({
            trace,
            data: data.toJS()
          }))
        default:
          return first(state.audit).data.get(prop as number)
      }
    },
    set: function (target: List<A>, prop: number | symbol, value: A) {
      switch (prop) {
        case AUDIT: break
        default:
          state.audit = [
            {
              data: first(state.audit).data.set(prop as number, value),
              trace: getTrace()
            }
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
}

export const List: ListConstructor = Object.assign(JustList, {
  audit: function audit <A>(a: List<A>): Data<A> {
    return a[AUDIT]
  },
  auditWithTraces: function auditWithTraces<A>(a: List<A>): DataWithTraces<A>[] {
    return a[AUDIT_WITH_TRACES]
  }
})

function getTrace(): string[] {
  try { throw new Error } catch (e) {
    const stack: string[] = e.stack.split('\n').slice(3)
    stack[0] = stack[0].slice(7) // rm leading "     at" on 1st line
    return stack
  }
}