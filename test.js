import { Auditable } from './index'

const car = new Auditable({
	make: 'honda',
	model: 'accord',
	year: 2016
})

function decrementYear (car) {
	car.year = car.year - 1
}

decrementYear(car)
decrementYear(car)
decrementYear(car)

console.log(
	Auditable.getHistoryFor(car)
)