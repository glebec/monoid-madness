'use strict'
/* eslint-disable no-unused-expressions, id-length */

const { expect } = require('chai')
const { times } = require('../../../helpers')
const confirmTestable = require('../../../testable.spec')
const testSemigroup = require('../semigroup.spec')

const STOCHASTIC_LIMIT_EXCLUSIVE = 11

const testMonoid = (Entity, opName) => {
	confirmTestable(Entity)

	const { name: setName } = Entity

	describe(`💘 (${setName} & binary operation \`${opName}\`) as a monoid:`, () => {
		testSemigroup(Entity, opName)

		it(`seems to have an identity element I (x ${opName} I = x = I ${opName} x)`, () => {
			expect(Entity).to.have.property('identity')
			const id = Entity.identity
			times(STOCHASTIC_LIMIT_EXCLUSIVE, () => {
				const entity = Entity.makeRandom()
				const result1 = entity[opName](id)
				const result2 = id[opName](entity)
				expect(result1.equals(entity)).to.be.true
				expect(result2.equals(entity)).to.be.true
			})
		})
	})
}

module.exports = testMonoid
