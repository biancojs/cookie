require('jsdom-global')()
const assert = require('assert')
const cookie = require('./')

describe('Bianco cookie', function() {
  it('stub', function() {
    assert.equal(typeof cookie, 'object')
  })
})
