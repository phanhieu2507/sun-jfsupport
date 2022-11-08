import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'

import types from './types'
import enumsStatus from '~/enums/status'

//= ============== SELECTOR ===============//
const loadStatus = (state) => state.getIn(['commentReducer', 'loadStatus'])
const comments = (state) => state.getIn(['commentReducer', 'comments'])

export const selectors = {
  loadStatus,
  comments,
}

//= ============== REDUCER ===============//
const initState = fromJS({
  loadStatus: enumsStatus.LOADING,
  comments: [],
  commentEditing: {},
})

const loading = (state) => state.set('loadStatus', enumsStatus.LOADING)

const loadSuccess = (state, action) => state.set('loadStatus', enumsStatus.SUCCESS).set('comments', fromJS(action.payload))
const loadFail = (state) => state.set('loadStatus', enumsStatus.FAIL)

const storeData = (state, action) => state.set('comments', fromJS(action.payload))

const reducer = handleActions(
  {
    [types.LOAD_COMMENT]: loading,
    [types.LOAD_COMMENT_SUCCESS]: loadSuccess,
    [types.LOAD_COMMENT_FAIL]: loadFail,
    [types.STORE_COMMENTS]: storeData,
    [types.ADD_COMMENT]: storeData,
    [types.DELETE_COMMENT]: storeData,
    [types.EDIT_COMMENT]: storeData,
    [types.CLEAR_STORE]: storeData,
  },
  initState,
)

export default reducer
