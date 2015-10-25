# auditable

[![Build Status][build]](https://circleci.com/gh/bcherny/auditable) [![npm]](https://www.npmjs.com/package/auditable)

[build]: https://img.shields.io/circleci/project/bcherny/auditable.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/auditable.svg?style=flat-square

auditable models for javascript!

- snapshot a model's history every time it's updated
- snapshot the call stack every time a model's state is modified => know what *caused* a change, what the change was, and when it was changed

### huh?

see https://gist.github.com/bcherny/7b0f6e048e6ceadc2cb2

### usage

```js
const carModel = new Auditable({
	make: 'honda',
	model: 'accord',
	year: 2016
})

carModel.year = 2015
carModel.year = 2014

Auditable.getHistoryFor(carModel)
/* => [
	{ data: { make: 'honda', model: 'accord', year: 2016 }, cause: Array[CallSite], time: '2015-10-25T22:42:22.030Z' },
	{ data: { make: 'honda', model: 'accord', year: 2015 }, cause: Array[CallSite], time: '2015-10-25T22:42:22.037Z' },
	{ data: { make: 'honda', model: 'accord', year: 2014 }, cause: Array[CallSite], time: '2015-10-25T22:42:22.044Z' }
] */
```

### limitations

- can't add a new property at runtime
- can't remove a property at runtime
- history state storage is pretty inefficient

### todo

- rm above limitations
- improve performance (immutable.js?)
- real world use cases (as an alternative to angular $watch, as an abstraction on top of baobab)
- compare with baobab
- implement with ES7 proxies, to support runtime property addition/removal
- statically typed interface

### why not use Object.observe?

debugging O.o sucks without support for call stacks!