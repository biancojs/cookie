require('jsdom-global')()
const assert = require('assert')
const cookie = require('./')
const body = document.body

describe('Bianco cookie', function() {
  it('stub', function() {
    assert.equal(typeof cookie, 'object')
  })
})
