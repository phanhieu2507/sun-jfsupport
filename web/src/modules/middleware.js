import _each from 'lodash/each'
import _isArray from 'lodash/isArray'

const getMiddlewareFrom = (Component) => {
  const declaredMiddleware = Component.middleware

  if (!declaredMiddleware) return []

  return _isArray(declaredMiddleware) ? declaredMiddleware : [declaredMiddleware]
}

export default class Middleware {
  constructor(Context) {
    this.middleware = []
    this.Context = Context
    this.solved = false
  }

  resolve(identifiers = []) {
    if (this.solved) return this.middleware
    _each(identifiers, (name, key) => {
      const matched = name.match(/^([a-z0-9_\-.]+)(?::([a-z0-9_\-.]+))?$/i)
      if (!matched) {
        throw new Error(`Name of middleware "${name}" is invalid. Example: "auth", "auth:admin"`)
      }

      const handle = require(`@jobfair/middleware/${matched[1]}.js`) // eslint-disable-line
      this.middleware.push({
        name: matched[1],
        handle,
        args: matched[2] ? [matched[2]] : [],
        isLast: identifiers.length === key + 1,
      })
    })

    this.solved = true

    return this.middleware
  }

  async validate(Component) {
    const identifiers = getMiddlewareFrom(Component)
    const middleware = this.resolve(identifiers)

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < middleware.length; i++) {
      const { name, handle, args, isLast } = middleware[i]
      const isInvalid = typeof handle.default !== 'function'

      if (isInvalid) {
        throw new Error(`Found "${name}" middleware is not a function.`)
      }

      const response = await Promise.resolve(handle.default({ args, isLast, ...this.Context }, Component)) // eslint-disable-line

      if (response && response.continue) break
    }
  }
}
