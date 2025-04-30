const { test, describe } = require('node:test')
const assert = require('node:assert')

const reverse = require('../utils/z_for_testing').reverse

describe('Reverse', () => {
  test('Reverse of a', () => {
    const result = reverse('a')

    assert.strictEqual(result, 'a')
  })

  test('Reverse of react', () => {
    const result = reverse('react')

    assert.strictEqual(result, 'tcaer')
  })

  test('Reverse of saippuakauppias', () => {
    const result = reverse('saippuakauppias')

    assert.strictEqual(result, 'saippuakauppias')
  })
})
