import { clone, isPlainObject } from 'lodash'
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

		Auditable.assign(this, data)
		Auditable.addHistoryStateFor(this, data)

	}

	// (auditable: Auditable) => Object
	static clone (auditable) {
		return Object.keys(auditable).map(k => {
			if (isPlainObject(auditable[k])) {
				return Auditable.clone(auditable[k])
			} else {
				return clone(key)
			}
		})
	}

	// (auditable: Auditable, data: Object) => void
	static assign (auditable, data) {

		// (to :> Object, data: Any) => void
		const assign = (to, data) => {

			if (!isPlainObject(data)) {
				return
			}

			Object.keys(data).forEach(k => {
				Object.defineProperty(data, k, {

					// (k: String) => Any
					get: (k) => data[k],

					// (k: String, v: Any) => Any
					set: (k, v) => {
						const cur = Auditable.clone(auditable)
						Auditable.addHistoryStateFor(auditable, cur)
						data[k] = v
					}

 				})
				assign(data[k] = {}, data[k])
			})
		}

		assign(auditable, data)

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