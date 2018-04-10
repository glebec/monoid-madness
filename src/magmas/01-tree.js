'use strict'

const testMagma = require('./magma.spec')

class Tree {
	constructor(val, left = null, right = null) {
		this.val = val
		this.left = left
		this.right = right
	}

	// functional constructor (aka factory function), no more `new`
	static of(...args) {
		return new Tree(...args)
	}

	static describes(maybeTree) {
		// `instanceof` won't work across realms but for this exercise it's ok
		return maybeTree instanceof Tree
	}

	static makeRandom() {
		// odds of this function recursing forever asymptotically approach zero
		const makeLeft = Math.random() < 0.5
		const makeRight = Math.random() < 0.5
		return Tree.of(
			Math.random(),
			makeLeft ? Tree.makeRandom() : null,
			makeRight ? Tree.makeRandom() : null,
		)
	}

	equals(other) {
		if (
			this.val !== other.val ||
			!!this.left !== !!other.left ||
			!!this.right !== !!other.right ||
			(this.left && !this.left.equals(other.left)) ||
			(this.right && !this.right.equals(other.right))
		) {
			return false
		}
		return true
	}

	fuse(other) {
		return Tree.of(null, this, other)
	}
}

module.exports = Tree

/**
 * TESTS
 */

/* eslint-disable no-unused-expressions */

if (process.env.NODE_ENV !== 'testing') return

const { expect } = require('chai')

describe('Tree', () => {
	describe('instance method `fuse`', () => {
		it('fuses two Trees with a null root as parent', () => {
			const t1 = Tree.of(1)
			const t2 = Tree.of('A')
			const t1t2 = t1.fuse(t2)
			expect(t1t2.equals(Tree.of(null, t1, t2))).to.be.true
			// another example for illustration
			const t3 = Tree.of(1, Tree.of(2))
			const t4 = Tree.of('A', null, Tree.of('B', Tree.of('C')))
			const t3t4 = t3.fuse(t4)
			expect(t3t4.equals(Tree.of(null, t3, t4))).to.be.true
		})
	})

	// here is the actual point of the exercise (see ./magma.spec.js):
	testMagma(Tree, 'fuse')
})
