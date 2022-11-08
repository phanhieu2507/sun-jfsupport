import { createAction } from 'redux-actions'
import types from './types'

//= ============== ACTIONS ===============//
const collapse = createAction(types.COLLAPSE)

export const actions = {
  collapse,
}
