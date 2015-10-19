# auditable

auditable models for javascript!

- snapshot a model's history every time it's updated
- snapshot the call stack every time a model's state is modified => know what *caused* a change, what the change was, and when it was changed

### huh?

see https://gist.github.com/bcherny/7b0f6e048e6ceadc2cb2

### usage

```js
const carModel = Auditable({
	make: 'honda',
	model: 'accord',
	year: 2016
})

carModel.year = 2015
carModel.year = 2014

Auditable.getHistoryFor(carModel) // Array[3]
```