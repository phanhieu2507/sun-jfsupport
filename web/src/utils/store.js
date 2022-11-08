import _curry from 'lodash/curry'
import _assign from 'lodash/assign'

export const usePromise = _curry((dispatch, action) => new Promise((resolve, reject) => {
  // hack to redux-action: resolve, reject will be called in redux-action
  dispatch(_assign({}, action, {
    next: resolve,
    throw: reject,
  }))
}))
