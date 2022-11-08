import { fromJS } from 'immutable'
import { call, put, takeLatest } from 'redux-saga/effects'
import { createAction, handleActions } from 'redux-actions'
import _map from 'lodash/map'
import { webInit } from '../../api/web-init'

const initialState = fromJS({
  user: null,
  loaded: false,
})

// Action Types
export const LOAD = 'auth/LOAD'
export const LOAD_SUCCESS = 'auth/LOAD_SUCCESS'
export const GET_AUTH = 'auth/GET_AUTH'

// Actions
export const load = createAction(LOAD)
export const loadSuccess = createAction(LOAD_SUCCESS)

// Sagas
function* init(action) {
  const response = yield call(webInit)
  const { res } = action.payload
  res.setHeader('set-cookie', response.headers['set-cookie'])
  try {
    const { user } = response.data.auth
    yield put(loadSuccess(user))
    action.next(user)
  } catch (error) {
    yield put(loadSuccess({}))
    action.next(null)
  }
}

export function* sagas() {
  yield takeLatest(LOAD, init)
}

// Reducers
const handleLoadSuccess = (state, action) => {
  if (action.payload?.role === 1) {
    action.payload.role = 'superadmin'
  } else if (action.payload?.role === 2) {
    action.payload.role = 'member'
  }

  return state.set('loaded', true)
    .set('user', fromJS(action.payload))
}
const auth = (state) => state.get('auth').get('user')
const roles = (state) => _map(state.get('auth').getIn('user.roles'), 'name')

export const selectors = {
  auth,
  roles,
}

export const reducers = handleActions({
  [LOAD_SUCCESS]: handleLoadSuccess,
}, initialState)
