'use strict'

const testSemigroup = require('./semigroup.spec')
const { randomIntInclusive } = require('../../helpers')

/**
 * Even integers used as multiplicative factors. Note that negative numbeers
 * ARE included, i.e. the even integers include {..., -2, 0, 2, ...}.
 *
 * Intended behavior: EvenFactor -4 * EvenFactor 6 = EvenFactor -24.
 *
 * This set and op together form a *Semigroup*, which is a Magma (closed) and
 * also the op is _associative_. That is:
 *
 *    EvenFactor 6 * (EvenFactor 2  * EvenFactor -4)
 * = (EvenFactor 6 *  EvenFactor 2) * EvenFactor -4
 *
 * Associativity is cool because you can break up an expression into subtasks
 * and run them out of sequence, even in parallel!
 */

class EvenFactor {
	constructor(val = 0) {
		if (val !== Math.floor(val) || val % 2 !== 0) {
			throw Error('value must be an even integer')
		}
		this.val = val
	}

	// functional constructor (aka factory function), no more `new`
	static of(...args) {
		return new EvenFactor(...args)
	}

	static describes(maybeEvenFactor) {
		// `instanceof` won't work across realms but for this exercise it's ok
		return maybeEvenFactor instanceof EvenFactor
	}

	static makeRandom() {
		// floating point math means we can get bad results for too-high values
		return EvenFactor.of(2 * randomIntInclusive(-1e2, 1e2))
	}

	equals(other) {
		return EvenFactor.describes(other) && this.val === other.val
	}

	times(other) {
		return EvenFactor.of(this.val * other.val)
	}
}

module.exports = EvenFactor

/**
 * TESTS
 */

/* eslint-disable no-unused-expressions */

if (process.env.NODE_ENV !== 'testing') return

const { expect } = require('chai')

describe('EvenFactor', () => {
	describe('instance method `times`', () => {
		it('multiplies two even EvenFactors', () => {
			const f1 = EvenFactor.of(0)
			const f2 = EvenFactor.of(2)
			const f1f2 = f1.times(f2)
			expect(f1f2.equals(EvenFactor.of(0))).to.be.true
			// another example for illustration
			const f3 = EvenFactor.of(-12)
			const f4 = EvenFactor.of(10)
			const f3f4 = f3.times(f4)
			expect(f3f4.equals(EvenFactor.of(-120))).to.be.true
		})
	})

	// here is the actual point of the exercise (see ./semigroup.spec.js):
	testSemigroup(EvenFactor, 'times')
})
