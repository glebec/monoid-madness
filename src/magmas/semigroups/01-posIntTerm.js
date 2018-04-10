'use strict'

const testSemigroup = require('./semigroup.spec')
const { randomIntInclusive } = require('../../helpers')

/**
 * Positive integers used as additive terms. Note that 0 is not included,
 * i.e. the positive integers ℤ+ = {1, 2, 3, ...}.
 *
 * Intended behavior: PosIntTerm 5 + PosIntTerm 9 = PosIntTerm 14.
 *
 * This set and op together form a *Semigroup*, which is a Magma (closed) and
 * also the op is _associative_. That is:
 *
 *    PosIntTerm 5 + (PosIntTerm 1  + PosIntTerm 9)
 * = (PosIntTerm 5 +  PosIntTerm 1) + PosIntTerm 9
 *
 * Associativity is cool because you can break up an expression into subtasks
 * and run them out of sequence, even in parallel!
 */

class PosIntTerm {
	constructor(val = 1) {
		if (val < 1 || val !== Math.floor(val)) {
			throw Error('value must be a positive integer')
		}
		this.val = val
	}

	// functional constructor (aka factory function), no more `new`
	static of(...args) {
		return new PosIntTerm(...args)
	}

	static describes(maybePosIntTerm) {
		// `instanceof` won't work across realms but for this exercise it's ok
		return maybePosIntTerm instanceof PosIntTerm
	}

	static makeRandom() {
		return PosIntTerm.of(randomIntInclusive(1, 1e9))
	}

	equals(other) {
		return PosIntTerm.describes(other) && this.val === other.val
	}

	add(other) {
		return PosIntTerm.of(this.val + other.val)
	}
}

module.exports = PosIntTerm

/**
 * TESTS
 */

/* eslint-disable no-unused-expressions */

if (process.env.NODE_ENV !== 'testing') return

const { expect } = require('chai')

describe('PosIntTerm', () => {
	describe('instance method `add`', () => {
		it('adds two PosIntTerms, yielding a new PosIntTerm', () => {
			const t1 = PosIntTerm.of(1)
			const t2 = PosIntTerm.of(2)
			const t1t2 = t1.add(t2)
			expect(t1t2.equals(PosIntTerm.of(3))).to.be.true
			// another example for illustration
			const t3 = PosIntTerm.of(9001)
			const t4 = PosIntTerm.of(1337)
			const t3t4 = t3.add(t4)
			expect(t3t4.equals(PosIntTerm.of(10338))).to.be.true
		})
	})

	// here is the actual point of the exercise (see ./semigroup.spec.js):
	testSemigroup(PosIntTerm, 'add')
})
