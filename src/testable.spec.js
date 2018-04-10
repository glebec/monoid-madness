'use strict'
/* eslint-disable no-unused-expressions */

/**
 * Helper interface test for generic Testable concept.
 *
 * Reused by many specs, hence a function which takes an entity class and
 * dynamically generates new test suites / specs.
 *
 * If you want to make your own Testables, make sure they have the following:
 *
 * - Static `name` (for the entire class, e.g. `Tree.name == 'Tree'`). Note
 *   that ES2015 `class`es and other named functions already have a `name`.
 * - Static `makeRandom()` generates a random instance of the class.
 * - Static `describes(maybeInstance)` confirms that the arg is an instance.
 * - Method `equals` tests if two instances are equivalent (class-dependant).
 */

const { expect } = require('chai')
const { times } = require('./helpers')

const STOCHASTIC_LIMIT_EXCLUSIVE = 11
const staticMethods = ['describes', 'makeRandom']
const instanceMethods = ['equals']
const confirmedTestables = new Set()

const confirmTestable = Testable => {
	// only check Testable once
	if (confirmedTestables.has(Testable)) return
	confirmedTestables.add(Testable)
	// first time check
	describe(`${Testable.name || 'MISSING NAME'} as a Testable:`, () => {
		// To keep the noise down, this is a monolithic composite spec.
		// In non-exercise code we would split these out into smaller specs.
		it('has the requisite shape and behavior', () => {
			// has a `name`
			expect(Testable).to.have.property('name')
			expect(Testable.name).to.be.a('string')
			// has expected static methods
			staticMethods.forEach(methodName => {
				expect(Testable).to.have.property(methodName)
				expect(Testable[methodName]).to.be.a('function')
			})
			// has expected instance methods
			const randInstance = Testable.makeRandom()
			instanceMethods.forEach(methodName => {
				expect(randInstance).to.have.property(methodName)
				expect(randInstance[methodName]).to.be.a('function')
			})
			// `describes` rejects non-entities
			;['hi', 1, null, [], {}, false, undefined].forEach(type => {
				expect(Testable.describes(type)).to.be.false
			})
			// `makeRandom` makes entities
			const instances = times(STOCHASTIC_LIMIT_EXCLUSIVE, () => {
				const instance = Testable.makeRandom()
				expect(Testable.describes(instance)).to.be.true
				return instance
			})
			// impossible to truly test randomness, but this should suffice
			const atLeastOneDifferent = instances.some(
				(instance, idx) =>
					idx > 0 && !instances[idx - 1].equals(instance),
			)
			expect(atLeastOneDifferent).to.be.true
			// entities should equal themselves
			const thingsAreThemselves = instances.every(instance =>
				instance.equals(instance),
			)
			expect(thingsAreThemselves).to.be.true
		})
	})
}

module.exports = confirmTestable
