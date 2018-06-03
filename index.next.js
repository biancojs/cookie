/**
 * Cookie handling library - Based on:
 * @link https://github.com/madmurphy/cookies.js/blob/master/cookies.js
 */


const BEGINNING_OF_TIME = 'Thu, 01 Jan 1970 00:00:00 GMT'
const END_OF_TIME = 'Fri, 31 Dec 9999 23:59:59 GMT'


/**
 * Encode a key to make it safe for being used within a regex
 * @param {string} key - A cookie identifier
 * @returns {string} The safely encoded key
 */
function encodeForRegex(key) {
  return encodeURIComponent(key).replace(/[-.+*]/g, '\\$&')
}

/**
 * Write a key-value pair, also handling Boolean and null values
 * @param {Array} entry - A cookie key-value data pair
 * @returns {string} The compiled key-value pair as a string
 */
function compileKey([key, value]) {
  if (value == null || value === false) {
    return ''
  }

  if (value === true) {
    return key
  }

  return `${key}=${value}`
}


/**
 * Read a cookie value by its name
 * @param {string} key - A cookie identifier
 * @returns {string} The cookie found or an empty string
 */
export function readCookie(key) {
  if (!key) {
    return null
  }

  const check = new RegExp(`(?:(?:^|.*;)\\s*${encodeForRegex(key)}\\s*\\=\\s*([^;]*).*$)|^.*$`)

  return decodeURIComponent(window.document.cookie.replace(check, '$1')) || null
}

/**
 * Write a cookie
 * @param {Object} options - A cookie config object
 */
export function writeCookie({ key, value, maxAge, expires = Infinity, path, domain, secure }) {
  if (!key || /^(?:expires|max-age|path|domain|secure)$/i.test(key)) {
    throw new Error('Key was not provided or is invalid')
  }

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

  window.document.cookie = Object
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
 * @param {Object} options - A cookie config object
 */
export function deleteCookie({ key, path, domain }) {
  writeCookie({
    key,
    value: '',
    expires: BEGINNING_OF_TIME,
    domain,
    path
  })
}

/**
 * Cookie key availability check
 * @param {string} key - A cookie identifier
 * @returns {boolean} Flag that indicates the existence of a key in the cookie
 */
export function hasCookie(key) {
  if (!key) {
    return false
  }

  return new RegExp(`(?:^|;\\s*)${encodeForRegex(key)}\\s*\\=`).test(window.document.cookie)
}

/**
 * Return all cookie keys
 * @returns {Array} All cookies found or an empty string
 */
export function cookieKeys() {
  const replaceRE = /((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g
  const splitRE = /\s*(?:=[^;]*)?;\s*/
  const keys = window.document.cookie.replace(replaceRE, '').split(splitRE)

  return keys.map(key => decodeURIComponent(key))
}

export const cookie = Object.freeze({
  read: readCookie,
  write: writeCookie,
  delete: deleteCookie,
  has: hasCookie,
  keys: cookieKeys
})
