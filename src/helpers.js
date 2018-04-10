'use strict'

const times = (limit, func) => {
	const results = []
	for (let i = 0; i < limit; i++) {
		results.push(func(i))
	}
	return results
}

const randomIntInclusive = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
	times,
	randomIntInclusive,
}
