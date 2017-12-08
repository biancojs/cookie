/**
 * Cookie handling library - Based on:
 * @link https://github.com/madmurphy/cookies.js/blob/master/cookies.js
 */
const BEGINNING_OF_TIME = 'Thu, 01 Jan 1970 00:00:00 GMT'
const END_OF_TIME = 'Fri, 31 Dec 9999 23:59:59 GMT'

const SAFE_RE = /[-.+*]/g
const KEYS_BLACKLIST_RE = /^(?:expires|max-age|path|domain|secure)$/i

const REPLACE_RE = /((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g
const SPLIT_RE = /\s*(?:=[^;]*)?;\s*/

const doc = window.document

/**
 * Encode a key to make it safe for being used within a regex
 * @private
 * @param {String} key - A cookie identifier
 * @returns {String} The safely encoded key
 */
function encodeForRegex(key) {
  return encodeURIComponent(key).replace(SAFE_RE, '\\$&')
}

/**
 * Write a key-value pair, also handling Boolean and null values
 * @private
 * @param {Array} entry - A cookie key-value data pair
 * @returns {String} The compiled key-value pair as a string
 */
function compileKey([key, value]) {
  if (value == null || value === false) return ''
  if (value === true) return key

  return `${ key }=${ value }`
}


/**
 * Read a cookie value by its name
 * @param {String} key - A cookie identifier
 * @returns {String} The cookie found or an empty string
 */
export function readCookie(key) {
  if (!key) return null

  const check = new RegExp(`(?:(?:^|.*;)\\s*${ encodeForRegex(key) }\\s*\\=\\s*([^;]*).*$)|^.*$`)

  return decodeURIComponent(doc.cookie.replace(check, '$1')) || null
}

/**
 * Write a cookie
 * @param { Object } options - A cookie config object
 * @returns { String } the new cookies string updated
 */
export function writeCookie({ key, value, maxAge, expires = Infinity, path, domain, secure }) {
  if (!key || KEYS_BLACKLIST_RE.test(key)) {
    throw new Error('Key was not provided or is invalid')
  }

  // set the expiration
  if (!maxAge) {
    switch (expires.constructor) {
    case Number:
      expires = expires === Infinity ? END_OF_TIME : new Date(expires).toUTCString()
      break
    case Date:
      expires = expires.toUTCString()
      break
    default:
      break
    }
  }

  return doc.cookie = Object
    .entries({
      [encodeURIComponent(key)]: encodeURIComponent(value),
      expires,
      'max-age': maxAge,
      domain,
      path,
      secure: !!secure
    })
    .map(compileKey)
    .filter(Boolean)
    .join('; ')
}

/**
 * Remove a cookie by setting its expiry date into the past
 * @param { Object } options - A cookie config object
 * @returns { String } the new cookies string updated
 */
export function deleteCookie({ key, path, domain }) {
  return writeCookie({
    key,
    value: '',
    expires: BEGINNING_OF_TIME,
    domain,
    path
  })
}

/**
 * Cookie key availability check
 * @param { String } key - A cookie identifier
 * @returns { Boolean } Flag that indicates the existence of a key in the cookie
 */
export function hasCookie(key) {
  if (!key) return false

  return new RegExp(`(?:^|;\\s*)${ encodeForRegex(key) }\\s*\\=`).test(doc.cookie)
}

/**
 * Return all cookie keys
 * @returns { Array } All cookies found or an empty string
 */
export function listKeys() {
  const keys = doc.cookie.replace(REPLACE_RE, '').split(SPLIT_RE)

  return keys.map(key => decodeURIComponent(key))
}
