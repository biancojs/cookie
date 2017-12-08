require('jsdom-global')()
const assert = require('assert')
const { readCookie, writeCookie, listKeys, deleteCookie } = require('./')
const doc = window.document
const DOMAIN = 'foo.com'
const PATH = '/path'

describe('Bianco cookie', function() {

  afterEach(function() {
    listKeys().forEach(key => deleteCookie({ key }))
    assert.ok(listKeys().length === 0)
  })

  it('it can read cookies', function() {
    doc.cookie = 'foo=bar;'
    assert.equal(readCookie('foo'), 'bar')
  })

  it('it can set cookies', function() {
    writeCookie({ key: 'foo', value: 'bar' })
    assert.equal(readCookie('foo'), 'bar')
  })

  it('it can list cookies', function() {
    writeCookie({ key: 'foo', value: 'bar' })
    writeCookie({ key: 'baz', value: 'buz' })
    assert.equal(listKeys.length, 2)
  })

  it('it can delete cookies', function() {
    writeCookie({ key: 'foo', value: 'bar' })
    deleteCookie({ key: 'foo' })
    assert.equal(listKeys.length, 0)
  })
})
