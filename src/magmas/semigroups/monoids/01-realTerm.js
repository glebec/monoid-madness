'use strict'

const testMonoid = require('./monoid.spec')
const { randomIntInclusive } = require('../../../helpers')

/**
 * Reals (well, floats) used as additive terms.
 * (Reminder, the reals ℝ are all numbers on the continuous number line.)
 *
 * Intended behavior: RealTerm -1.3498 + RealTerm 1.1 = RealTerm -0.2498.
 *
 * This set and op together form a *Monoid*, which is a Semigroup (associative)
 * and also therefore a Magma (closed), but also with an _identity element_.
 *
 * For the operation `add`, the identity element is 0. That is,
 *
 * RealTerm 9.2834 + RealTerm 0 = RealTerm 9.2834
 * RealTerm 0 + RealTerm 9.2834 = RealTerm 9.2834
 *
 * Identity elements are great because if you know you are going to reduce a
 * list of elements using the op, what do you use as your base value? If you
 * use the identity element then it won't change the results of the reduction.
 * And if you reduce an empty list, you have a fallback value (identity)!
 */

class RealTerm {
	constructor(val = 0) {
		if (typeof val !== 'number' || Number.isNaN(val)) {
			throw Error('value must be a non-NaN number')
		}
		this.val = val
	}

	// functional constructor (aka factory function), no more `new`
	static of(...args) {
		return new RealTerm(...args)
	}

	static describes(maybeRealTerm) {
		// `instanceof` won't work across realms but for this exercise it's ok
		return maybeRealTerm instanceof RealTerm
	}

	static makeRandom() {
		return RealTerm.of(
			(2 * Math.random() - 1) * 10 ** randomIntInclusive(0, 3),
		)
	}

	// Vanilla JS doesn't yet have static props, but can fake it with a getter.
	static get identity() {
		return RealTerm.of(0)
	}

	equals(other) {
		// floating point math strikes again!
		const EPSILON = 0.0000001
		return (
			RealTerm.describes(other) &&
			Math.abs(this.val - other.val) < EPSILON
		)
	}

	add(other) {
		return RealTerm.of(this.val + other.val)
	}
}

module.exports = RealTerm

/**
 * TESTS
 */

/* eslint-disable no-unused-expressions */

if (process.env.NODE_ENV !== 'testing') return

const { expect } = require('chai')

describe('RealTerm', () => {
	describe('static property `identity`', () => {
		it('is a RealTerm of zero', () => {
			const id = RealTerm.identity
			const zero = RealTerm.of(0)
			expect(id.equals(zero)).to.be.true
		})
	})
	describe('instance method `add`', () => {
		it('adds two RealTerms', () => {
			const t1 = RealTerm.of(-1)
			const t2 = RealTerm.of(2)
			const t1t2 = t1.add(t2)
			expect(t1t2.equals(RealTerm.of(1))).to.be.true
			// another example for illustration
			const t3 = RealTerm.of(-9001)
			const t4 = RealTerm.of(1337)
			const t3t4 = t3.add(t4)
			expect(t3t4.equals(RealTerm.of(-7664))).to.be.true
		})
	})

	// here is the actual point of the exercise (see ./monoid.spec.js):
	testMonoid(RealTerm, 'add')
})
