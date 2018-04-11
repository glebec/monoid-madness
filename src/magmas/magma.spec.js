'use strict'
/* eslint-disable no-unused-expressions, id-length */

const { expect } = require('chai')
const { pluralize } = require('inflection')
const a = require('indefinite')
const { times } = require('../helpers')
const confirmTestable = require('../testable.spec')

const STOCHASTIC_LIMIT_EXCLUSIVE = 11

const testMagma = (Entity, opName) => {
	confirmTestable(Entity)

	const { name: setName } = Entity
	const setNames = pluralize(setName)

	describe(`💝 (${setName} & binary operation \`${opName}\`) as a magma:`, () => {
		it(`\`${opName}\` seems to be closed (if x and y are ${setNames}, then (x ${opName} y) is also ${a(
			setName,
		)})`, () => {
			times(STOCHASTIC_LIMIT_EXCLUSIVE, () => {
				const entity1 = Entity.makeRandom()
				const entity2 = Entity.makeRandom()
				const result = entity1[opName](entity2)
				expect(Entity.describes(result)).to.be.true
			})
		})
	})
}

module.exports = testMagma
