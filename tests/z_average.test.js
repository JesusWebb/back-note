const { test, describe } = require('node:test')
const assert = require('node:assert')

const average = require('../utils/z_for_testing').average

describe('AVERAGE', () => {
  test('Average of one value is the value itself', () => {
    const list_average = [1]
    const result_espect = 1

    assert.strictEqual(average(list_average), result_espect)
  })

  test('Average of many is calculated right', () => {
    // eslint-disable-next-line no-magic-numbers
    const list_average = [1, 2, 3, 4, 5, 6]
    const result_espect = 3.5

    assert.strictEqual(average(list_average), result_espect)
  })

  test('Average of empty array is zero', () => {
    const list_average = []
    const result_espect = 0

    assert.strictEqual(average(list_average), result_espect)
  })
})
