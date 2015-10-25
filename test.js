import { Auditable } from './index'

export function setUp (done) {
	this.car = new Auditable({
		make: 'honda',
		model: 'accord',
		year: 2016
	})
	done()
}

export function getters (test) {

	test.equal(this.car.make, 'honda')
	test.equal(this.car.model, 'accord')
	test.equal(this.car.year, 2016)
	test.done()

}

export function setters (test) {

	test.equal(this.car.make, 'honda')
	test.equal(this.car.make = 'toyota', 'toyota')
	test.equal(this.car.make, 'toyota')
	test.equal(this.car.make = 'honda', 'honda')
	test.equal(this.car.make, 'honda')
	test.done()

}

export function getHistoryFor (test) {

	test.equal(Auditable.getHistoryFor(this.car).length, 1)
	assertHistoryState(
		test,
		Auditable.getHistoryFor(this.car)[0],
		{ make: 'honda', model: 'accord', year: 2016 }
	)

	this.car.make = 'toyota'
	this.car.model = 'corolla'
	test.equal(Auditable.getHistoryFor(this.car).length, 3)
	
	;[
		{ make: 'honda', model: 'accord', year: 2016 },
		{ make: 'toyota', model: 'accord', year: 2016 },
		{ make: 'toyota', model: 'corolla', year: 2016 }
	]
	.forEach((data, n) => assertHistoryState(test, Auditable.getHistoryFor(this.car)[n], data))

	test.done()

}

// (test: Object, historyState: AuditableHistoryState, data: Object) => void
// @throws AssertionError
function assertHistoryState (test, historyState, data) {
	test.deepEqual(historyState.data, data)
	test.ok(isValidDate(new Date(historyState.time)))
	test.ok(historyState.cause.every(isCallSite))
}

// (a:> CallSite) => Boolean
function isCallSite (a) {
	return typeof a.getFileName() == 'string'
}

// (a:> Date) => Boolean
function isValidDate (a) {
	// @see http://stackoverflow.com/a/1353711/435124
	return (Object.prototype.toString.call(a) === '[object Date]') && !isNaN(a.getTime())
}