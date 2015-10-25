import { cloneDeep, isPlainObject } from 'lodash'
import { get as getStackTrace } from 'stack-trace'

class AuditableHistoryState {

	// (data: Object) => AuditableHistoryState
	constructor (data) {
		return {
			cause: getStackTrace().slice(3),
			data: data,
			time: new Date().toISOString()
		}
	}

}

export class Auditable {

	// (data: Object) => Auditable
	constructor (data) {

		if (!isPlainObject(data)) {
			throw new TypeError('data should be an object')
		}

		this.data = {}

		Auditable.assign(this, this.data, data)
		Auditable.addHistoryStateFor(this, data)

	}

	// (data: Object) => Object
	static clone (data) {
		return cloneDeep(data)
	}

	// (auditable: Auditable, store: Object, data: Object) => void
	static assign (auditable, store, data) {

		// (to :> Object, store: Object, data: Any) => void
		const assign = (to, store, data) => {
			Object.keys(data).forEach(k => {
				if (isPlainObject(data[k])) {
					assign(to[k] = {}, store[k] = {}, data[k])
				} else {
					store[k] = Auditable.clone(data[k])
					Object.defineProperty(to, k, {

						// (k: String) => Any
						get: () => store[k],

						// (v: Any) => Any
						set: (v) => {
							store[k] = Auditable.clone(v)
							Auditable.addHistoryStateFor(auditable, Auditable.clone(auditable.data))
						}

	 				})
	 			}
			})
		}

		assign(auditable, store, data)

	}

	// (auditable: Auditable, data: Object) => AuditableHistoryState
	static addHistoryStateFor (auditable, data) {

		if (!Auditable.histories.has(auditable)) {
			Auditable.histories.set(auditable, [])
		}

		Auditable.histories.get(auditable).push(
			new AuditableHistoryState(data)
		)

	}

	// (auditable: Auditable) => Array[AuditableHistoryState]
	static getHistoryFor (auditable) {

		return Auditable.histories.has(auditable)
			? Auditable.histories.get(auditable)
			: []

	}

}

Auditable.histories = new WeakMap