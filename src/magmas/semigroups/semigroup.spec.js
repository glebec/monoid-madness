'use strict'
/* eslint-disable no-unused-expressions, id-length */

const { expect } = require('chai')
const { times } = require('../../helpers')
const confirmTestable = require('../../testable.spec')
const testMagma = require('../magma.spec')

const STOCHASTIC_LIMIT_EXCLUSIVE = 11

const testSemigroup = (Entity, opName) => {
	confirmTestable(Entity)

	const { name: setName } = Entity

	describe(`💕 (${setName} & binary operation \`${opName}\`) as a semigroup:`, () => {
		testMagma(Entity, opName)

		it(`\`${opName}\` is associative ((x ${opName} y) ${opName} z = x ${opName} (y ${opName} z))`, () => {
			times(STOCHASTIC_LIMIT_EXCLUSIVE, () => {
				const entity1 = Entity.makeRandom()
				const entity2 = Entity.makeRandom()
				const entity3 = Entity.makeRandom()
				const result1 = entity1[opName](entity2)[opName](entity3)
				const result2 = entity1[opName](entity2[opName](entity3))
				expect(result1.equals(result2)).to.be.true
			})
		})
	})
}

module.exports = testSemigroup
