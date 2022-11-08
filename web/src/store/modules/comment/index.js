import types from './types'
import { sagas, actions } from './actions'
import reducer, { selectors } from './reducer'

export default reducer

export {
  types as commentTypes,
  sagas as commentSagas,
  actions as commentActions,
  selectors as commentSelectors,
}
