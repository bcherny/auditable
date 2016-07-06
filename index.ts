export interface List<A> extends Array<A> {}

type Data<A> = A[][]

interface DataWithTraces<A> {
  data: A[]
  time: string
  trace: string[]
}

export interface ListConstructor {
  <A>(...as: A[]): Array<A>
  audit<A>(a: List<A>): Data<A>
  auditWithTraces<A>(a: List<A>): DataWithTraces<A>[]
}

const state = {
  audits: new WeakMap<Array<any>, DataWithTraces<any>[]>(),
  proxyByList: new WeakMap<Array<any>, Array<any>>()
}

function JustList<A>(...as: A[]): Array<A> {

  const interceptor = {
    get: function (target: List<A>, prop: number | symbol): A | A[] | Data<A> | { data: A[], trace: string[] }[] {
      const audit = state.audits.get(target)
      switch (prop) {
        case Symbol.toStringTag:
          return audit[0].data
        default:
          return audit[0].data[prop as number]
      }
    },
    set: function (target: List<A>, prop: number | symbol, value: A) {
      const audit = state.audits.get(target)
      const data = audit[0].data.slice(0) // clone
      data[prop as number] = value
      const newAudit: DataWithTraces<A> = {
        data,
        time: getTime(),
        trace: getTrace()
      }
      state.audits.set(target, [newAudit].concat(audit))
      return true
    }
  }

  const proxy = new Proxy<List<A>>(this, interceptor)

  state.audits.set(this, [{
    data: as,
    time: getTime(),
    trace: null
  }])
  state.proxyByList.set(proxy, this)

  return proxy
}

export const List: ListConstructor = Object.assign(JustList, {
  audit: function audit<A>(a: List<A>): Data<A> {
    const proxy = state.proxyByList.get(a)
    return state.audits.get(proxy).map(_ => _.data)
  },
  auditWithTraces: function auditWithTraces<A>(a: List<A>): DataWithTraces<A>[] {
    const proxy = state.proxyByList.get(a)
    return state.audits.get(proxy)
  }
})

function getTime(): string {
  return new Date().toISOString()
}

function getTrace(): string[] {
  try { throw new Error() } catch (e) {
    const stack: string[] = e.stack.split('\n').slice(3)
    stack[0] = stack[0].slice(7) // rm leading "     at" on 1st line
    return stack
  }
}