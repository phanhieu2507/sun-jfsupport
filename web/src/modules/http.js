import _startsWith from 'lodash/startsWith'
import router from 'next/router'

export const redirect = (destination = '/', { res, status = 302 } = {}) => {
  if (res) {
    res.writeHead(status || 302, { Location: destination })
    res.end()
  } else if (!_startsWith(destination, '//')) {
    router.push(destination)
  } else {
    window.location = destination
  }
}
