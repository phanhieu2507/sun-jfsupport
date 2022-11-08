import _isArray from 'lodash/isArray'
import _find from 'lodash/find'

/**
 * @param {string} param
 */
export const getContentRouteParams = (param, routeKeyName = 'hashId') => {
  const matches = param.match(/^([^/]+(?=-))?-?([^/-]+)$/)

  return matches
    ? { slug: matches[1], [routeKeyName]: matches[2] }
    : {}
}

/**
 * Get child component by slot name
 *
 * @param {string} slot
 * @param {Node|Array<Node>} children
 */
export const findSlot = (slot, children = []) => {
  const whereMatchSlot = (child) => child && child.type === slot

  if (_isArray(children)) {
    return _find(children, whereMatchSlot)
  }

  return whereMatchSlot(children) ? children : null
}

export function getCookie(setCookie, name) {
  if (!setCookie) {
    return null
  }

  const xsrfCookies = setCookie[0].split(';')
    .map((c) => c.trim())
    .filter((c) => c.startsWith(`${name}=`))

  if (xsrfCookies.length === 0) {
    return null
  }
  return decodeURIComponent(xsrfCookies[0].split('=')[1])
}
