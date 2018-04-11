'use strict'

const testMonoid = require('./monoid.spec')
const { randomString } = require('../../../helpers')

/**
 * Strings used as substrings with concatenation.
 *
 * Intended behavior: SubString 'hi' + SubString 'World' = SubString 'hiWorld'.
 *
 * This set and op together form a *Monoid*, which is a Semigroup (associative)
 * and also therefore a Magma (closed), but also with an _identity element_.
 *
 * For the operation `concat`, the identity element is the empty string ''.
 *
 * SubString 9.2834 + SubString 0 = SubString 9.2834
 * SubString 0 + SubString 9.2834 = SubString 9.2834
 *
 * Identity elements are great because if you know you are going to reduce a
 * list of elements using the op, what do you use as your base value? If you
 * use the identity element then it won't change the results of the reduction.
 * And if you reduce an empty list, you have a fallback value (identity)!
 */

class SubString {
	constructor(val = '') {
		if (typeof val !== 'string') {
			throw Error('value must be a string')
		}
		this.val = val
	}

	// functional constructor (aka factory function), no more `new`
	static of(...args) {
		return new SubString(...args)
	}

	static describes(maybeSubString) {
		// `instanceof` won't work across realms but for this exercise it's ok
		return maybeSubString instanceof SubString
	}

	static makeRandom() {
		return SubString.of(randomString())
	}

	// Vanilla JS doesn't yet have static props, but can fake it with a getter.
	static get identity() {
		return SubString.of('')
	}

	equals(other) {
		return SubString.describes(other) && this.val === other.val
	}

	concat(other) {
		return SubString.of(this.val + other.val)
	}
}

module.exports = SubString

/**
 * TESTS
 */

/* eslint-disable no-unused-expressions */

if (process.env.NODE_ENV !== 'testing') return

const { expect } = require('chai')

describe('SubString', () => {
	describe('static property `identity`', () => {
		it('is a SubString of the empty string', () => {
			const id = SubString.identity
			const empty = SubString.of('')
			expect(id.equals(empty)).to.be.true
		})
	})
	describe('instance method `concat`', () => {
		it('concatenates two SubStrings', () => {
			const t1 = SubString.of('hi')
			const t2 = SubString.of('World')
			const t1t2 = t1.concat(t2)
			expect(t1t2.equals(SubString.of('hiWorld'))).to.be.true
			// another example for illustration
			const t3 = SubString.of('supercali')
			const t4 = SubString.of('fragilistic')
			const t3t4 = t3.concat(t4)
			expect(t3t4.equals(SubString.of('supercalifragilistic'))).to.be.true
		})
	})

	// here is the actual point of the exercise (see ./monoid.spec.js):
	testMonoid(SubString, 'concat')
})
